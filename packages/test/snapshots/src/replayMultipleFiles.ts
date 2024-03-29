/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { strict as assert } from "assert";
import fs from "fs";
import nodePath from "path";

import { ReplayArgs, ReplayTool } from "@fluid-internal/replay-tool";
import { Deferred } from "@fluidframework/core-utils";
import { ISequencedDocumentMessage } from "@fluidframework/protocol-definitions";

import { _dirname } from "./dirname.cjs";
import { getMetadata, writeMetadataFile } from "./metadata.js";
import { pkgVersion } from "./packageVersion.js";
import { getTestContent } from "./testContent.js";
import { validateSnapshots } from "./validateSnapshots.js";

// Determine relative file locations
function getFileLocations(): [string, string] {
	// Correct if executing from working directory of package root
	const testCollateral = getTestContent("snapshotTestContent");
	let workerPath = "./lib/replayWorker.js";
	if (fs.existsSync(workerPath) && testCollateral.exists) {
		return [testCollateral.path, workerPath];
	}
	// Relative to this generated js file being executed
	workerPath = nodePath.join(_dirname, "..", workerPath);
	assert(
		fs.existsSync(workerPath),
		`Cannot find worker js or test content file: ${workerPath}, ${testCollateral.path}`,
	);
	return [testCollateral.path, workerPath];
}
const [fileLocation, workerLocation] = getFileLocations();

const currentSnapshots = "current_snapshots";
const srcSnapshots = "src_snapshots";
const baseSnapshot = "base_snapshot";

const numberOfThreads = 4;

export enum Mode {
	Compare, // Compare snapshots generated to files stored on disk.
	Stress, // Do stress testing without writing or comparing out files.
	Validate, // Validate that we can load documents from old snapshots.
	BackCompat, // Validate that we can load documents from old snapshots and write snapshots in current format.
	NewSnapshots, // Generate reference files for new snapshots.
	UpdateSnapshots, // Update the current snapshot files.
}

export interface IWorkerArgs {
	folder: string;
	mode: Mode;
	snapFreq?: number;
	testSummaries?: boolean;
	initializeFromSnapshotsDir?: string;
}

class ConcurrencyLimiter {
	private readonly promises: Promise<void>[] = [];
	private deferred: Deferred<void> | undefined;

	constructor(private limit: number) {}

	async addWork(worker: () => Promise<void>) {
		this.limit--;
		if (this.limit < 0) {
			assert(this.deferred === undefined);
			this.deferred = new Deferred<void>();
			await this.deferred.promise;
			assert(this.deferred === undefined);
			assert(this.limit >= 0);
		}

		const p = worker().then(() => {
			this.limit++;
			if (this.deferred) {
				assert(this.limit === 0);
				this.deferred.resolve();
				this.deferred = undefined;
			}
		});
		this.promises.push(p);
	}

	async waitAll() {
		return Promise.all(this.promises);
	}
}

/**
 * Processes one node of the snapshot contents folder. Each node can have the following:
 *
 * 1. `messages.json`: This file contains the messages to be replayed by the replay tool.
 *
 * 2. `currentSnapshots`: A list of snapshots in the latest format. In Mode.Compare, snapshots generated by the replay
 * tool are compared against these.
 *
 * 3. `srcSnapshots`: This folder contains snapshots in older versions. There is one folder for each set of snapshots
 * in a previous version. In Mode.Validate, a container is loaded from each of these older snapshot and validated
 * that it loads successfully.
 *
 * 4. `baseSnapshot`: This folder is present for snapshots from newer documents that use detached container flow. It
 * contains the base snapshot to load the container with.
 */
export async function processOneNode(args: IWorkerArgs) {
	const replayArgs = new ReplayArgs();

	replayArgs.verbose = false;
	replayArgs.inDirName = args.folder;
	// we should be explicit for all channel types in our snapshot tests
	replayArgs.strictChannels = true;
	// The output snapshots to compare against are under "currentSnapshots" sub-directory.
	replayArgs.outDirName = `${args.folder}/${currentSnapshots}`;
	replayArgs.snapFreq = args.snapFreq;
	replayArgs.testSummaries = args.testSummaries;
	replayArgs.write = args.mode === Mode.NewSnapshots || args.mode === Mode.UpdateSnapshots;
	replayArgs.compare = args.mode === Mode.Compare;
	// Make it easier to see problems in stress tests
	replayArgs.expandFiles = args.mode === Mode.Stress;
	replayArgs.initializeFromSnapshotsDir = args.initializeFromSnapshotsDir;
	// The base snapshot directory name is the version from which the document is to be loaded.
	replayArgs.fromVersion = baseSnapshot;

	// Worker threads does not listen to unhandled promise rejections. So set a listener and
	// throw error so that worker thread could pass the message to parent thread.
	const listener = (error) => {
		process.removeListener("unhandledRejection", listener);
		console.error(`unhandledRejection\n ${JSON.stringify(args)}\n ${error}`);
		throw error;
	};
	process.on("unhandledRejection", listener);

	// This will speed up test duration by ~17%, at the expense of losing a bit on coverage.
	// replayArgs.overlappingContainers = 1;

	try {
		const errors = await new ReplayTool(replayArgs).Go();
		if (errors.length !== 0) {
			throw new Error(`Errors\n ${errors.join("\n")}`);
		}
	} catch (error) {
		console.error(`Unhandled Error processing \n ${JSON.stringify(args)}\n ${error}`);
		throw error;
	}
}

export async function processContent(mode: Mode, concurrently = true) {
	const limiter = new ConcurrencyLimiter(numberOfThreads);

	for (const node of fs.readdirSync(fileLocation, { withFileTypes: true })) {
		if (!node.isDirectory()) {
			continue;
		}
		const folder = `${fileLocation}/${node.name}`;
		const messages = `${folder}/messages.json`;
		if (!fs.existsSync(messages)) {
			console.error(`Can't locate ${messages}`);
			continue;
		}
		// Clean up any failed snapshots that might have been written out in previous test run.
		cleanFailedSnapshots(folder);

		// SnapFreq is the most interesting options to tweak.
		// On one hand we want to generate snapshots often, ideally every 50 ops.
		// This allows us to exercise more cases and increases chances of finding bugs.
		// At the same time that generates more files in repository, and adds to the size of it.
		// Thus, the tests are run in 2 primary modes:
		// 1) Stress test - Generates and validates snapshots every 50 ops. It tests eventual consistency only without
		//    storing these snapshots.
		// 2) Other test - Generate and validate snapshots at a lower frequency. This has 2 categories:
		//    2.1) For older snapshots added before `testSummaries` was introduced, the snapshot frequency is 1000.
		//    2.2) For snapshots added after `testSummaries` was introduced, the snapshot frequency is the same as when
		//         summaries happened in the original file. This is determined by the summary ops.
		const metadata = getMetadata(folder);
		let snapFreq: number | undefined;
		let testSummaries: boolean | undefined;
		if (mode === Mode.Stress) {
			snapFreq = 50;
		} else if (metadata.testSummaries === undefined) {
			snapFreq = 1000;
		} else {
			testSummaries = true;
		}

		const data: IWorkerArgs = {
			folder,
			mode,
			snapFreq,
			testSummaries,
		};

		switch (mode) {
			case Mode.Validate:
				await processNodeForValidate(data, concurrently, limiter);
				break;
			case Mode.UpdateSnapshots:
				await processNodeForUpdatingSnapshots(data, concurrently, limiter);
				break;
			case Mode.BackCompat:
				await processNodeForBackCompat(data);
				break;
			case Mode.NewSnapshots:
				await processNodeForNewSnapshots(data, concurrently, limiter);
				break;
			default:
				await processNode(data, concurrently, limiter);
		}
	}

	return limiter.waitAll();
}

/**
 * In Validate mode, we need to validate that we can load documents with snapshots in old versions. We have snapshots
 * from multiple old versions, process snapshot from each of these versions.
 */
async function processNodeForValidate(
	data: IWorkerArgs,
	concurrently: boolean,
	limiter: ConcurrencyLimiter,
) {
	// The snapshots in older format are in "srcSnapshots" folder.
	const srcSnapshotsDir = `${data.folder}/${srcSnapshots}`;
	if (!fs.existsSync(srcSnapshotsDir)) {
		return;
	}

	// Each sub-directory under "srcSnapshots" folder contain snapshots from an older version. Process each one
	// of these folders.
	for (const node of fs.readdirSync(srcSnapshotsDir, { withFileTypes: true })) {
		if (!node.isDirectory()) {
			continue;
		}

		data.initializeFromSnapshotsDir = `${srcSnapshotsDir}/${node.name}`;
		await processNode(data, concurrently, limiter);
	}
}

/**
 * In UpdateSnapshots mode, the snapshot format has changed and we need to update the reference snapshot files with the
 * newer version. We need to do the following:
 * - Move the current snapshot files to a new sub-folder in the older snapshots folder.
 * - Update the current snapshot files to the newer version.
 * - Update the package version of the current snapshots.
 */
async function processNodeForUpdatingSnapshots(
	data: IWorkerArgs,
	concurrently: boolean,
	limiter: ConcurrencyLimiter,
) {
	const currentSnapshotsDir = `${data.folder}/${currentSnapshots}`;
	assert(fs.existsSync(currentSnapshotsDir), `Directory ${currentSnapshotsDir} does not exist!`);

	const versionFileName = `${currentSnapshotsDir}/snapshotVersion.json`;
	assert(fs.existsSync(versionFileName), `Version file ${versionFileName} does not exist`);

	// Get the version of the current snapshots. This becomes the the folder name under the "src_snapshots" folder
	// where these snapshots will be moved.
	const versionContent = JSON.parse(fs.readFileSync(`${versionFileName}`, "utf-8"));
	const currentSnapshotsVersion = versionContent.snapshotVersion;

	// If the current snapshots version is the same as the current version of the runtime (pkgVersion), don't move
	// the current snapshots to become older snapshots since it's still the latest snapshot version.
	if (currentSnapshotsVersion !== pkgVersion) {
		// Create the folder where the current snapshots will be moved. If this folder already exists, we will update
		// the snapshots in that folder because we only need one set of snapshots for each version.
		const newSrcDir = `${data.folder}/${srcSnapshots}/${currentSnapshotsVersion}`;
		fs.mkdirSync(newSrcDir, { recursive: true });

		for (const subNode of fs.readdirSync(currentSnapshotsDir, { withFileTypes: true })) {
			assert(!subNode.isDirectory());
			fs.copyFileSync(
				`${currentSnapshotsDir}/${subNode.name}`,
				`${newSrcDir}/${subNode.name}`,
			);
		}
	}

	// Process the current folder which will update the current snapshots as per the changes.
	await processNode(data, concurrently, limiter);

	// Update the version of the current snapshots to the latest version.
	fs.writeFileSync(versionFileName, JSON.stringify({ snapshotVersion: pkgVersion }), {
		encoding: "utf-8",
	});
}

/**
 * In NewSnapshots mode, new test snapshot is being added. We need to run the replay tool in "write" mode which will
 * generate snapshot files and write them to the current snapshots dir.
 */
async function processNodeForNewSnapshots(
	data: IWorkerArgs,
	concurrently: boolean,
	limiter: ConcurrencyLimiter,
) {
	const currentSnapshotsDir = `${data.folder}/${currentSnapshots}`;
	// If current snapshots dir already exists, these are existing snapshots. We should skip because we don't want to
	// update them.
	if (fs.existsSync(currentSnapshotsDir)) {
		return;
	}

	fs.mkdirSync(currentSnapshotsDir, { recursive: true });

	// For new snapshots, testSummaries should be set because summaries should be generated as per the original file.
	data.testSummaries = true;

	// Process the current folder which will write the generated snapshots to current snapshots dir.
	await processNode(data, concurrently, limiter);

	const versionFileName = `${currentSnapshotsDir}/snapshotVersion.json`;
	// Write the versions file to the current snapshots dir.
	fs.writeFileSync(versionFileName, JSON.stringify({ snapshotVersion: pkgVersion }), {
		encoding: "utf-8",
	});

	// Write the metadata file.
	writeMetadataFile(data.folder);
}

/**
 * Runs backward compatibility snapshot tests
 * We have a set of reference snapshots. Each set has snapshots in the current format
 * and may have snapshots in an older format. For each set, the test does the following:
 * 1. Loads a document with the snapshot in old version.
 * 2. Takes a snapshot of the document.
 * 3. Validates that the snapshot matches with the corresponding snapshot in current version.
 * 4. Loads a document with snapshot in current version. Repeats steps 2 and 3.
 */
async function processNodeForBackCompat(data: IWorkerArgs) {
	const messagesFile = `${data.folder}/messages.json`;
	if (!fs.existsSync(messagesFile)) {
		throw new Error(`messages.json doesn't exist in ${data.folder}`);
	}

	// Build a map of sequence number to message for the messages in this document. This will be used to add the message
	// to the generated summary for old document snapshots.
	const messages = JSON.parse(
		fs.readFileSync(messagesFile).toString("utf-8"),
	) as ISequencedDocumentMessage[];
	const seqToMessage = new Map(messages.map((message) => [message.sequenceNumber, message]));

	// Snapshots in current format is under "currentSnapshots" directory.
	const currentSnapshotsDir = `${data.folder}/${currentSnapshots}`;

	// Validate that we can load snapshot in current format and write it in current snapshot format.
	await validateSnapshots(currentSnapshotsDir, currentSnapshotsDir, seqToMessage);

	// Snapshots in old format are under "srcSnapshots" directory. If we don't have any, there is nothing more to do.
	const srcSnapshotsDir = `${data.folder}/${srcSnapshots}`;
	if (!fs.existsSync(srcSnapshotsDir)) {
		return;
	}

	// Each sub-directory under "srcSnapshots" folder contain snapshots from an older version. Process each one
	// of these folders.
	for (const node of fs.readdirSync(srcSnapshotsDir, { withFileTypes: true })) {
		if (!node.isDirectory()) {
			continue;
		}

		// Validate that we can load snapshot from this older version format and write it in current snapshot format.
		await validateSnapshots(
			`${srcSnapshotsDir}/${node.name}`,
			currentSnapshotsDir,
			seqToMessage,
		);
	}
}

/**
 * Process one folder from the reference snapshots. It creates a worker thread and assigns the processing work to
 * the threads. If concurrently if false, directly processes the snapshots.
 */
async function processNode(
	workerData: IWorkerArgs,
	concurrently: boolean,
	limiter: ConcurrencyLimiter,
) {
	// "worker_threads" does not resolve without --experimental-worker flag on command line
	let threads: typeof import("worker_threads");
	try {
		threads = await import("worker_threads");
		threads.Worker.EventEmitter.defaultMaxListeners = 20;
	} catch (err) {}

	if (!concurrently || !threads) {
		await processOneNode(workerData);
		return;
	}

	return limiter.addWork(
		async () =>
			new Promise((resolve, reject) => {
				const worker = new threads.Worker(workerLocation, { workerData });

				worker.on("message", (message: string) => {
					if (message === "true") {
						resolve();
					}
					if (workerData.mode === Mode.Compare) {
						const extra =
							`If you are adding new test snapshots, you can run 'npm run test:new' to generate` +
							` reference snapshot files.\n` +
							`If you changed snapshot representation and validated new format is backward` +
							` compatible, you can run 'npm run test:update' to update baseline snapshot files.\n` +
							`Check README.md for more details.`;
						reject(new Error(`${JSON.stringify(workerData)}\n${message}\n\n${extra}`));
					} else {
						reject(new Error(`${JSON.stringify(workerData)}\n${message}`));
					}
				});

				worker.on("error", (error) => {
					error.message = `${JSON.stringify(workerData)}\n${error.message}`;
					reject(error);
				});

				worker.on("exit", (code) => {
					if (code !== 0) {
						reject(
							new Error(
								`${JSON.stringify(
									workerData,
								)}\nWorker stopped with exit code ${code}`,
							),
						);
					}
				});
			}),
	);
}

/**
 * Cleans failed snapshots from previous test runs, if any. When the test fails in Stress mode, it writes out the
 * failed snapshots to "FailedSnapshots" directory for debugging purposes. Clean those snapshots to remove extra
 * clutter.
 */
function cleanFailedSnapshots(dir: string) {
	const currentSnapshotsDir = `${dir}/${currentSnapshots}`;
	if (!fs.existsSync(currentSnapshotsDir)) {
		return;
	}

	const failedSnapshotsDir = `${currentSnapshotsDir}/FailedSnapshots`;
	if (!fs.existsSync(failedSnapshotsDir)) {
		return;
	}

	for (const node of fs.readdirSync(failedSnapshotsDir, { withFileTypes: true })) {
		if (node.isDirectory()) {
			continue;
		}
		fs.unlinkSync(`${failedSnapshotsDir}/${node.name}`);
	}

	fs.rmdirSync(failedSnapshotsDir);
}

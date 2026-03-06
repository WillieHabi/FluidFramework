#!/usr/bin/env node
/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);

// Resolve package paths relative to the sprint-planner package root
const packageRoot = path.resolve(currentDirPath, "../../..");
const evalRoot = path.join(packageRoot, "src", "eval");
const configsDir = path.join(evalRoot, "boardEval", "configs");
const datasetsDir = path.join(evalRoot, "datasets");
const resultsDir = path.join(evalRoot, "data");
const cliPath = path.join(packageRoot, "lib", "eval", "cli.js");

const PORT = 8150;

/**
 * Find the most recent scenario run directory created after a given timestamp.
 */
function findLatestRunDir(afterTimestamp: number): string | undefined {
	if (!fs.existsSync(resultsDir)) {
		return undefined;
	}
	return fs
		.readdirSync(resultsDir)
		.filter((d) => d.startsWith("scenario-"))
		.map((d) => ({
			name: d,
			mtime: fs.statSync(path.join(resultsDir, d)).mtimeMs,
		}))
		.filter((d) => d.mtime >= afterTimestamp)
		.sort((a, b) => b.mtime - a.mtime)
		.map((d) => d.name)[0];
}

/**
 * Read dataset summaries from a run directory.
 */
function readDatasetSummaries(
	runDirName: string,
): Array<{ datasetName: string; markdown: string }> {
	const runDir = path.join(resultsDir, runDirName);
	if (!fs.existsSync(runDir)) {
		return [];
	}

	return fs
		.readdirSync(runDir)
		.filter((d) => d.startsWith("dataset-"))
		.map((d) => {
			const datasetName = d.replace("dataset-", "");
			const summaryPath = path.join(runDir, d, "summary.md");
			if (fs.existsSync(summaryPath)) {
				return {
					datasetName,
					markdown: fs.readFileSync(summaryPath, "utf-8"),
				};
			}
			return undefined;
		})
		.filter(
			(d): d is { datasetName: string; markdown: string } =>
				d !== undefined,
		);
}

/**
 * Serve a static file from the results directory with path traversal protection.
 */
function serveResultFile(
	res: http.ServerResponse,
	filePath: string,
): void {
	const resolved = path.resolve(filePath);
	if (!resolved.startsWith(path.resolve(resultsDir))) {
		res.writeHead(403);
		res.end("Forbidden");
		return;
	}

	if (!fs.existsSync(resolved)) {
		res.writeHead(404);
		res.end("Not found");
		return;
	}

	const ext = path.extname(resolved);
	const contentTypes: Record<string, string> = {
		".json": "application/json",
		".md": "text/markdown",
		".png": "image/png",
		".js": "application/javascript",
		".html": "text/html",
	};

	res.writeHead(200, {
		"Content-Type": contentTypes[ext] ?? "application/octet-stream",
	});
	fs.createReadStream(resolved).pipe(res);
}

interface DatasetInfo {
	file: string;
	name: string;
	description: string;
	scenarioCount: number;
}

function listOptions(): { datasets: DatasetInfo[]; configs: string[] } {
	const datasetFiles = fs.existsSync(datasetsDir)
		? fs.readdirSync(datasetsDir).filter((f) => f.endsWith(".json"))
		: [];
	const datasets = datasetFiles.map((file) => {
		try {
			const content = JSON.parse(
				fs.readFileSync(path.join(datasetsDir, file), "utf-8"),
			);
			return {
				file,
				name: content.name ?? file,
				description: content.metadata?.description ?? "",
				scenarioCount: content.datasets?.length ?? 0,
			};
		} catch {
			return { file, name: file, description: "", scenarioCount: 0 };
		}
	});
	const configs = fs.existsSync(configsDir)
		? fs.readdirSync(configsDir).filter((f) => f.endsWith(".json"))
		: [];
	return { datasets, configs };
}

function listRuns(): Array<{ name: string; resultPath: string }> {
	if (!fs.existsSync(resultsDir)) {
		return [];
	}
	return fs
		.readdirSync(resultsDir)
		.filter((d) => d.startsWith("scenario-"))
		.sort()
		.reverse()
		.map((d) => ({
			name: d,
			resultPath: `/api/results/${d}/result.json`,
		}));
}

// Create HTTP server
const server = http.createServer((req, res) => {
	const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "OPTIONS") {
		res.writeHead(204);
		res.end();
		return;
	}

	// Serve the UI
	if (url.pathname === "/" || url.pathname === "/index.html") {
		res.writeHead(200, { "Content-Type": "text/html" });
		const srcHtmlPath = path.join(
			packageRoot,
			"src",
			"eval",
			"evalApp",
			"index.html",
		);
		const htmlToServe = fs.existsSync(srcHtmlPath)
			? srcHtmlPath
			: path.join(currentDirPath, "index.html");
		fs.createReadStream(htmlToServe).pipe(res);
		return;
	}

	// API: list available options
	if (url.pathname === "/api/options" && req.method === "GET") {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify(listOptions()));
		return;
	}

	// API: list previous runs
	if (url.pathname === "/api/runs" && req.method === "GET") {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify(listRuns()));
		return;
	}

	// API: get summaries for a specific run
	if (
		url.pathname.match(/^\/api\/runs\/[^/]+\/summaries$/) &&
		req.method === "GET"
	) {
		const runName = url.pathname.split("/")[3] ?? "";
		const summaries = readDatasetSummaries(runName);
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ runName, datasetSummaries: summaries }));
		return;
	}

	// API: run eval by spawning the existing CLI
	if (url.pathname === "/api/run-eval" && req.method === "POST") {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", () => {
			const params = JSON.parse(body);
			const dataset: string =
				params.dataset ?? "sprint_planner_scenarios.json";
			const evalConfig: string = params.config ?? "default.json";
			const judgeModel: string = params.judgeModel ?? "gpt-4o-mini";

			// Set up SSE
			res.writeHead(200, {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache",
				Connection: "keep-alive",
			});

			const sendEvent = (event: string, data: unknown): void => {
				res.write(
					`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`,
				);
			};

			// Build CLI args
			const args = [
				cliPath,
				"run",
				dataset,
				"-c",
				evalConfig,
				"--judge-model",
				judgeModel,
			];

			sendEvent("progress", {
				message: `Running: node ${args.join(" ")}`,
			});

			const startTime = Date.now();
			const child = spawn("node", args, {
				cwd: packageRoot,
				env: { ...process.env },
			});

			child.stdout.on("data", (data: Buffer) => {
				const lines = data
					.toString()
					.split("\n")
					.filter((l) => l.trim());
				for (const line of lines) {
					sendEvent("progress", { message: line });
				}
			});

			child.stderr.on("data", (data: Buffer) => {
				const lines = data
					.toString()
					.split("\n")
					.filter((l) => l.trim());
				for (const line of lines) {
					sendEvent("progress", { message: `[stderr] ${line}` });
				}
			});

			child.on("close", (code) => {
				if (code === 0) {
					const runDirName = findLatestRunDir(startTime);
					if (runDirName) {
						const datasetSummaries =
							readDatasetSummaries(runDirName);
						sendEvent("complete", {
							outputDir: path.join(resultsDir, runDirName),
							datasetSummaries,
						});
					} else {
						sendEvent("complete", {
							outputDir: "",
							datasetSummaries: [],
						});
					}
				} else {
					sendEvent("error", {
						message: `CLI exited with code ${code}`,
					});
				}
				res.end();
			});

			child.on("error", (err) => {
				sendEvent("error", { message: err.message });
				res.end();
			});
		});
		return;
	}

	// API: serve dataset files
	if (url.pathname.startsWith("/api/datasets/")) {
		const fileName = url.pathname.replace("/api/datasets/", "");
		const filePath = path.resolve(path.join(datasetsDir, fileName));
		if (!filePath.startsWith(path.resolve(datasetsDir))) {
			res.writeHead(403);
			res.end("Forbidden");
			return;
		}
		if (!fs.existsSync(filePath)) {
			res.writeHead(404);
			res.end("Not found");
			return;
		}
		res.writeHead(200, { "Content-Type": "application/json" });
		fs.createReadStream(filePath).pipe(res);
		return;
	}

	// API: serve config files
	if (url.pathname.startsWith("/api/configs/")) {
		const fileName = url.pathname.replace("/api/configs/", "");
		const filePath = path.resolve(path.join(configsDir, fileName));
		if (!filePath.startsWith(path.resolve(configsDir))) {
			res.writeHead(403);
			res.end("Forbidden");
			return;
		}
		if (!fs.existsSync(filePath)) {
			res.writeHead(404);
			res.end("Not found");
			return;
		}
		res.writeHead(200, { "Content-Type": "application/json" });
		fs.createReadStream(filePath).pipe(res);
		return;
	}

	// API: serve result files (screenshots, generatedCode.js, etc.)
	if (url.pathname.startsWith("/api/results/")) {
		const relPath = url.pathname.replace("/api/results/", "");
		serveResultFile(res, path.join(resultsDir, relPath));
		return;
	}

	res.writeHead(404);
	res.end("Not found");
});

server.listen(PORT, () => {
	console.log(`\n  Sprint Planner Eval GUI`);
	console.log(`  -----------------------`);
	console.log(`  Running at: http://localhost:${PORT}`);
	console.log(`  CLI:        ${cliPath}`);
	console.log(`  Results:    ${resultsDir}\n`);
});

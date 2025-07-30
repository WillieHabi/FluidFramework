/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { strict as assert } from "node:assert";

import type { AzureClient } from "@fluidframework/azure-client";
import { ConnectionState } from "@fluidframework/container-loader";
import type { ContainerSchema, IFluidContainer } from "@fluidframework/fluid-static";
import { SharedMap } from "@fluidframework/map/internal";
import {
	getPresence,
	StateFactory,
	type Presence,
	type StatesWorkspace,
	type StatesWorkspaceSchema,
	// eslint-disable-next-line import/no-internal-modules
} from "@fluidframework/presence/beta";
import { timeoutPromise } from "@fluidframework/test-utils/internal";

import { createAzureClient } from "./AzureClientFactory.js";
import { getTestMatrix } from "./utils.js";

interface TestState {
	message: string;
	timestamp: number;
}

const statesSchema = {
	testState: StateFactory.latest({ local: { message: "", timestamp: 0 } satisfies TestState }),
} satisfies StatesWorkspaceSchema;

type TestPresenceWorkspace = StatesWorkspace<typeof statesSchema>;

const testMatrix = getTestMatrix();
for (const testOpts of testMatrix) {
	describe(`Presence with AzureClient (${testOpts.variant})`, () => {
		const connectTimeoutMs = 10_000;
		let client: AzureClient;
		const schema = {
			initialObjects: {
				// A SharedMap is added to satisfy the requirement for initialObjects
				map: SharedMap,
			},
		} satisfies ContainerSchema;

		beforeEach("createAzureClient", () => {
			client = createAzureClient();
		});

		async function waitForConnection(container: IFluidContainer): Promise<void> {
			if (container.connectionState !== ConnectionState.Connected) {
				await timeoutPromise((resolve) => container.once("connected", () => resolve()), {
					durationMs: connectTimeoutMs,
					errorMsg: "container connect() timeout",
				});
			}
		}

		/**
		 * Creates multiple containers with presence enabled and returns them
		 */
		async function createMultipleContainers(
			numClients: number,
		): Promise<
			{ container: IFluidContainer; presence: Presence; workspace: TestPresenceWorkspace }[]
		> {
			const containers: {
				container: IFluidContainer;
				presence: Presence;
				workspace: TestPresenceWorkspace;
			}[] = [];
			let containerId: string | undefined;

			for (let i = 0; i < numClients; i++) {
				let container: IFluidContainer;

				if (i === 0) {
					// First container creates the container
					({ container } = await client.createContainer(schema, "2"));
					containerId = await container.attach();
				} else {
					// Subsequent containers join the existing container
					if (containerId === undefined) {
						throw new Error("Container ID should be set by the first client");
					}
					({ container } = await client.getContainer(containerId, schema, "2"));
				}

				await waitForConnection(container);

				const presence = getPresence(container);
				const workspace = presence.states.getWorkspace(
					`test:presence-workspace`,
					statesSchema,
				);

				containers.push({ container, presence, workspace });
			}

			return containers;
		}

		it("can create a container with presence and perform basic state operations", async () => {
			const { container } = await client.createContainer(schema, "2");
			await container.attach();
			await waitForConnection(container);

			const presence = getPresence(container);
			const workspace = presence.states.getWorkspace("test:presence-workspace", statesSchema);

			// Set local state
			const testMessage = "Hello, World!";
			const testTimestamp = Date.now();
			workspace.states.testState.local = {
				message: testMessage,
				timestamp: testTimestamp,
			};

			// Verify local state
			assert.strictEqual(workspace.states.testState.local.message, testMessage);
			assert.strictEqual(workspace.states.testState.local.timestamp, testTimestamp);
		});

		it("can collaborate between multiple clients with Latest state changes", async () => {
			const numClients = 50;
			const containers = await createMultipleContainers(numClients);

			// Setup: Create promises to listen for remote updates on all non-sender clients
			const remoteUpdatePromises: Promise<void>[] = [];

			const testMessage = "Remote update test message";
			const testTimestamp = Date.now();

			for (let i = 1; i < numClients; i++) {
				const { workspace } = containers[i];
				const updatePromise = timeoutPromise(
					(resolve) => {
						workspace.states.testState.events.on("remoteUpdated", (update) => {
							if (
								update.value.message === testMessage &&
								update.value.timestamp === testTimestamp
							) {
								resolve();
							}
						});
					},
					{
						durationMs: connectTimeoutMs,
						errorMsg: `Client ${i} did not receive remote update`,
					},
				);
				remoteUpdatePromises.push(updatePromise);
			}

			// Act: Leader updates its state
			containers[0].workspace.states.testState.local = {
				message: testMessage,
				timestamp: testTimestamp,
			};

			// Verify: All other clients receive the update
			await Promise.all(remoteUpdatePromises);

			// Additional verification: Check that all clients have the correct state
			for (let i = 1; i < numClients; i++) {
				const { workspace } = containers[i];
				const senderAttendee = containers[0].presence.attendees.getMyself();

				try {
					const remoteState = workspace.states.testState.getRemote(senderAttendee);
					assert.strictEqual(remoteState.value.message, testMessage);
					assert.strictEqual(remoteState.value.timestamp, testTimestamp);
				} catch (error) {
					assert.fail(`Client ${i} could not get remote state from sender: ${error}`);
				}
			}
		});
	});
}

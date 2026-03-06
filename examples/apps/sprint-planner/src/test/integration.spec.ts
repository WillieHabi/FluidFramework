/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { strict as assert } from "node:assert";

import { runScenario } from "./evalUtils.js";
import {
	assignWorkTest,
	bulkStatusUpdateTest,
	createWorkItemTest,
	moveItemStatusTest,
	sortByPriorityTest,
} from "./scenarios/index.js";

describe.skip("LLM integration tests", function () {
	this.timeout(120_000);

	it("Create a work item", async () => {
		const { score } = await runScenario(createWorkItemTest);
		console.log(`Score: ${(score * 100).toFixed(2)}%`);
		assert(score > 0.5, `Expected score > 0.5, got ${score}`);
	});

	it("Move item status", async () => {
		const { score } = await runScenario(moveItemStatusTest);
		console.log(`Score: ${(score * 100).toFixed(2)}%`);
		assert(score > 0.5, `Expected score > 0.5, got ${score}`);
	});

	it("Assign unassigned work", async () => {
		const { score } = await runScenario(assignWorkTest);
		console.log(`Score: ${(score * 100).toFixed(2)}%`);
		assert(score > 0.5, `Expected score > 0.5, got ${score}`);
	});

	it("Sort by priority", async () => {
		const { score } = await runScenario(sortByPriorityTest);
		console.log(`Score: ${(score * 100).toFixed(2)}%`);
		assert(score > 0.5, `Expected score > 0.5, got ${score}`);
	});

	it("Bulk status update", async () => {
		const { score } = await runScenario(bulkStatusUpdateTest);
		console.log(`Score: ${(score * 100).toFixed(2)}%`);
		assert(score > 0.5, `Expected score > 0.5, got ${score}`);
	});
});

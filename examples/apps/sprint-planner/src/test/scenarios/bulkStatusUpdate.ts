/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { sampleSprintBoard } from "../../sampleData.js";
import { SprintBoard } from "../../schema.js";
import {
	scoreSymbol,
	type ScorableVerboseTree,
	type SprintPlannerTestScenario,
} from "../evalUtils.js";

const expected: ScorableVerboseTree = {
	[scoreSymbol]: (actual): number => {
		if (typeof actual !== "object" || actual === null || Array.isArray(actual.fields)) {
			return 0;
		}
		const fields = actual.fields;
		if (typeof fields !== "object" || fields === null || Array.isArray(fields)) {
			return 0;
		}

		const workItems = fields.workItems;
		if (typeof workItems !== "object" || workItems === null || !Array.isArray(workItems.fields)) {
			return 0;
		}

		let score = 1;
		let count = 0;
		for (const item of workItems.fields) {
			if (typeof item !== "object" || item === null || Array.isArray(item.fields)) {
				continue;
			}
			const itemFields = item.fields;
			if (typeof itemFields !== "object" || itemFields === null || Array.isArray(itemFields)) {
				continue;
			}
			count++;

			const title = typeof itemFields.title === "string" ? itemFields.title : "";

			// "Design database schema" was in-review, should now be done
			if (title.toLowerCase().includes("design database schema")) {
				if (itemFields.status !== "done") {
					score -= 0.5;
				}
			}

			// Items not in-review should retain their original status
			if (title.toLowerCase().includes("set up ci/cd")) {
				if (itemFields.status !== "done") {
					score -= 0.1;
				}
			}
			if (title.toLowerCase().includes("implement user authentication")) {
				if (itemFields.status !== "in-progress") {
					score -= 0.1;
				}
			}
			if (title.toLowerCase().includes("write api documentation")) {
				if (itemFields.status !== "todo") {
					score -= 0.1;
				}
			}
		}

		return Math.max(0, score);
	},
};

/**
 * Scenario: Mark all tasks in review as done.
 */
export const bulkStatusUpdateTest = {
	name: "Bulk status update",
	schema: SprintBoard,
	initialTree: sampleSprintBoard,
	prompt: "Mark all tasks in review as done",
	expected,
} as const satisfies SprintPlannerTestScenario<typeof SprintBoard>;

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

		// Should have 7 items (6 original + 1 new)
		if (workItems.fields.length !== 7) {
			return 0;
		}

		// Find the new item by title
		let score = 0;
		for (const item of workItems.fields) {
			if (typeof item !== "object" || item === null || Array.isArray(item.fields)) {
				continue;
			}
			const itemFields = item.fields;
			if (typeof itemFields !== "object" || itemFields === null || Array.isArray(itemFields)) {
				continue;
			}
			if (
				typeof itemFields.title === "string" &&
				itemFields.title.toLowerCase().includes("fix login bug")
			) {
				score += 0.5;
				if (itemFields.priority === "high") {
					score += 0.25;
				}
				if (itemFields.status === "todo") {
					score += 0.25;
				}
				break;
			}
		}

		return score;
	},
};

/**
 * Scenario: Create a new work item on the sprint board.
 */
export const createWorkItemTest = {
	name: "Create a work item",
	schema: SprintBoard,
	initialTree: sampleSprintBoard,
	prompt: "Create a new task titled 'Fix login bug' with high priority",
	expected,
} as const satisfies SprintPlannerTestScenario<typeof SprintBoard>;

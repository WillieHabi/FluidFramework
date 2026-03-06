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

			const title = typeof itemFields.title === "string" ? itemFields.title : "";
			count++;

			// Items that were originally unassigned should now be assigned to Alice
			// "Write API documentation" and "Fix responsive layout on mobile" were unassigned
			if (
				title.toLowerCase().includes("write api documentation") ||
				title.toLowerCase().includes("fix responsive layout")
			) {
				if (
					typeof itemFields.assignee !== "string" ||
					itemFields.assignee.toLowerCase() !== "alice"
				) {
					score -= 1 / 2;
				}
			}

			// Items that were already assigned should keep their original assignee
			if (title.toLowerCase().includes("set up ci/cd")) {
				if (itemFields.assignee !== "Alice") {
					score -= 0.1;
				}
			}
			if (title.toLowerCase().includes("design database schema")) {
				if (itemFields.assignee !== "Bob") {
					score -= 0.1;
				}
			}
			if (title.toLowerCase().includes("add unit tests")) {
				if (itemFields.assignee !== "Charlie") {
					score -= 0.1;
				}
			}
		}

		return Math.max(0, score);
	},
};

/**
 * Scenario: Assign all unassigned tasks to a specific team member.
 */
export const assignWorkTest = {
	name: "Assign unassigned work",
	schema: SprintBoard,
	initialTree: sampleSprintBoard,
	prompt: "Assign all unassigned tasks to Alice",
	expected,
} as const satisfies SprintPlannerTestScenario<typeof SprintBoard>;

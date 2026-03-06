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

		// Find "Design database schema" and check its status is "done"
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
				itemFields.title.toLowerCase().includes("design database schema")
			) {
				return itemFields.status === "done" ? 1 : 0;
			}
		}

		return 0;
	},
};

/**
 * Scenario: Move a work item's status to done.
 */
export const moveItemStatusTest = {
	name: "Move item status",
	schema: SprintBoard,
	initialTree: sampleSprintBoard,
	prompt: "Move 'Design database schema' to done",
	expected,
} as const satisfies SprintPlannerTestScenario<typeof SprintBoard>;

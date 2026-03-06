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

const priorityOrder = ["critical", "high", "medium", "low"];

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

		// Check items are in priority order
		const items = workItems.fields;
		if (items.length !== 6) {
			return 0;
		}

		let lastPriorityIndex = -1;
		for (const item of items) {
			if (typeof item !== "object" || item === null || Array.isArray(item.fields)) {
				return 0;
			}
			const itemFields = item.fields;
			if (typeof itemFields !== "object" || itemFields === null || Array.isArray(itemFields)) {
				return 0;
			}
			const priority = itemFields.priority;
			if (typeof priority !== "string") {
				return 0;
			}
			const index = priorityOrder.indexOf(priority);
			if (index === -1) {
				return 0;
			}
			if (index < lastPriorityIndex) {
				return 0;
			}
			lastPriorityIndex = index;
		}

		return 1;
	},
};

/**
 * Scenario: Sort work items by priority, critical first.
 */
export const sortByPriorityTest = {
	name: "Sort by priority",
	schema: SprintBoard,
	initialTree: sampleSprintBoard,
	prompt: "Sort work items by priority, critical first",
	expected,
} as const satisfies SprintPlannerTestScenario<typeof SprintBoard>;

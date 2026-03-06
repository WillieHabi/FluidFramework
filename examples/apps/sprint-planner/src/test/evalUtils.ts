/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type { ImplicitFieldSchema } from "@fluidframework/tree";
import { TreeViewConfiguration } from "@fluidframework/tree";
import {
	TreeAlpha,
	independentView,
	type InsertableField,
	type VerboseTree,
	type VerboseTreeNode,
} from "@fluidframework/tree/alpha";
import { SharedTreeSemanticAgent } from "@fluidframework/tree-agent/alpha";

import { OpenAiChatModel } from "../openAiChatModel.js";

/**
 * Symbol used to attach custom scoring functions to expected tree nodes.
 */
export const scoreSymbol: unique symbol = Symbol("Score");

/**
 * A VerboseTreeNode that may include a custom scoring function.
 */
export type ScorableVerboseTreeNode = Partial<Pick<VerboseTreeNode<never>, "type">> & {
	fields?: ScorableVerboseTree[] | Record<string, ScorableVerboseTree>;
} & {
	[scoreSymbol]?: (actual: VerboseTreeNode<never>, actualTree: VerboseTree<never>) => number;
};

/**
 * A tree value that can be scored against an actual VerboseTree.
 */
export type ScorableVerboseTree = VerboseTree<never> | ScorableVerboseTreeNode;

/**
 * A test scenario for the sprint planner eval harness.
 */
export interface SprintPlannerTestScenario<TRoot extends ImplicitFieldSchema> {
	readonly name: string;
	readonly schema: TRoot;
	readonly initialTree: () => InsertableField<TRoot>;
	readonly prompt: string;
	readonly expected: ScorableVerboseTree;
	readonly options?: {
		readonly domainHints?: string;
	};
}

/**
 * Runs a scenario against the Anthropic chat model and returns a score.
 */
export async function runScenario<TRoot extends ImplicitFieldSchema>(
	scenario: SprintPlannerTestScenario<TRoot>,
): Promise<{ score: number; response: string }> {
	const view = independentView(new TreeViewConfiguration({ schema: scenario.schema }));
	view.initialize(scenario.initialTree());

	const chatModel = new OpenAiChatModel();
	const agent = new SharedTreeSemanticAgent(chatModel, view, {
		domainHints:
			scenario.options?.domainHints ??
			"This is a sprint planning board for an agile software development team. " +
				"Work items have statuses: todo, in-progress, in-review, done. " +
				"Priorities are: critical, high, medium, low. " +
				"Story points use Fibonacci numbers: 1, 2, 3, 5, 8, 13.",
	});

	const response = await agent.query(scenario.prompt);

	let score: number;
	if (view.root === undefined) {
		score = scenario.expected === undefined ? 1 : 0;
	} else {
		const actualVerbose = TreeAlpha.exportVerbose(view.root) as VerboseTree<never>;
		score = scoreTree(scenario.expected, actualVerbose, actualVerbose);
	}

	return { score, response };
}

function hasScoreSymbol(
	node: VerboseTreeNode<never> | ScorableVerboseTreeNode,
): node is ScorableVerboseTreeNode & {
	[scoreSymbol]: (actual: VerboseTreeNode<never>, actualTree: VerboseTree<never>) => number;
} {
	return scoreSymbol in node;
}

/**
 * Recursively scores an actual tree against an expected (scorable) tree.
 */
export function scoreTree(
	expected: ScorableVerboseTree,
	actual: VerboseTree<never>,
	actualTree: VerboseTree<never>,
): number {
	switch (typeof expected) {
		case "string":
		case "number":
		case "boolean":
		default: {
			return expected === actual ? 1 : 0;
		}
		case "object": {
			if (expected === null || actual === null) {
				return expected === actual ? 1 : 0;
			}
			if (typeof actual !== "object") {
				return 0;
			}
			if (hasScoreSymbol(expected)) {
				if (expected.type !== undefined && expected.type !== actual.type) {
					return 0;
				}
				let score = 1;
				if (expected.fields !== undefined) {
					score = scoreFields(expected.fields, actual.fields, actualTree);
					if (score < Number.EPSILON) {
						return 0;
					}
				}
				return score * expected[scoreSymbol](actual, actualTree);
			}
			if (expected.type !== actual.type) {
				return 0;
			}
			return scoreFields(expected.fields, actual.fields, actualTree);
		}
	}
}

/**
 * Scores the fields of a tree node.
 */
export function scoreFields(
	expected: ScorableVerboseTreeNode["fields"],
	actual: VerboseTreeNode<never>["fields"],
	actualTree: VerboseTree<never>,
): number {
	if (expected === undefined) {
		return 0;
	}

	let score = 1;

	if (Array.isArray(expected)) {
		if (!Array.isArray(actual)) {
			return 0;
		}
		if (expected.length !== actual.length) {
			return 0;
		}
		for (let i = 0; i < expected.length; i++) {
			const expectedItem = expected[i];
			const actualItem = actual[i];
			if (expectedItem === undefined || actualItem === undefined) {
				return 0;
			}
			score *= scoreTree(expectedItem, actualItem, actualTree);
			if (score < Number.EPSILON) {
				return 0;
			}
		}
	} else {
		if (Array.isArray(actual)) {
			return 0;
		}
		const expectedKeys = Object.keys(expected).sort();
		const actualKeys = Object.keys(actual).sort();
		if (expectedKeys.length !== actualKeys.length) {
			return 0;
		}
		for (let i = 0; i < expectedKeys.length; i++) {
			const ek = expectedKeys[i];
			const ak = actualKeys[i];
			if (ek === undefined || ak === undefined) {
				return 0;
			}
			const expectedField = expected[ek];
			const actualField = actual[ak];
			if (expectedField === undefined || actualField === undefined) {
				return 0;
			}
			score *= scoreTree(expectedField, actualField, actualTree);
			if (score < Number.EPSILON) {
				return 0;
			}
		}
	}

	return score;
}

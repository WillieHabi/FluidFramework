/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { TreeViewConfiguration } from "@fluidframework/tree";
import {
	TreeAlpha,
	independentView,
	type VerboseTree,
} from "@fluidframework/tree/alpha";
import { SharedTreeSemanticAgent } from "@fluidframework/tree-agent/alpha";

import { OpenAiChatModel } from "../../openAiChatModel.js";
import { SprintBoard } from "../../schema.js";
import { sampleSprintBoard } from "../../sampleData.js";
import type {
	OutputGenerator,
	DatasetGenerationResult,
} from "../boardEval/types/generatorTypes.js";
import type { JsonObject } from "../boardEval/types/jsonTypes.js";

const DEFAULT_DOMAIN_HINTS =
	"This is a sprint planning board for an agile software development team. " +
	"Work items have statuses: todo, in-progress, in-review, done. " +
	"Priorities are: critical, high, medium, low. " +
	"Story points use Fibonacci numbers: 1, 2, 3, 5, 8, 13.";

/**
 * OutputGenerator implementation for the Sprint Planner app.
 *
 * Creates a SharedTree view, initializes it with the provided initial state
 * (or sample data), runs the semantic agent with the prompt, and returns
 * the resulting tree state.
 */
export class SprintPlannerGenerator implements OutputGenerator {
	async generate(
		prompt: string,
		initialState?: JsonObject,
	): Promise<DatasetGenerationResult> {
		const view = independentView(
			new TreeViewConfiguration({ schema: SprintBoard }),
		);

		// Initialize tree: use provided initialTreeState or fall back to sample data
		const input = initialState as
			| { initialTreeState?: VerboseTree; domainHints?: string; prompt?: string }
			| undefined;

		if (input?.initialTreeState) {
			view.initialize(
				TreeAlpha.importVerbose(SprintBoard, input.initialTreeState),
			);
		} else {
			view.initialize(sampleSprintBoard());
		}

		// Capture the initial tree state before the agent modifies it
		const initialTreeState =
			view.root !== undefined
				? (TreeAlpha.exportVerbose(view.root) as unknown as JsonObject)
				: undefined;

		const domainHints = input?.domainHints ?? DEFAULT_DOMAIN_HINTS;
		const agentPrompt =
			typeof input?.prompt === "string" ? input.prompt : prompt;

		const chatModel = new OpenAiChatModel();
		const agent = new SharedTreeSemanticAgent(chatModel, view, {
			domainHints,
		});

		const startTime = Date.now();
		const response = await agent.query(agentPrompt);
		const executionTimeMs = Date.now() - startTime;

		const output =
			view.root !== undefined
				? (TreeAlpha.exportVerbose(view.root) as unknown as JsonObject)
				: null;

		return {
			output,
			outputMetadata: {
				initialTreeState,
				agentResponse: response,
				executionTimeMs,
				model: chatModel.name ?? "gpt-4o",
			},
		};
	}
}

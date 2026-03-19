/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * LLM As Judge Evaluator
 *
 * Uses an LLM as a judge to evaluate output quality across configurable dimensions.
 * Rubrics are provided by the application via llmEvalConfig.
 *
 * Returns one EvaluationResult per rubric dimension so each dimension
 * is reported separately with its own score and reasoning.
 */

import type { EvaluationResult } from "../resultTypes.js";
import type { IEvaluator, EvaluationContext } from "./evaluatorTypes.js";
import type { ILLMClient, ContentBlock } from "./llmTypes.js";
import { buildSystemPrompt, buildUserPrompt, parseScores } from "./prompts.js";

const FALLBACK_SCORE = 0;

/** @public */
export class LlmAsJudgeEvaluator implements IEvaluator {
	#client: ILLMClient;

	constructor(client: ILLMClient) {
		this.#client = client;
	}

	async evaluate(context: EvaluationContext): Promise<EvaluationResult[]> {
		const startTime = Date.now();
		const rubrics = context.rubrics;
		const defaultScale = context.defaultScale;
		try {
			const systemPrompt = buildSystemPrompt(
				rubrics,
				context.dataInterpretationPrompt,
				defaultScale,
			);
			const userContent = buildUserPrompt(context);

			// userContent is string when no screenshot, ContentBlock[] when screenshot is present
			const userMessage: { role: "user"; content: string | ContentBlock[] } = {
				role: "user",
				content: userContent,
			};

			const response = await this.#client.chatCompletion([
				{ role: "system", content: systemPrompt },
				userMessage,
			]);

			const parsed = parseScores(response.content, rubrics, defaultScale);
			const executionTimeMs = Date.now() - startTime;

			if (!parsed) {
				return rubrics.map((rubric) => ({
					rubricName: rubric.name,
					score: rubric.optional ? null : FALLBACK_SCORE,
					reasoning: `Failed to parse LLM response. ${rubric.optional ? "N/A applied for optional rubric." : "Fallback score applied."}\nRaw LLM response:\n${response.content}`,
					executionTimeMs,
				}));
			}

			return rubrics.map((rubric) => {
				const result = parsed[rubric.name];
				return {
					rubricName: rubric.name,
					score: result?.score ?? (rubric.optional ? null : FALLBACK_SCORE),
					reasoning: result?.reasoning ?? "No result for rubric",
					executionTimeMs,
				};
			});
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			const executionTimeMs = Date.now() - startTime;

			return rubrics.map((rubric) => ({
				rubricName: rubric.name,
				score: rubric.optional ? null : 0,
				reasoning: `Evaluation error: ${errorMessage}`,
				executionTimeMs,
			}));
		}
	}
}

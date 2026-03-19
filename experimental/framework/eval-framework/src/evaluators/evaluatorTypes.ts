/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type { JsonObject, Rubric, ScoreScale } from "../artifactTypes.js";
import type { EvalModelType } from "../frameworkTypes.js";
import type { Logger } from "../loggerTypes.js";
import type { EvaluationResult } from "../resultTypes.js";

/**
 * Context provided to evaluators during evaluation
 * @public
 */
export interface EvaluationContext {
	/** Structured input data that produced this output (if available) */
	input?: JsonObject;
	/** Output state after generation */
	output: JsonObject;
	/** Path to a PNG screenshot of the rendered output (if available) */
	screenshotPath?: string;
	/** Paths to multiple screenshots (e.g., all slides for coherence scoring) */
	screenshotPaths?: string[];
	/** Evaluator-specific configuration */
	modelType: EvalModelType;
	/** Rubrics for LLM-as-judge evaluation (from llmEvalConfig) */
	rubrics: Rubric[];
	/** Default scoring scale for all rubrics that don't specify their own (default: min=0, max=5) */
	defaultScale?: ScoreScale;
	/** Prompt describing how to interpret the input/output data (from llmEvalConfig) */
	dataInterpretationPrompt?: string;
	/** Logger for evaluators to log info/warnings/errors */
	logger: Logger;
}

/**
 * Evaluator interface
 * Defines the contract for all evaluator implementations
 * @public
 */
export interface IEvaluator {
	evaluate(context: EvaluationContext): Promise<EvaluationResult[]>;
}

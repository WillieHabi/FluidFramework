/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * LLM-as-judge evaluation framework for scoring AI-generated outputs against configurable rubrics.
 *
 * @packageDocumentation
 */

// Core framework
export { EvalFramework } from "./framework.js";

// Types
export type {
	ILLMClient,
	ChatMessage,
	LLMResponse,
	TextContent,
	ImageContent,
	ContentBlock,
} from "./evaluators/llmTypes.js";
export type { IEvaluator, EvaluationContext } from "./evaluators/evaluatorTypes.js";
export type {
	ScenarioArtifact,
	DatasetArtifact,
	Rubric,
	ScoreScale,
	JsonObject,
} from "./artifactTypes.js";
export { DEFAULT_SCALE } from "./artifactTypes.js";
export type {
	ScenarioEvalResult,
	ScenarioEvalResultMetadata,
	DatasetEvalResult,
	DatasetEvalResultMetadata,
	EvaluationResult,
} from "./resultTypes.js";
export {
	EvalModelTypes,
	type EvalModelType,
	type FrameworkOptions,
	type LlmEvalConfigOnDisk,
	type InputFileOnDisk,
	type EvalContext,
} from "./frameworkTypes.js";
export type { Logger } from "./loggerTypes.js";

// Built-in evaluator
export { LlmAsJudgeEvaluator } from "./evaluators/llmAsJudgeEvaluator.js";

// Aggregation
export { aggregateResults } from "./aggregation.js";
export type {
	AggregationOptions,
	StatusThresholds,
	DimensionStats,
	AggregatedResult,
} from "./aggregation.js";

// Utilities
export { consoleLogger } from "./consoleLogger.js";

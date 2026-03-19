/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Minimal metadata types for eval results.
 * These are self-contained — no dependency on boardGeneration/inputTypes.
 */

import type { JsonObject } from "./artifactTypes.js";

/** @public */
export interface ScenarioEvalResultMetadata extends JsonObject {
	totalDatasets: number;
	averageScore: number;
	totalExecutionTimeMs: number;
	judgeModel: string;
	llmEvalConfigPath: string;
	generationTimeMs?: number;
	evaluationTimeMs?: number;
}

/** @public */
export interface ScenarioEvalResult {
	name: string;
	appMetadata: JsonObject;
	datasetResults: DatasetEvalResult[];
	resultMetadata: ScenarioEvalResultMetadata;
}

/** @public */
export interface DatasetEvalResultMetadata extends JsonObject {
	executionTimeMs: number;
	timestamp: string;
	inputPath: string;
	judgeModel: string;
	screenshotPath?: string;
}

/** @public */
export interface DatasetEvalResult {
	name: string;
	appMetadata: JsonObject;
	evalResult: EvaluationResult[];
	resultMetadata: DatasetEvalResultMetadata;
}

/** @public */
export interface EvaluationResult {
	rubricName: string;
	/** Score value, or null if the rubric is optional and the LLM responded N/A */
	score: number | null;
	reasoning: string;
	executionTimeMs: number;
}

/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Per-dataset artifacts produced by the generation phase and written to disk.
 * @public
 */
export interface DatasetArtifact {
	/** Dataset name — links back to the corresponding Dataset entry */
	name: string;
	/** Path to the input.json on disk (contains appInput, appOutput, and optional evalContext) */
	inputPath: string;
	/** Path to the screenshot.png on disk (if captured) */
	screenshotPath?: string;
	/** Paths to multiple screenshots (e.g., all slides for coherence scoring) */
	screenshotPaths?: string[];
	/** Opaque metadata from the generator, passed through to results */
	metadata: JsonObject;
}

/**
 * All generated artifacts for a scenario, produced before evaluation.
 * @public
 */
export interface ScenarioArtifact {
	/** Name of the scenario that was used for generation */
	name: string;
	/** Path to the scenario-level llmEvalConfig.json on disk */
	llmEvalConfigPath: string;
	/** One entry per dataset in the scenario */
	datasetArtifacts: DatasetArtifact[];
	/** Opaque metadata from the generator, passed through to results */
	metadata: JsonObject;
}

/**
 * Scoring scale range for a rubric dimension.
 * @public
 */
export interface ScoreScale {
	/** Minimum score (default: 0) */
	min: number;
	/** Maximum score (default: 5) */
	max: number;
}

/**
 * Default scoring scale used when no scale is specified.
 * @public
 */
export const DEFAULT_SCALE: ScoreScale = { min: 0, max: 5 };

/**
 * A scoring rubric dimension for LLM-as-judge evaluation.
 * Each rubric defines a dimension name and what it measures.
 * @public
 */
export interface Rubric {
	/** Display name of the dimension (e.g., "Task Completion") */
	name: string;
	/** Description of what this dimension evaluates — should be specific and measurable */
	description: string;
	/** Scoring scale for this dimension (default: min=0, max=5) */
	scale?: ScoreScale;
	/** If true, the LLM may respond "N/A" and the score will be null */
	optional?: boolean;
}

/**
 * A JSON-serializable object.
 * @public
 */
export type JsonObject = Record<string, unknown>;

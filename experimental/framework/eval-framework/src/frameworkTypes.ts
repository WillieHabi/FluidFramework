/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type { JsonObject, Rubric, ScoreScale } from "./artifactTypes.js";
import type { Logger } from "./loggerTypes.js";
import type { ILLMClient } from "./evaluators/llmTypes.js";

/** @public */
export const defaultEvalModel: EvalModelType = "gpt-52-chat";

/**
 * Supported model types for the eval framework.
 * @public
 */
export const EvalModelTypes = [
	"claude-opus-41",
	"claude-sonnet-45",
	"claude-haiku-45",
	"gpt-41",
	"gpt-41-mini",
	"gpt-5",
	"gpt-5-reasoning",
	"gpt-5-chat-mini",
	"gpt-5-nano",
	"gpt-51-chat-2025-11-13",
	"gpt-51-2025-11-13",
	"gpt-5-codex",
	"gpt-52-chat",
	"gpt-52-reasoning",
] as const;

/** @public */
export type EvalModelType = (typeof EvalModelTypes)[number];

/**
 * Options for framework initialization
 * @public
 */
export interface FrameworkOptions {
	modelType?: EvalModelType;
	logger: Logger;
	/** LLM client for evaluation calls — consumers must provide their own implementation */
	llmClient: ILLMClient;
	/** Maximum parallel evaluations (default: 1 = sequential) */
	concurrency?: number;
}

/**
 * Per-dataset evaluation context that can be included in the input JSON file.
 * When present, fields override the scenario-level config defaults.
 * @public
 */
export interface EvalContext {
	/** Per-dataset data interpretation prompt (overrides scenario-level config) */
	dataInterpretationPrompt?: string;
}

/**
 * Shape of the input.json file on disk (contains appInput, appOutput, and optional evalContext).
 * @public
 */
export interface InputFileOnDisk {
	appInput: {
		input?: JsonObject;
		metadata: JsonObject;
	};
	appOutput: JsonObject;
	/** Per-dataset evaluation context (overrides scenario-level config defaults) */
	evalContext?: EvalContext;
}

/**
 * Shape of the llmEvalConfig.json file on disk (scenario-level eval configuration).
 * @public
 */
export interface LlmEvalConfigOnDisk {
	rubrics: Rubric[];
	dataInterpretationPrompt?: string;
	defaultScale?: ScoreScale;
}

import type { EvaluatorsConfig } from './configTypes.js';
import type { Rubric } from './evaluatorTypes.js';
import type { JsonObject } from './jsonTypes.js';
import type { Logger } from './loggerTypes.js';

/**
 * Options for framework initialization
 */
export interface FrameworkOptions {
  config: EvaluatorsConfig;
  logger?: Logger;
}

/**
 * Shape of the input.json file on disk (contains appInput and appOutput).
 * This is intentionally loose — the boardEval does not import boardGeneration types.
 */
export interface InputFileOnDisk {
  appInput: {
    input?: JsonObject;
    metadata: JsonObject;
  };
  appOutput: JsonObject;
}

/**
 * Shape of the llmEvalConfig.json file on disk (scenario-level eval configuration).
 */
export interface LlmEvalConfigOnDisk {
  rubrics?: Rubric[];
  dataInterpretationPrompt?: string;
}

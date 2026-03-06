import type { JsonObject } from './jsonTypes.js';
import type { Rubric } from './evaluatorTypes.js';

export interface Scenario {
  name: string;
  metadata: JsonObject;
  llmEvalConfig: LlmEvalConfig;
  datasets: Dataset[];
}

export interface Dataset {
  name: string;
  metadata: JsonObject;
  input: JsonObject;
}

export interface LlmEvalConfig {
  rubrics: Rubric[];
  dataInterpretationPrompt: string;
}

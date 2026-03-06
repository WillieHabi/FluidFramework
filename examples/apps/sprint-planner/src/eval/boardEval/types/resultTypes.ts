/**
 * Minimal metadata types for eval results.
 * These are self-contained — no dependency on boardGeneration/inputTypes.
 */

import type { JsonObject } from './jsonTypes.js';

export interface ScenarioEvalResultMetadata extends JsonObject {
  totalDatasets: number;
  averageScore: number;
  totalExecutionTimeMs: number;
  generationTimeMs?: number;
  evaluationTimeMs?: number;
  modelUsed?: string;
  evaluatorsUsed: string[];
}

export interface ScenarioEvalResult {
  name: string;
  appMetadata: JsonObject;
  datasetResults: DatasetEvalResult[];
  resultMetadata: ScenarioEvalResultMetadata;
}

export interface DatasetEvalResultMetadata extends JsonObject {
  executionTimeMs: number;
  timestamp: string;
  screenshotPath?: string;
  inputPath?: string;
  llmEvalConfigPath?: string;
}

export interface DatasetEvalResult {
  name: string;
  appMetadata: JsonObject;
  evalResult: EvaluationResult[];
  resultMetadata: DatasetEvalResultMetadata;
  screenshotData?: Buffer;
  output?: unknown;
  input?: unknown;
}

export interface EvaluationResult {
  evaluatorName: string;
  score: number; // 0-5 scale
  reasoning: string;
  executionTimeMs: number;
}

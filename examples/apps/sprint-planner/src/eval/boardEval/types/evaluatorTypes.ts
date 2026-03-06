import type { EvaluationResult } from './resultTypes.js';
import type { JsonObject } from './jsonTypes.js';

/**
 * A scoring rubric dimension for LLM-as-judge evaluation.
 * Each rubric defines a dimension name and what it measures.
 * The scoring scale (0-5) is standardized by the framework.
 */
export interface Rubric {
  /** Display name of the dimension (e.g., "Task Completion") */
  name: string;
  /** Description of what this dimension evaluates — should be specific and measurable */
  description: string;
}

/**
 * Context provided to evaluators during evaluation
 */
export interface EvaluationContext {
  /** Structured input data that produced this output (if available) */
  input?: JsonObject;
  /** Output state after generation */
  output: JsonObject;
  /** Path to a PNG screenshot of the rendered output (if available) */
  screenshotPath?: string;
  /** Evaluator-specific configuration */
  config?: JsonObject;
  /** Rubrics for LLM-as-judge evaluation (from llmEvalConfig) */
  rubrics?: Rubric[];
  /** Prompt describing how to interpret the input/output data (from llmEvalConfig) */
  dataInterpretationPrompt?: string;
}

/**
 * Evaluator interface
 * Defines the contract for all evaluator implementations
 */
export interface IEvaluator {
  readonly name: string;
  readonly description: string;
  readonly isLLMBased: boolean;
  evaluate(context: EvaluationContext): Promise<EvaluationResult | EvaluationResult[]>;
  validateInput(output: JsonObject): boolean;
}

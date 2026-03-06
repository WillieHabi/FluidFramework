import type { EvaluatorDetails, EvaluationResult, JsonObject } from '../index.js';
import type { EvaluationContext, IEvaluator } from '../types/evaluatorTypes.js';

// Re-export types so existing consumers of base.js still work
export type { Rubric, EvaluationContext, IEvaluator } from '../types/evaluatorTypes.js';

/**
 * Abstract base class for all evaluators.
 *
 * Evaluators implement the evaluate() method to produce an EvaluationResult.
 * They can be either rule-based (fast, deterministic) or LLM-based (semantic).
 *
 * @template TDetails - The type of the details object returned by this evaluator
 */
export abstract class BaseEvaluator implements IEvaluator {
  /** Unique name for this evaluator */
  abstract readonly name: string;

  /** Human-readable description */
  abstract readonly description: string;

  /** Whether this evaluator uses LLM calls */
  abstract readonly isLLMBased: boolean;

  /**
   * Execute evaluation on an output state.
   *
   * @param context - The evaluation context with prompt, output state, and config
   * @returns EvaluationResult with score, reasoning, and details
   */
  abstract evaluate(context: EvaluationContext): Promise<EvaluationResult | EvaluationResult[]>;

  /**
   * Validate that the output state has required fields for this evaluator.
   * Override in subclasses for specific validation requirements.
   * Default implementation accepts all input.
   *
   * @param _output - The output state to validate
   * @returns true if valid, false otherwise
   */
  validateInput(_output: JsonObject): boolean {
    return true;
  }

  /**
   * Create a successful evaluation result.
   * Helper method for subclasses.
   */
  protected createResult(score: number, reasoning: string, executionTimeMs: number = 0): EvaluationResult {
    return {
      evaluatorName: this.name,
      score: Math.max(0, Math.min(5, score)), // Clamp to 0-5
      reasoning,
      executionTimeMs
    };
  }

  /**
   * Create an error evaluation result.
   * Helper method for error cases.
   */
  protected createErrorResult(error: string, executionTimeMs: number = 0): EvaluationResult {
    return {
      evaluatorName: this.name,
      score: 0,
      reasoning: `Evaluation error: ${error}`,
      executionTimeMs
    };
  }
}

/**
 * Evaluator registry for dynamic evaluator loading.
 */
class EvaluatorRegistry {
  #evaluators: Map<string, IEvaluator> = new Map();

  /**
   * Register an evaluator instance
   */
  register<T extends IEvaluator>(evaluator: T): void {
    this.#evaluators.set(evaluator.name, evaluator);
  }

  /**
   * Get an evaluator by name
   */
  get(name: string): IEvaluator | undefined {
    return this.#evaluators.get(name);
  }

  /**
   * Get all registered evaluators
   */
  getAll(): IEvaluator[] {
    return Array.from(this.#evaluators.values());
  }

  /**
   * Get evaluator names
   */
  getNames(): string[] {
    return Array.from(this.#evaluators.keys());
  }

  /**
   * Check if an evaluator exists
   */
  has(name: string): boolean {
    return this.#evaluators.has(name);
  }

  /**
   * Get evaluators filtered by configuration
   */
  getByDetails(details: EvaluatorDetails[]): IEvaluator[] {
    const result: IEvaluator[] = [];
    for (const detail of details) {
      if (detail.enabled && this.has(detail.name)) {
        const evaluator = this.get(detail.name);
        if (evaluator !== undefined) {
          result.push(evaluator);
        }
      }
    }
    return result;
  }
}

// Global evaluator registry singleton
export const evaluatorRegistry = new EvaluatorRegistry();

/**
 * Register an evaluator.
 */
export function registerEvaluator<T extends IEvaluator>(evaluator: T): T {
  evaluatorRegistry.register(evaluator);
  return evaluator;
}

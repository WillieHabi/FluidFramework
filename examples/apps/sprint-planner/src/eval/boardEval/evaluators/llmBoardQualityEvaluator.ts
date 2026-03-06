/**
 * LLM Board Quality Evaluator
 *
 * Uses an LLM as a judge to evaluate board quality across configurable dimensions.
 * Rubrics are provided by the application via llmEvalConfig. When not provided,
 * falls back to default rubrics (Task Completion, Node Appropriateness,
 * Structure Quality, Content Relevance).
 *
 * Returns one EvaluationResult per rubric dimension so each dimension
 * is reported separately with its own score and reasoning.
 */

import type { ILLMClient } from '../llm/llmClient.js';
import { buildSystemPrompt, buildUserPrompt, parseScores, DEFAULT_RUBRICS } from '../llm/prompts.js';
import type { EvaluationResult } from '../types/resultTypes.js';
import type { EvaluationContext, Rubric } from './base.js';
import { BaseEvaluator, registerEvaluator } from './base.js';

const FALLBACK_SCORE = 1.5;

/**
 * LLM Board Quality Evaluator
 */
class LLMBoardQualityEvaluator extends BaseEvaluator {
  readonly name = 'llm-board-quality';
  readonly description = 'LLM-as-judge evaluation of board quality across multiple dimensions';
  readonly isLLMBased = true;

  #injectedClient?: ILLMClient;
  #cachedClient?: ILLMClient;

  constructor(client?: ILLMClient) {
    super();
    this.#injectedClient = client;
  }

  async evaluate(context: EvaluationContext): Promise<EvaluationResult[]> {
    const startTime = Date.now();
    const configModel = context.config?.model;
    const configTemp = context.config?.temperature;
    const model = typeof configModel === 'string' ? configModel : 'gpt-5-chat-mini';
    const temperature = typeof configTemp === 'number' ? configTemp : 0;

    const rubrics: Rubric[] = context.rubrics?.length ? context.rubrics : DEFAULT_RUBRICS;

    try {
      const client = await this.#getClient(model, temperature);

      const systemPrompt = buildSystemPrompt(rubrics, context.dataInterpretationPrompt);
      const userPrompt = buildUserPrompt(context);

      const response = await client.chatCompletion([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      const parsed = parseScores(response.content, rubrics);
      const executionTimeMs = Date.now() - startTime;

      if (!parsed) {
        // Parse failure: return fallback scores
        return rubrics.map((rubric) => ({
          evaluatorName: rubric.name,
          score: FALLBACK_SCORE,
          reasoning: `Failed to parse LLM response. Fallback score applied.`,
          executionTimeMs
        }));
      }

      return rubrics.map((rubric) => ({
        evaluatorName: rubric.name,
        score: parsed[rubric.name]?.score ?? FALLBACK_SCORE,
        reasoning: parsed[rubric.name]?.reasoning ?? 'No reasoning provided.',
        executionTimeMs
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const executionTimeMs = Date.now() - startTime;

      return rubrics.map((rubric) => ({
        evaluatorName: rubric.name,
        score: 0,
        reasoning: `Evaluation error: ${errorMessage}`,
        executionTimeMs
      }));
    }
  }

  /**
   * Get or create the LLM client.
   * Uses injected client if available, otherwise lazily creates OpenAiLLMClient.
   */
  async #getClient(model: string, temperature: number): Promise<ILLMClient> {
    if (this.#injectedClient) {
      return this.#injectedClient;
    }

    if (!this.#cachedClient) {
      const { OpenAiLLMClient } = await import('../llm/llmClient.js');
      this.#cachedClient = new OpenAiLLMClient({ model, temperature });
    }

    return this.#cachedClient;
  }
}

// Register the evaluator
export const llmBoardQualityEvaluator = registerEvaluator(new LLMBoardQualityEvaluator());

/**
 * Create an LLM board quality evaluator with an injected client (for testing).
 */
export function createLLMBoardQualityEvaluator(client: ILLMClient): LLMBoardQualityEvaluator {
  return new LLMBoardQualityEvaluator(client);
}

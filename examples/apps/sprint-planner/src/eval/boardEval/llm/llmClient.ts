/**
 * LLM Client Abstraction
 *
 * Provides an interface for LLM chat completion calls with two implementations:
 * - OpenAiLLMClient: Production client using OpenAI API
 * - MockLLMClient: Test client returning configurable canned responses
 */

import OpenAI from 'openai';

/**
 * Chat message for LLM requests
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Response from an LLM call
 */
export interface LLMResponse {
  content: string;
  model?: string;
}

/**
 * LLM client interface for chat completions
 */
export interface ILLMClient {
  chatCompletion(messages: ChatMessage[]): Promise<LLMResponse>;
}

/**
 * Production LLM client using OpenAI API.
 */
export class OpenAiLLMClient implements ILLMClient {
  #model: string;
  #temperature: number;
  #client: OpenAI;

  constructor(options: { model?: string; temperature?: number }) {
    this.#model = options.model ?? 'gpt-4o-mini';
    this.#temperature = options.temperature ?? 0;
    this.#client = new OpenAI();
  }

  async chatCompletion(messages: ChatMessage[]): Promise<LLMResponse> {
    const response = await this.#client.chat.completions.create({
      model: this.#model,
      temperature: this.#temperature,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content
      }))
    });

    const content = response.choices[0]?.message?.content ?? '';

    return {
      content,
      model: response.model
    };
  }
}

/**
 * Mock LLM client for testing.
 * Returns configurable canned responses without making real LLM calls.
 */
export class MockLLMClient implements ILLMClient {
  #responses: string[];
  #callIndex = 0;
  readonly calls: ChatMessage[][] = [];

  constructor(responses: string | string[]) {
    this.#responses = Array.isArray(responses) ? responses : [responses];
  }

  async chatCompletion(messages: ChatMessage[]): Promise<LLMResponse> {
    this.calls.push(messages);
    const responseIndex = Math.min(this.#callIndex, this.#responses.length - 1);
    const content = this.#responses[responseIndex] ?? '';
    this.#callIndex += 1;
    return { content, model: 'mock' };
  }
}

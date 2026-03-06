import type { Logger, JsonObject } from '../index.js';

/**
 * Options for the generation phase
 */
export interface GenerateArtifactsOptions {
  /** Pre-constructed generator (for tests). */
  generator?: OutputGenerator;
  /** Skip taking screenshots (default: true for sprint-planner) */
  skipScreenshot?: boolean;
  /** Directory containing dataset JSON files. Required when datasetPath is relative. */
  datasetsDir?: string;
  /** Logger instance */
  logger?: Logger;
}

/**
 * Result of output generation (output + metadata)
 */
export interface DatasetGenerationResult {
  output: JsonObject | null;
  outputMetadata: JsonObject;
}

/**
 * Output generator interface - abstracts output generation from evaluation
 */
export interface OutputGenerator {
  /**
   * Generate output state from a prompt
   */
  generate(prompt: string, initialState?: JsonObject): Promise<DatasetGenerationResult>;
}

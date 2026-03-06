import type { JsonObject } from './jsonTypes.js';

/**
 * Per-dataset artifacts produced by the generation phase and written to disk.
 */
export interface DatasetArtifact {
  /** Dataset name — links back to the corresponding Dataset entry */
  name: string;
  /** Path to the input.json on disk (contains appInput and appOutput) */
  inputPath: string;
  /** Path to the screenshot.png on disk (if captured) */
  screenshotPath?: string;
  /** If set, generation failed and this artifact should be skipped */
  error?: string;
  /** Opaque metadata from the generator, passed through to results */
  metadata: JsonObject;
}

/**
 * All generated artifacts for a scenario, produced before evaluation.
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

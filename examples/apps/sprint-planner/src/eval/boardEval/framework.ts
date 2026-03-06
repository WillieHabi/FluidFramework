import * as fs from 'fs';
import type { EvaluatorsConfig, EvaluatorDetails } from './index.js';
import { evaluatorRegistry, type IEvaluator, type EvaluationContext, type Rubric } from './evaluators/base.js';
import type { ScenarioArtifact } from './types/artifactTypes.js';
import type { FrameworkOptions, InputFileOnDisk, LlmEvalConfigOnDisk } from './types/frameworkTypes.js';
import type { JsonObject } from './types/jsonTypes.js';
import type { Logger } from './types/loggerTypes.js';
import { consoleLogger } from './types/loggerTypes.js';
import type {
  EvaluationResult,
  ScenarioEvalResult,
  ScenarioEvalResultMetadata,
  DatasetEvalResult
} from './types/resultTypes.js';

/**
 * Main Evaluation Framework
 *
 * Evaluates pre-generated artifacts against configured evaluators.
 * Reads all input data (datasets, outputs) from file paths in ScenarioArtifact.
 */
export class EvalFramework {
  #config: EvaluatorsConfig;
  #logger: Logger;
  #evaluators: IEvaluator[];

  constructor(options: FrameworkOptions) {
    this.#config = options.config;
    this.#logger = options.logger ?? consoleLogger;

    // Load evaluators from config
    this.#evaluators = this.#loadEvaluators(options.config.evaluators);
    this.#logger.info(
      `Loaded ${this.#evaluators.length} evaluators: ${this.#evaluators.map((e) => e.name).join(', ')}`
    );
  }

  /**
   * Load evaluators based on configuration
   */
  #loadEvaluators(evaluatorDetails: EvaluatorDetails[]): IEvaluator[] {
    const evaluators: IEvaluator[] = [];

    for (const detail of evaluatorDetails) {
      if (!detail.enabled) {
        continue;
      }

      const evaluator = evaluatorRegistry.get(detail.name);
      if (evaluator) {
        evaluators.push(evaluator);
      } else {
        this.#logger.warn(`Evaluator '${detail.name}' not found in registry`);
      }
    }

    return evaluators;
  }

  /**
   * Run evaluation on pre-generated artifacts
   */
  async run(scenarioArtifact: ScenarioArtifact): Promise<ScenarioEvalResult> {
    const startTime = Date.now();
    const { datasetArtifacts } = scenarioArtifact;

    this.#logger.info(`Starting evaluation run for scenario: ${scenarioArtifact.name}`);
    this.#logger.info(`Datasets: ${datasetArtifacts.length}`);

    // Read scenario-level llmEvalConfig (rubrics + data interpretation prompt)
    let llmEvalConfig: LlmEvalConfigOnDisk = {};
    if (scenarioArtifact.llmEvalConfigPath) {
      try {
        llmEvalConfig = JSON.parse(fs.readFileSync(scenarioArtifact.llmEvalConfigPath, 'utf-8'));
      } catch {
        this.#logger.warn(`Could not read llmEvalConfig from ${scenarioArtifact.llmEvalConfigPath}, using defaults`);
      }
    }

    const datasetResults: DatasetEvalResult[] = [];

    for (const artifact of datasetArtifacts) {
      // If generation failed, create an error result
      if (artifact.error || !artifact.inputPath) {
        datasetResults.push(
          this.#createErrorDatasetResult(
            artifact.name,
            artifact.metadata,
            new Error(artifact.error ?? 'No output generated')
          )
        );
        continue;
      }

      try {
        const datasetStartTime = Date.now();

        // Read input file from disk (contains appInput and appOutput)
        const inputFile: InputFileOnDisk = JSON.parse(fs.readFileSync(artifact.inputPath, 'utf-8'));
        const { appInput, appOutput: output } = inputFile;

        // Run evaluators with scenario-level rubrics
        const evaluationResults = await this.#runEvaluators(
          appInput.input,
          output,
          artifact.screenshotPath,
          llmEvalConfig.rubrics,
          llmEvalConfig.dataInterpretationPrompt
        );

        // Read screenshot into memory for the result
        let screenshotData: Buffer | undefined;
        if (artifact.screenshotPath) {
          screenshotData = fs.readFileSync(artifact.screenshotPath);
        }

        const result: DatasetEvalResult = {
          name: artifact.name,
          appMetadata: artifact.metadata,
          evalResult: evaluationResults,
          resultMetadata: { executionTimeMs: Date.now() - datasetStartTime, timestamp: new Date().toISOString() },
          screenshotData,
          output,
          input: appInput.input
        };

        datasetResults.push(result);
      } catch (error) {
        this.#logger.error(`Failed to evaluate dataset ${artifact.name}: ${error}`);
        datasetResults.push(this.#createErrorDatasetResult(artifact.name, artifact.metadata, error));
      }
    }

    const totalTime = Date.now() - startTime;

    // Calculate summary statistics
    const allScores = datasetResults.map((dr) => this.#calculateAggregateScore(dr.evalResult));
    const averageScore = allScores.length > 0 ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length : 0;

    // Collect actual evaluator/dimension names from results
    const allEvaluatorNames = new Set<string>();
    for (const dr of datasetResults) {
      for (const evalResult of dr.evalResult) {
        allEvaluatorNames.add(evalResult.evaluatorName);
      }
    }

    const resultMetadata: ScenarioEvalResultMetadata = {
      totalDatasets: datasetResults.length,
      averageScore,
      totalExecutionTimeMs: totalTime,
      evaluatorsUsed: Array.from(allEvaluatorNames)
    };

    const result: ScenarioEvalResult = {
      name: scenarioArtifact.name,
      appMetadata: scenarioArtifact.metadata,
      datasetResults,
      resultMetadata
    };

    this.#logger.info(`Evaluation complete: ${datasetResults.length} datasets, avg score ${averageScore.toFixed(2)}`);

    return result;
  }

  /**
   * Run all evaluators on a dataset
   */
  async #runEvaluators(
    input: JsonObject | undefined,
    output: JsonObject,
    screenshotPath?: string,
    rubrics?: Rubric[],
    dataInterpretationPrompt?: string
  ): Promise<EvaluationResult[]> {
    const results: EvaluationResult[] = [];

    for (const evaluator of this.#evaluators) {
      // Build context per-evaluator so each gets its own config options
      const evalConfig = this.#config.evaluators.find((c) => c.name === evaluator.name);
      const context: EvaluationContext = {
        input,
        output,
        screenshotPath,
        config: evalConfig?.options,
        rubrics,
        dataInterpretationPrompt
      };

      try {
        if (!evaluator.validateInput(output)) {
          results.push({
            evaluatorName: evaluator.name,
            score: 0,
            reasoning: 'Invalid input: output failed validation',
            executionTimeMs: 0
          });
          continue;
        }

        const evalStartTime = Date.now();
        const evalResult = await evaluator.evaluate(context);
        const elapsed = Date.now() - evalStartTime;
        // Normalize single or multi-result evaluators into a flat list
        const evalResults = Array.isArray(evalResult) ? evalResult : [evalResult];
        for (const r of evalResults) {
          r.executionTimeMs = elapsed;
          results.push(r);
        }
      } catch (error) {
        this.#logger.error(`Evaluator ${evaluator.name} failed: ${error}`);
        results.push({
          evaluatorName: evaluator.name,
          score: 0,
          reasoning: `Evaluator error: ${error instanceof Error ? error.message : String(error)}`,
          executionTimeMs: 0
        });
      }
    }

    return results;
  }

  /**
   * Calculate weighted aggregate score from evaluation results.
   */
  #calculateAggregateScore(results: EvaluationResult[]): number {
    if (results.length === 0) {
      return 0;
    }

    // Build weights map: evaluator-level weights + dimension-level overrides
    const weights = new Map<string, number>();
    for (const config of this.#config.evaluators) {
      weights.set(config.name, config.weight ?? 1);

      // Merge dimension-level weights from options
      const dimWeights = config.options?.dimensionWeights;
      if (dimWeights && typeof dimWeights === 'object') {
        for (const [dimName, dimWeight] of Object.entries(dimWeights as Record<string, number>)) {
          weights.set(dimName, dimWeight);
        }
      }
    }

    let totalWeight = 0;
    let weightedSum = 0;

    for (const result of results) {
      const weight = weights.get(result.evaluatorName) ?? 1;
      weightedSum += result.score * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  /**
   * Create error result for failed dataset
   */
  #createErrorDatasetResult(name: string, metadata: JsonObject, error: unknown): DatasetEvalResult {
    return {
      name,
      evalResult: [],
      resultMetadata: {
        executionTimeMs: 0,
        timestamp: new Date().toISOString(),
        error
      },
      appMetadata: metadata
    };
  }
}

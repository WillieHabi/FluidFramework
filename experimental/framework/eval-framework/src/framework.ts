/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import * as fs from "fs";
import type {
	JsonObject,
	Rubric,
	ScenarioArtifact,
	DatasetArtifact,
	ScoreScale,
} from "./artifactTypes.js";
import {
	type FrameworkOptions,
	type InputFileOnDisk,
	type LlmEvalConfigOnDisk,
	type EvalModelType,
	defaultEvalModel,
} from "./frameworkTypes.js";
import type { Logger } from "./loggerTypes.js";
import type {
	EvaluationResult,
	ScenarioEvalResult,
	ScenarioEvalResultMetadata,
	DatasetEvalResult,
} from "./resultTypes.js";
import type { EvaluationContext, IEvaluator } from "./evaluators/evaluatorTypes.js";
import { LlmAsJudgeEvaluator } from "./evaluators/llmAsJudgeEvaluator.js";

/**
 * Main Evaluation Framework
 *
 * Evaluates pre-generated artifacts against configured evaluators.
 * Reads all input data (datasets, outputs) from file paths in ScenarioArtifact.
 * @public
 */
export class EvalFramework {
	#modelType: EvalModelType;
	#logger: Logger;
	#evaluator: IEvaluator;
	#concurrency: number;

	constructor(options: FrameworkOptions) {
		this.#modelType = options.modelType ?? defaultEvalModel;
		this.#logger = options.logger;
		this.#evaluator = new LlmAsJudgeEvaluator(options.llmClient);
		this.#concurrency = options.concurrency ?? 1;
	}

	/**
	 * Run evaluation on pre-generated artifacts
	 */
	async run(scenarioArtifact: ScenarioArtifact): Promise<ScenarioEvalResult> {
		const startTime = Date.now();
		const { datasetArtifacts } = scenarioArtifact;

		this.#logger.info(
			`Starting evaluation run for scenario: ${scenarioArtifact.name}. Model: ${this.#modelType}`,
		);
		this.#logger.info(
			`Datasets: ${datasetArtifacts.length}, Concurrency: ${this.#concurrency}`,
		);

		// Read scenario-level llmEvalConfig (rubrics + data interpretation prompt)
		let llmEvalConfig: LlmEvalConfigOnDisk;
		try {
			llmEvalConfig = JSON.parse(fs.readFileSync(scenarioArtifact.llmEvalConfigPath, "utf-8"));
		} catch {
			throw new Error(
				`Failed to read llmEvalConfig from ${scenarioArtifact.llmEvalConfigPath}`,
			);
		}

		// Evaluate datasets with bounded concurrency
		const datasetResults = await this.#evaluateWithConcurrency(
			datasetArtifacts,
			llmEvalConfig,
		);

		const totalTime = Date.now() - startTime;

		// Calculate summary statistics
		const allScores = datasetResults.map((dr) => this.#calculateAggregateScore(dr.evalResult));
		const averageScore =
			allScores.length > 0 ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length : 0;

		const resultMetadata: ScenarioEvalResultMetadata = {
			totalDatasets: datasetResults.length,
			averageScore,
			totalExecutionTimeMs: totalTime,
			judgeModel: this.#modelType,
			llmEvalConfigPath: scenarioArtifact.llmEvalConfigPath,
		};

		const result: ScenarioEvalResult = {
			name: scenarioArtifact.name,
			appMetadata: scenarioArtifact.metadata,
			datasetResults,
			resultMetadata,
		};

		this.#logger.info(
			`Evaluation complete: ${datasetResults.length} datasets, avg score ${averageScore.toFixed(2)}`,
		);

		return result;
	}

	/**
	 * Evaluate dataset artifacts with bounded concurrency.
	 */
	async #evaluateWithConcurrency(
		artifacts: ScenarioArtifact["datasetArtifacts"],
		llmEvalConfig: LlmEvalConfigOnDisk,
	): Promise<DatasetEvalResult[]> {
		const results = new Array<DatasetEvalResult>(artifacts.length);
		let nextIndex = 0;

		const worker = async (): Promise<void> => {
			while (nextIndex < artifacts.length) {
				const i = nextIndex++;
				const artifact = artifacts[i];
				if (artifact === undefined) continue;
				results[i] = await this.#evaluateDataset(artifact, llmEvalConfig);
			}
		};

		const workerCount = Math.min(this.#concurrency, artifacts.length);
		await Promise.all(Array.from({ length: workerCount }, () => worker()));

		return results;
	}

	/**
	 * Evaluate a single dataset artifact.
	 * Reads all data from the input JSON file on disk.
	 */
	async #evaluateDataset(
		artifact: DatasetArtifact,
		llmEvalConfig: LlmEvalConfigOnDisk,
	): Promise<DatasetEvalResult> {
		if (!artifact.inputPath) {
			return this.#createErrorDatasetResult(
				artifact.name,
				artifact.metadata,
				new Error("No inputPath provided"),
			);
		}

		try {
			const datasetStartTime = Date.now();

			// Read input file from disk (contains appInput, appOutput, and optional evalContext)
			const inputFile: InputFileOnDisk = JSON.parse(
				fs.readFileSync(artifact.inputPath, "utf-8"),
			);
			const { appInput, appOutput: output, evalContext } = inputFile;

			// Per-dataset evalContext overrides scenario-level config
			const dataInterpretationPrompt =
				evalContext?.dataInterpretationPrompt ?? llmEvalConfig.dataInterpretationPrompt;

			const evaluationResults = await this.#runEvaluator(
				appInput.input,
				output,
				llmEvalConfig.rubrics,
				artifact.screenshotPath,
				artifact.screenshotPaths,
				dataInterpretationPrompt,
				llmEvalConfig.defaultScale,
			);

			return {
				name: artifact.name,
				appMetadata: artifact.metadata,
				evalResult: evaluationResults,
				resultMetadata: {
					executionTimeMs: Date.now() - datasetStartTime,
					timestamp: new Date().toISOString(),
					judgeModel: this.#modelType,
					inputPath: artifact.inputPath,
					screenshotPath: artifact.screenshotPath,
				},
			};
		} catch (error) {
			this.#logger.error(`Failed to evaluate dataset ${artifact.name}: ${error}`);
			return this.#createErrorDatasetResult(artifact.name, artifact.metadata, error);
		}
	}

	async #runEvaluator(
		input: JsonObject | undefined,
		output: JsonObject,
		rubrics: Rubric[],
		screenshotPath?: string,
		screenshotPaths?: string[],
		dataInterpretationPrompt?: string,
		defaultScale?: ScoreScale,
	): Promise<EvaluationResult[]> {
		const context: EvaluationContext = {
			input,
			output,
			screenshotPath,
			screenshotPaths,
			rubrics,
			defaultScale,
			dataInterpretationPrompt,
			modelType: this.#modelType,
			logger: this.#logger,
		};

		try {
			return this.#evaluator.evaluate(context);
		} catch (error) {
			throw new Error(
				`Evaluator error: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	/**
	 * Calculate weighted aggregate score from evaluation results.
	 */
	#calculateAggregateScore(results: EvaluationResult[]): number {
		// Filter out null scores (N/A optional rubrics)
		const scoredResults = results.filter((r) => r.score !== null);
		if (scoredResults.length === 0) {
			return 0;
		}

		let totalScore = 0;
		for (const result of scoredResults) {
			totalScore += result.score as number;
		}
		return totalScore / scoredResults.length;
	}

	/**
	 * Create error result for failed dataset
	 */
	#createErrorDatasetResult(
		name: string,
		metadata: JsonObject,
		error: unknown,
	): DatasetEvalResult {
		return {
			name,
			evalResult: [],
			resultMetadata: {
				executionTimeMs: 0,
				timestamp: new Date().toISOString(),
				error,
				judgeModel: this.#modelType,
				inputPath: "",
				screenshotPath: "",
			},
			appMetadata: metadata,
		};
	}
}

/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import type { DatasetArtifact, ScenarioArtifact } from "../boardEval/types/artifactTypes.js";
import type { JsonObject } from "../boardEval/types/jsonTypes.js";
import { consoleLogger } from "../boardEval/types/loggerTypes.js";
import type { OutputGenerator, GenerateArtifactsOptions } from "../boardEval/types/generatorTypes.js";
import type { Scenario } from "../boardEval/types/inputTypes.js";
import { SprintPlannerGenerator } from "./sprintPlannerGenerator.js";

/**
 * Load a scenario from a dataset file path.
 */
function loadScenario(datasetPath: string, datasetsDir: string): Scenario {
	const fullPath = path.isAbsolute(datasetPath)
		? datasetPath
		: path.join(datasetsDir, datasetPath);

	if (!fs.existsSync(fullPath)) {
		throw new Error(`Dataset not found: ${fullPath}`);
	}

	return JSON.parse(fs.readFileSync(fullPath, "utf-8"));
}

/**
 * Generate artifacts for all datasets in a scenario.
 *
 * For each dataset:
 * - Runs the generator to produce output
 * - Writes input.json (appInput + appOutput) to disk
 * - Writes llmEvalConfig.json once at the scenario level
 *
 * @param scenarioOrDatasetPath - Path to a dataset JSON file or a pre-loaded Scenario object
 * @param outputDir - Directory to write generated artifacts into
 * @param options - Generation options
 * @returns Generated artifact references (file paths + metadata)
 */
export async function generateArtifacts(
	scenarioOrDatasetPath: Scenario | string,
	outputDir: string,
	options?: GenerateArtifactsOptions,
): Promise<ScenarioArtifact> {
	const scenario =
		typeof scenarioOrDatasetPath === "string"
			? loadScenario(scenarioOrDatasetPath, options?.datasetsDir ?? "")
			: scenarioOrDatasetPath;
	const logger = options?.logger ?? consoleLogger;
	const generator: OutputGenerator =
		options?.generator ?? new SprintPlannerGenerator();
	const datasetArtifacts: DatasetArtifact[] = [];

	logger.info(`Generating artifacts for scenario: ${scenario.name}`);
	logger.info(`Datasets: ${scenario.datasets.length}`);

	// Write scenario-level llmEvalConfig.json
	const appDataRoot = path.join(outputDir, "appData");
	fs.mkdirSync(appDataRoot, { recursive: true });
	const llmEvalConfigPath = path.join(appDataRoot, "llmEvalConfig.json");
	fs.writeFileSync(
		llmEvalConfigPath,
		JSON.stringify(scenario.llmEvalConfig, null, 2),
	);

	for (const dataset of scenario.datasets) {
		const { name, input, metadata: inputMetadata } = dataset;
		const appDataDir = path.join(outputDir, `dataset-${name}`, "appData");
		fs.mkdirSync(appDataDir, { recursive: true });

		try {
			logger.debug(`Generating output for ${name}`);

			// Extract prompt from dataset input
			const prompt =
				typeof (input as Record<string, unknown>).prompt === "string"
					? ((input as Record<string, unknown>).prompt as string)
					: JSON.stringify(input);

			const { output, outputMetadata } = await generator.generate(
				prompt,
				input as JsonObject,
			);
			if (output === null) {
				throw new Error("Generator failed to produce a valid output");
			}

			// Enrich the dataset input with the initial tree state captured during generation,
			// so the evaluator can see the before/after diff
			const { initialTreeState, ...restMetadata } = outputMetadata as Record<string, unknown>;
			if (initialTreeState) {
				(input as Record<string, unknown>).initialTreeState = initialTreeState;
			}

			// Write input.json (contains appInput and appOutput)
			const inputPath = path.join(appDataDir, "input.json");
			fs.writeFileSync(
				inputPath,
				JSON.stringify({ appInput: dataset, appOutput: output }, null, 2),
			);

			datasetArtifacts.push({
				name,
				inputPath,
				metadata: { ...inputMetadata, ...restMetadata },
			});

			logger.info(`Generated artifacts for ${name}`);
		} catch (error) {
			logger.error(`Failed to generate artifacts for ${name}: ${error}`);
			datasetArtifacts.push({
				name,
				inputPath: "",
				metadata: {
					error:
						error instanceof Error ? error.message : String(error),
				},
			});
		}
	}

	return {
		name: scenario.name,
		llmEvalConfigPath,
		datasetArtifacts,
		metadata: scenario.metadata,
	};
}

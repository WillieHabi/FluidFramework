#!/usr/bin/env node
/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/* eslint-disable no-console -- CLI output is intentional */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import type { EvaluatorsConfig } from "./boardEval/types/configTypes.js";
import { EvalFramework } from "./boardEval/framework.js";
import { writeResultsToDirectory } from "./boardEval/reporter.js";
import { consoleLogger } from "./boardEval/types/loggerTypes.js";
import { generateArtifacts } from "./generators/artifactGenerator.js";

// Import evaluators to register them
import "./boardEval/evaluators/llmBoardQualityEvaluator.js";
import "./boardEval/evaluators/llmCodeQualityEvaluator.js";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);

const program = new Command();

program
	.name("sprint-planner-eval")
	.description("Evaluation CLI for Sprint Planner semantic agent")
	.version("0.0.1");

/**
 * Run evaluation command — generates artifacts then evaluates them.
 */
program
	.command("run")
	.description("Run evaluation on a dataset")
	.argument("<dataset>", "Path to dataset JSON file")
	.option(
		"-c, --config <path>",
		"Path to config file",
		"default.json",
	)
	.option(
		"-e, --evaluators <names>",
		"Comma-separated list of evaluators to run",
	)
	.option(
		"--judge-model <name>",
		"Model to use for LLM-based evaluators",
		"gpt-4o-mini",
	)
	.action(async (datasetPath: string, options) => {
		try {
			// Resolve directories relative to package root
			// CLI runs from lib/eval/cli.js, source files are in src/eval/
			const packageRoot = path.resolve(currentDirPath, "../..");
			const resultsDir = path.join(packageRoot, "src", "eval", "data");
			const configsDir = path.join(packageRoot, "src", "eval", "boardEval", "configs");
			const datasetsDir = path.resolve(packageRoot, "src", "eval", "datasets");

			// Phase 1: Generate artifacts
			console.log("--- Phase 1: Generation ---");
			console.log("");

			const fullDatasetPath = path.isAbsolute(datasetPath)
				? datasetPath
				: path.join(datasetsDir, datasetPath);
			const scenarioName =
				JSON.parse(fs.readFileSync(fullDatasetPath, "utf-8")).name ??
				"unknown";
			const timestamp = new Date()
				.toISOString()
				.replace(/[:.]/g, "-");
			const runDir = path.join(
				resultsDir,
				`scenario-${scenarioName}-${timestamp}`,
			);

			const generatedArtifacts = await generateArtifacts(
				datasetPath,
				runDir,
				{
					datasetsDir,
					logger: consoleLogger,
				},
			);

			console.log(
				`\nGeneration complete: ${generatedArtifacts.datasetArtifacts.length} datasets processed`,
			);

			// Phase 2: Load config and evaluate
			console.log("\n--- Phase 2: Evaluation ---");

			const fullConfigPath = path.isAbsolute(options.config)
				? options.config
				: path.join(configsDir, options.config);
			let config: EvaluatorsConfig;
			if (fs.existsSync(fullConfigPath)) {
				config = JSON.parse(fs.readFileSync(fullConfigPath, "utf-8"));
			} else {
				console.warn(
					`Config not found: ${fullConfigPath}, using defaults`,
				);
				config = {
					evaluators: [
						{
							name: "llm-board-quality",
							enabled: true,
							weight: 1.0,
						},
					],
				};
			}

			// Override evaluators if specified
			if (options.evaluators) {
				const evaluatorNames = options.evaluators.split(",");
				config.evaluators = config.evaluators.map((e) => ({
					...e,
					enabled: evaluatorNames.includes(e.name),
				}));
			}

			// Inject judge model into LLM-based evaluator options
			if (options.judgeModel) {
				config.evaluators = config.evaluators.map(
					(e) => {
						if (e.name === "llm-board-quality") {
							return {
								...e,
								options: {
									...e.options,
									model: options.judgeModel,
								},
							};
						}
						return e;
					},
				);
			}

			const framework = new EvalFramework({
				config,
				logger: consoleLogger,
			});

			const result = await framework.run(generatedArtifacts);

			writeResultsToDirectory(result, runDir, consoleLogger);

			// Print summary
			console.log("\n--- Results ---");
			console.log(JSON.stringify(result.resultMetadata, null, 2));
			console.log(`\nFull results: ${runDir}`);

			process.exit(0);
		} catch (error) {
			console.error("Evaluation failed:", error);
			process.exit(1);
		}
	});

program.parse();

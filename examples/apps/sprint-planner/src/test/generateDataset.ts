/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import type { ImplicitFieldSchema } from "@fluidframework/tree";
import { TreeViewConfiguration } from "@fluidframework/tree";
import { TreeAlpha, independentView } from "@fluidframework/tree/alpha";
import type {
	SharedTreeChatModel,
	SharedTreeChatQuery,
} from "@fluidframework/tree-agent/alpha";
import { SharedTreeSemanticAgent } from "@fluidframework/tree-agent/alpha";

import { OpenAiChatModel } from "../openAiChatModel.js";

import type { SprintPlannerTestScenario } from "./evalUtils.js";
import {
	assignWorkTest,
	bulkStatusUpdateTest,
	createWorkItemTest,
	moveItemStatusTest,
	sortByPriorityTest,
} from "./scenarios/index.js";

const defaultDomainHints =
	"This is a sprint planning board for an agile software development team. " +
	"Work items have statuses: todo, in-progress, in-review, done. " +
	"Priorities are: critical, high, medium, low. " +
	"Story points use Fibonacci numbers: 1, 2, 3, 5, 8, 13.";

/**
 * A wrapper around a {@link SharedTreeChatModel} that captures generated code strings
 * by intercepting calls to the `edit` function on each query.
 */
class CodeCapturingModel implements SharedTreeChatModel {
	public readonly generatedCode: string[] = [];
	public readonly editToolName?: string;
	public readonly name?: string;

	public constructor(private readonly inner: SharedTreeChatModel) {
		if (inner.editToolName !== undefined) {
			this.editToolName = inner.editToolName;
		}
		if (inner.name !== undefined) {
			this.name = inner.name;
		}
	}

	public appendContext(text: string): void {
		this.inner.appendContext?.(text);
	}

	public async query(message: SharedTreeChatQuery): Promise<string> {
		const originalEdit = message.edit;
		const wrappedMessage: SharedTreeChatQuery = {
			...message,
			edit: async (code: string) => {
				this.generatedCode.push(code);
				return originalEdit(code);
			},
		};
		return this.inner.query(wrappedMessage);
	}
}

/**
 * Converts a scenario name into a filename-safe slug (camelCase).
 */
function scenarioSlug(name: string): string {
	return name
		.split(/\s+/)
		.map((word, i) =>
			i === 0
				? word.toLowerCase()
				: word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
		)
		.join("");
}

/**
 * Runs a single scenario and writes the input, output, and code JSON files to the given directory.
 */
async function generateForScenario<TRoot extends ImplicitFieldSchema>(
	scenario: SprintPlannerTestScenario<TRoot>,
	outputDir: string,
): Promise<void> {
	const slug = scenarioSlug(scenario.name);
	const scenarioDir = path.join(outputDir, slug);
	fs.mkdirSync(scenarioDir, { recursive: true });
	console.log(`\n--- ${scenario.name} (${slug}) ---`);

	// 1. Create view and initialize tree
	const view = independentView(new TreeViewConfiguration({ schema: scenario.schema }));
	view.initialize(scenario.initialTree());

	// 2. Export initial tree state
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const initialTreeState = TreeAlpha.exportVerbose(view.root!);
	const domainHints = scenario.options?.domainHints ?? defaultDomainHints;

	const inputData = {
		name: scenario.name,
		prompt: scenario.prompt,
		domainHints,
		treeState: initialTreeState,
	};

	fs.writeFileSync(
		path.join(scenarioDir, "input.json"),
		JSON.stringify(inputData, null, "\t"),
	);
	console.log(`  Wrote ${slug}/input.json`);

	// 3. Create code-capturing model wrapping the real OpenAI model
	const innerModel = new OpenAiChatModel();
	const capturingModel = new CodeCapturingModel(innerModel);

	// 4. Create agent and run the query
	const agent = new SharedTreeSemanticAgent(capturingModel, view, {
		domainHints,
	});

	console.log(`  Running agent query: "${scenario.prompt}"`);
	const response = await agent.query(scenario.prompt);
	console.log(`  Agent response: ${response.substring(0, 100)}...`);

	// 5. Export final tree state
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const finalTreeState = TreeAlpha.exportVerbose(view.root!);

	const outputData = {
		name: scenario.name,
		treeState: finalTreeState,
	};

	fs.writeFileSync(
		path.join(scenarioDir, "output.json"),
		JSON.stringify(outputData, null, "\t"),
	);
	console.log(`  Wrote ${slug}/output.json`);

	// 6. Write captured code
	const codeData = {
		name: scenario.name,
		generatedCode: capturingModel.generatedCode,
	};

	fs.writeFileSync(
		path.join(scenarioDir, "code.json"),
		JSON.stringify(codeData, null, "\t"),
	);
	console.log(`  Wrote ${slug}/code.json (${capturingModel.generatedCode.length} code snippet(s))`);
}

async function main(): Promise<void> {
	if (!process.env.OPENAI_API_KEY) {
		console.error("Error: OPENAI_API_KEY environment variable is required.");
		process.exit(1);
	}

	const thisDir = path.dirname(fileURLToPath(import.meta.url));
	// When running from compiled JS (lib/test/), resolve back to src/test/datasets/
	const outputDir = path.resolve(thisDir, "../../src/test/datasets");
	fs.mkdirSync(outputDir, { recursive: true });

	console.log(`Output directory: ${outputDir}`);

	const scenarios = [
		createWorkItemTest,
		moveItemStatusTest,
		assignWorkTest,
		sortByPriorityTest,
		bulkStatusUpdateTest,
	];

	for (const scenario of scenarios) {
		await generateForScenario(scenario, outputDir);
	}

	console.log(`\nDone! Generated ${scenarios.length * 3} files in ${outputDir}`);
}

// Only run when executed directly (not when imported by mocha or other test runners).
if (process.argv[1]?.endsWith("generateDataset.js")) {
	main().catch((error) => {
		console.error("Fatal error:", error);
		process.exit(1);
	});
}

/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * LLM Prompt Builders and Score Parsing
 *
 * Builds system and user prompts for LLM-as-judge evaluation.
 * Rubrics and data interpretation are provided by the application via llmEvalConfig.
 * Scoring scale is configurable per rubric (default 0-5).
 */

import { readFileSync } from "fs";
import { extname } from "path";
import { DEFAULT_SCALE } from "../artifactTypes.js";
import type { Rubric, ScoreScale } from "../artifactTypes.js";
import type { EvaluationContext } from "./evaluatorTypes.js";
import type { ContentBlock } from "./llmTypes.js";
import type { ParsedScores } from "./llmTypes.js";

const DEFAULT_DATA_INTERPRETATION_PROMPT =
	"You are evaluating a system that takes structured input and produces structured output. The input describes what was requested. The output is what the system generated.";

/**
 * Resolve the effective scale for a rubric.
 */
function resolveScale(rubric: Rubric, defaultScale?: ScoreScale): ScoreScale {
	return rubric.scale ?? defaultScale ?? DEFAULT_SCALE;
}

/**
 * Determine the shared scale across all rubrics, or null if they differ.
 */
function getUniformScale(rubrics: Rubric[], defaultScale?: ScoreScale): ScoreScale | null {
	const firstRubric = rubrics[0];
	if (firstRubric === undefined) return defaultScale ?? DEFAULT_SCALE;
	const first = resolveScale(firstRubric, defaultScale);
	for (let i = 1; i < rubrics.length; i++) {
		const rubric = rubrics[i];
		if (rubric === undefined) continue;
		const s = resolveScale(rubric, defaultScale);
		if (s.min !== first.min || s.max !== first.max) return null;
	}
	return first;
}

/**
 * Build the scoring scale text dynamically based on the rubric scales.
 */
function buildScoringScale(rubrics: Rubric[], defaultScale?: ScoreScale): string {
	const uniform = getUniformScale(rubrics, defaultScale);
	if (!uniform) {
		// Mixed scales — no generic scale section, each rubric's description should define its own
		return "## Scoring Scale\n\nEach dimension specifies its own scoring range. Use the range shown in the response format for each dimension.";
	}

	const { min, max } = uniform;

	// For the default 0-5 scale, use the detailed descriptors
	if (min === 0 && max === 5) {
		return `## Scoring Scale (applies to all dimensions)

Use this scale for every dimension. Base your score on observable, countable evidence in the output.

- 0: No evidence — the output is empty or completely unrelated to the input
- 1: Minimal — at most one relevant element is present
- 2: Partial — some relevant elements exist but the majority are missing or wrong
- 3: Adequate — the core requirements are met but notable gaps remain
- 4: Strong — nearly all requirements are met with only minor omissions
- 5: Complete — all identifiable requirements are fully addressed`;
	}

	// For custom uniform scales, generate a simpler description
	return `## Scoring Scale (applies to all dimensions)

Score each dimension from ${min} to ${max}. Base your score on observable, countable evidence in the output.

- ${min}: No evidence — the output is empty or completely unrelated to the input
- ${max}: Complete — all identifiable requirements are fully addressed

Use the full range. If a dimension's description includes its own scoring criteria, use those criteria.`;
}

/**
 * Build a numbered rubric line for one dimension.
 */
function buildRubricLine(rubric: Rubric, index: number): string {
	const suffix = rubric.optional ? " *(may be N/A)*" : "";
	return `${index + 1}. **${rubric.name}**: ${rubric.description}${suffix}`;
}

/**
 * Build the response format section from the rubric names.
 */
function buildResponseFormat(rubrics: Rubric[], defaultScale?: ScoreScale): string {
	const lines = [
		"## Response Format",
		"",
		"Respond with exactly one line per dimension in this format:",
		"",
	];
	for (const rubric of rubrics) {
		const { min, max } = resolveScale(rubric, defaultScale);
		if (rubric.optional) {
			lines.push(
				`${rubric.name} - Reasoning: <brief factual justification>, Score: <${min}-${max} or N/A>`,
			);
		} else {
			lines.push(
				`${rubric.name} - Reasoning: <brief factual justification>, Score: <${min}-${max}>`,
			);
		}
	}
	lines.push("");
	lines.push(
		"IMPORTANT: Write the reasoning FIRST, then derive the score from your reasoning. Do not include any other text before or after the dimension lines.",
	);
	return lines.join("\n");
}

/**
 * Build the system prompt for evaluation.
 * Uses provided rubrics or falls back to defaults.
 */
export function buildSystemPrompt(
	rubrics: Rubric[],
	dataInterpretationPrompt?: string,
	defaultScale?: ScoreScale,
): string {
	const interpretation = dataInterpretationPrompt ?? DEFAULT_DATA_INTERPRETATION_PROMPT;
	const uniform = getUniformScale(rubrics, defaultScale);
	const scaleRange = uniform ?? DEFAULT_SCALE;

	const rubricList = rubrics.map(buildRubricLine).join("\n");
	const scoringScale = buildScoringScale(rubrics, defaultScale);
	const responseFormat = buildResponseFormat(rubrics, defaultScale);

	return `You are an evaluation judge. Your task is to score structured output against structured input on specific dimensions.

${interpretation}

## Instructions

- Score each dimension independently from ${scaleRange.min} to ${scaleRange.max}.
- If a dimension's description includes its own scoring criteria (e.g., percentage thresholds), use those criteria instead of the generic scale below.
- Base scores on concrete, observable evidence in the output — not on assumptions about intent.
- Reference specific elements from the input and output in your reasoning.
- If the input is ambiguous, score based on the most reasonable interpretation.${rubrics.some((r) => r.optional) ? "\n- If a dimension is marked as optional and is not applicable, respond with Score: N/A and explain why." : ""}

${scoringScale}

## Dimensions to Evaluate

${rubricList}

${responseFormat}`;
}

/**
 * Infer image media type from file extension.
 */
function inferMediaType(
	filePath: string,
): "image/png" | "image/jpeg" | "image/gif" | "image/webp" {
	const ext = extname(filePath).toLowerCase();
	switch (ext) {
		case ".jpg":
		case ".jpeg":
			return "image/jpeg";
		case ".gif":
			return "image/gif";
		case ".webp":
			return "image/webp";
		default:
			return "image/png";
	}
}

/**
 * Build the user prompt with input/output data for evaluation.
 *
 * When a screenshotPath is provided, returns a ContentBlock[] with the image
 * embedded as a base64 ImageContent block. Otherwise returns a plain string.
 */
export function buildUserPrompt(context: EvaluationContext): string | ContentBlock[] {
	const { input, output, screenshotPath, screenshotPaths } = context;
	const lines: string[] = [];

	if (input && Object.keys(input).length > 0) {
		lines.push("## Input");
		lines.push(JSON.stringify(input, null, 2));
		lines.push("");
	}

	lines.push("## Output");
	lines.push(JSON.stringify(output, null, 2));

	// Multiple screenshots (e.g., all slides for coherence scoring)
	if (screenshotPaths && screenshotPaths.length > 0) {
		const blocks: ContentBlock[] = [{ type: "text", text: lines.join("\n") }];
		for (const [idx, ssPath] of screenshotPaths.entries()) {
			const imgData = readFileSync(ssPath);
			const mediaType = inferMediaType(ssPath);
			blocks.push({
				type: "text",
				text: `\n[Screenshot ${idx + 1} of ${screenshotPaths.length}]`,
			});
			blocks.push({ type: "image", mediaType, data: imgData.toString("base64") });
		}
		return blocks;
	}

	// Single screenshot
	if (screenshotPath) {
		const imageData = readFileSync(screenshotPath);
		const base64 = imageData.toString("base64");
		const mediaType = inferMediaType(screenshotPath);

		const blocks: ContentBlock[] = [
			{ type: "text", text: lines.join("\n") },
			{ type: "text", text: "\n## Screenshot" },
			{ type: "image", mediaType, data: base64 },
		];
		return blocks;
	}

	return lines.join("\n");
}

/**
 * Parse dimension scores from LLM response text.
 * Dynamically matches against the provided rubric names.
 * Supports configurable score scales and optional (N/A) rubrics.
 *
 * @returns Parsed scores keyed by rubric name, or undefined if any required dimension is missing
 */
export function parseScores(
	response: string,
	rubrics: Rubric[],
	defaultScale?: ScoreScale,
): ParsedScores | undefined {
	const scores: ParsedScores = {};

	for (const rubric of rubrics) {
		const escaped = rubric.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const { min, max } = resolveScale(rubric, defaultScale);

		// Try matching N/A first for optional rubrics
		if (rubric.optional) {
			const naPattern = new RegExp(
				`${escaped} - Reasoning:\\s*(.+?)[.,;]\\s*Score:\\s*N\\/?A`,
				"i",
			);
			const naMatch = response.match(naPattern);
			if (naMatch !== null && naMatch[1] !== undefined) {
				scores[rubric.name] = { score: null, reasoning: naMatch[1].trim() };
				continue;
			}
		}

		// Match numeric score — supports multi-digit scores (e.g., 0-10)
		const pattern = new RegExp(
			`${escaped} - Reasoning:\\s*(.+?)[.,;]\\s*Score:\\s*(\\d+)`,
			"i",
		);
		const match = response.match(pattern);
		if (!match) {
			if (rubric.optional) {
				// Optional rubric with no match — treat as N/A
				scores[rubric.name] = { score: null, reasoning: "No score provided by judge" };
				continue;
			}
			return undefined;
		}
		const reasoning = match[1]?.trim() ?? "";
		const rawScore = match[2] !== undefined ? parseInt(match[2], 10) : min;
		const score = Math.max(min, Math.min(max, rawScore));
		scores[rubric.name] = { score, reasoning };
	}

	return scores;
}

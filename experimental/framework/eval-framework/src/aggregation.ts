/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Result Aggregation
 *
 * Composable aggregation for evaluation results. Computes per-dimension
 * statistics (average, min, max, count) with N/A filtering and optional
 * status classification via configurable thresholds.
 */

import type { Rubric, ScoreScale } from "./artifactTypes.js";
import { DEFAULT_SCALE } from "./artifactTypes.js";
import type { EvaluationResult } from "./resultTypes.js";

// ============================================================================
// Types
// ============================================================================

/** @public */
export interface AggregationOptions {
	/** Skip null (N/A) scores when computing stats (default: true) */
	excludeNull?: boolean;
	/** Status classification thresholds (percentage). If provided, result includes a status string. */
	thresholds?: StatusThresholds;
}

/** @public */
export interface StatusThresholds {
	/** Percentage at or above which status is the first label (default label: "GOOD") */
	good: number;
	/** Percentage at or above which status is the second label (default label: "PASS") */
	pass: number;
	/** Custom labels (default: ["GOOD", "PASS", "NEEDS_IMPROVEMENT"]) */
	labels?: [string, string, string];
}

/** @public */
export interface DimensionStats {
	average: number | null;
	count: number;
	min: number | null;
	max: number | null;
}

/** @public */
export interface AggregatedResult {
	/** Per-rubric dimension statistics */
	dimensions: Record<string, DimensionStats>;
	/** Sum of all non-null scores */
	totalPoints: number;
	/** Maximum possible points (count × scale max for each scored dimension) */
	maxPossiblePoints: number;
	/** Overall percentage (totalPoints / maxPossiblePoints × 100) */
	overallPercentage: number;
	/** Status classification (only present if thresholds were provided) */
	status?: string;
}

// ============================================================================
// Implementation
// ============================================================================

/**
 * Aggregate evaluation results across multiple evaluated items.
 *
 * @param results - One EvaluationResult[] per evaluated item (e.g., per slide).
 *                  Each inner array has one result per rubric.
 * @param rubrics - The rubric definitions (used for dimension names and scale).
 * @param options - Aggregation options (N/A filtering, status thresholds).
 * @public
 */
export function aggregateResults(
	results: EvaluationResult[][],
	rubrics: Rubric[],
	options: AggregationOptions = {},
): AggregatedResult {
	const { excludeNull = true, thresholds } = options;

	const dimensions: Record<string, DimensionStats> = {};
	let totalPoints = 0;
	let maxPossiblePoints = 0;

	for (const rubric of rubrics) {
		const scale: ScoreScale = rubric.scale ?? DEFAULT_SCALE;

		// Collect all scores for this rubric across all evaluated items
		const scores: number[] = [];
		for (const itemResults of results) {
			const match = itemResults.find((r) => r.rubricName === rubric.name);
			if (!match) continue;
			if (match.score === null) {
				if (!excludeNull) scores.push(0);
				continue;
			}
			scores.push(match.score);
		}

		if (scores.length === 0) {
			dimensions[rubric.name] = { average: null, count: 0, min: null, max: null };
			continue;
		}

		const sum = scores.reduce((a, b) => a + b, 0);
		const avg = sum / scores.length;
		dimensions[rubric.name] = {
			average: Math.round(avg * 100) / 100,
			count: scores.length,
			min: Math.min(...scores),
			max: Math.max(...scores),
		};

		totalPoints += sum;
		maxPossiblePoints += scores.length * scale.max;
	}

	const overallPercentage =
		maxPossiblePoints > 0 ? Math.round((totalPoints / maxPossiblePoints) * 10000) / 100 : 0;

	const result: AggregatedResult = {
		dimensions,
		totalPoints,
		maxPossiblePoints,
		overallPercentage,
	};

	if (thresholds) {
		const labels = thresholds.labels ?? ["GOOD", "PASS", "NEEDS_IMPROVEMENT"];
		if (overallPercentage >= thresholds.good) {
			result.status = labels[0];
		} else if (overallPercentage >= thresholds.pass) {
			result.status = labels[1];
		} else {
			result.status = labels[2];
		}
	}

	return result;
}

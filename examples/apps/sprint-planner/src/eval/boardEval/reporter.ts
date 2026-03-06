import * as fs from 'fs';
import * as path from 'path';
import type { ScenarioEvalResult, DatasetEvalResult } from './types/resultTypes.js';
import type { Logger } from './types/loggerTypes.js';

/**
 * Format a duration in milliseconds to a human-readable string.
 */
function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  const seconds = ms / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
}

/**
 * Convert an evaluator/dimension name to a human-readable display name.
 * e.g., "llm-task-completion" → "Task Completion", "overlap" → "Overlap"
 */
function formatEvaluatorDisplayName(name: string): string {
  return name
    .replace(/^llm-/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Generate a markdown summary for a single dataset result.
 * Links point to the appData/ subfolder.
 */
export function generateDatasetSummaryMarkdown(datasetResult: DatasetEvalResult): string {
  const lines: string[] = [];

  // Header
  lines.push(`# Dataset: ${datasetResult.name}`);
  lines.push('');

  // Metadata table
  lines.push('| Field | Value |');
  lines.push('|-------|-------|');
  lines.push(`| **Duration** | ${formatDuration(datasetResult.resultMetadata.executionTimeMs)} |`);
  lines.push(`| **Timestamp** | ${datasetResult.resultMetadata.timestamp} |`);
  lines.push('');

  // Input section
  lines.push('## Input');
  lines.push('');
  if (datasetResult.input) {
    lines.push('**Input Data:** [input.json](appData/input.json)');
  }
  lines.push('');

  // Output section
  lines.push('## Output');
  lines.push('');
  if (datasetResult.screenshotData) {
    lines.push(`![Board Screenshot](appData/screenshot.png)`);
    lines.push('');
  }
  lines.push('**Output State:** [input.json](appData/input.json)');
  lines.push('');

  // Evaluation results
  if (datasetResult.evalResult.length > 0) {
    lines.push('## Evaluation Results');
    lines.push('');
    lines.push('| Evaluator | Score | Reasoning |');
    lines.push('|-----------|-------|-----------|');

    for (const evaluation of datasetResult.evalResult) {
      const displayName = formatEvaluatorDisplayName(evaluation.evaluatorName);
      lines.push(`| ${displayName} | ${evaluation.score.toFixed(2)} | ${evaluation.reasoning} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Write eval results to a structured output directory.
 *
 * Creates:
 *   {outputDir}/{datasetName}/
 *     appData/
 *       input.json
 *       llmEvalConfig.json
 *       screenshot.png
 *     result.json
 *     summary.md
 *
 * @returns The path to the output directory.
 */
export function writeResultsToDirectory(result: ScenarioEvalResult, outputDir: string, logger: Logger): string {
  fs.mkdirSync(outputDir, { recursive: true });
  logger.info(`Writing results to: ${outputDir}`);

  for (const datasetResult of result.datasetResults) {
    const scenarioDir = path.join(outputDir, `dataset-${datasetResult.name}`);
    const appDataDir = path.join(scenarioDir, 'appData');
    fs.mkdirSync(appDataDir, { recursive: true });

    // Write appData files
    if (datasetResult.screenshotData) {
      fs.writeFileSync(path.join(appDataDir, 'screenshot.png'), datasetResult.screenshotData);
    }

    if (datasetResult.output || datasetResult.input) {
      fs.writeFileSync(
        path.join(appDataDir, 'input.json'),
        JSON.stringify({ appInput: datasetResult.input, appOutput: datasetResult.output }, null, 2)
      );
    }


    // Write result.json at dataset level (strip large data fields, use relative paths)
    const { screenshotData, output, input, ...resultWithoutData } = datasetResult;
    const resultJson = {
      ...resultWithoutData,
      resultMetadata: {
        ...resultWithoutData.resultMetadata,
        screenshotPath: screenshotData ? './appData/screenshot.png' : undefined,
        inputPath: output || input ? './appData/input.json' : undefined,
        llmEvalConfigPath: undefined
      }
    };
    fs.writeFileSync(path.join(scenarioDir, 'result.json'), JSON.stringify(resultJson, null, 2));

    // Write summary.md at scenario level
    const summaryMarkdown = generateDatasetSummaryMarkdown(datasetResult);
    fs.writeFileSync(path.join(scenarioDir, 'summary.md'), summaryMarkdown);
  }
  // Write scenario-level result.json
  const scenarioResult = {
    name: result.name,
    appMetadata: result.appMetadata,
    result: result.resultMetadata
  };
  fs.writeFileSync(path.join(outputDir, 'result.json'), JSON.stringify(scenarioResult, null, 2));

  logger.debug(`Wrote ${result.datasetResults.length} dataset directories`);

  return outputDir;
}

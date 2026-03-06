/* eslint-disable -- barrel file for eval framework */

// Framework
export { EvalFramework } from './framework.js';

// Config
export type { EvaluatorsConfig, EvaluatorDetails } from './types/configTypes.js';

// Evaluators
export { evaluatorRegistry } from './evaluators/base.js';
export type { Rubric, EvaluationContext, IEvaluator } from './types/evaluatorTypes.js';

// Reporter
export { generateDatasetSummaryMarkdown, writeResultsToDirectory } from './reporter.js';

// Types
export type { FrameworkOptions } from './types/frameworkTypes.js';
export type { DatasetArtifact, ScenarioArtifact } from './types/artifactTypes.js';
export type { JsonObject } from './types/jsonTypes.js';
export type { Logger } from './types/loggerTypes.js';
export { consoleLogger } from './types/loggerTypes.js';
export type { ScenarioEvalResult, DatasetEvalResult, EvaluationResult } from './types/resultTypes.js';

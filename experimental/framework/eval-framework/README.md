# Eval Framework

LLM-as-judge evaluation framework. Scores AI-generated outputs against configurable rubrics with support for multimodal evaluation, custom scoring scales, concurrent execution, and result aggregation.

## Quick Start

```typescript
import { EvalFramework, consoleLogger } from '@fluid-experimental/eval-framework';

const framework = new EvalFramework({
  llmClient: myClient,        // your ILLMClient implementation
  logger: consoleLogger,
  concurrency: 10,
});

const result = await framework.run({
  name: 'my-eval',
  llmEvalConfigPath: './eval-config.json',
  datasetArtifacts: [
    { name: 'test-1', inputPath: './data/test-1/input.json', screenshotPath: './screenshots/test-1.png', metadata: {} },
    { name: 'test-2', inputPath: './data/test-2/input.json', metadata: {} },
  ],
  metadata: {},
});

// result.datasetResults[0].evalResult → EvaluationResult[] for test-1
```

## Two Ways to Use

### `EvalFramework.run()` — recommended

Reads config from disk, evaluates all artifacts with bounded concurrency, returns structured `ScenarioEvalResult`. Use this when you have a batch of items to evaluate.

### `LlmAsJudgeEvaluator.evaluate()` — advanced

Single evaluation call. You provide the full `EvaluationContext` (input, output, rubrics, screenshots, etc.). Use this when you need custom orchestration or want to call the evaluator directly in tests.

```typescript
import { LlmAsJudgeEvaluator } from '@fluid-experimental/eval-framework';

const evaluator = new LlmAsJudgeEvaluator(myClient);
const results = await evaluator.evaluate({
  input: { prompt: 'Summarize Q4 earnings' },
  output: { summary: 'Revenue grew 15%...' },
  rubrics: [{ name: 'accuracy', description: 'Factual correctness' }],
  modelType: 'gpt-52-chat',
  logger: consoleLogger,
});
```

## Data Contract

### Input JSON file (`InputFileOnDisk`)

Each dataset artifact points to a JSON file on disk with this shape:

```json
{
  "appInput": {
    "input": { "prompt": "Create a presentation about SMART goals" },
    "metadata": {}
  },
  "appOutput": {
    "slideNumber": 1
  },
  "evalContext": {
    "dataInterpretationPrompt": "You are evaluating slide 1. Automated checks found: overflow on element X..."
  }
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `appInput.input` | No | Structured input that produced the output |
| `appInput.metadata` | Yes | Opaque metadata from the generation phase |
| `appOutput` | Yes | The generated output to evaluate |
| `evalContext` | No | Per-dataset evaluation overrides |
| `evalContext.dataInterpretationPrompt` | No | Overrides the config-level prompt for this dataset |

### Eval config file (`LlmEvalConfigOnDisk`)

Scenario-level configuration read by `framework.run()`:

```json
{
  "rubrics": [
    { "name": "accuracy", "description": "Factual correctness of the output" },
    { "name": "chart_quality", "description": "Chart accuracy", "optional": true }
  ],
  "defaultScale": { "min": 0, "max": 10 },
  "dataInterpretationPrompt": "You are evaluating an AI-generated presentation..."
}
```

### `DatasetArtifact`

Minimal pointer to data on disk:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Artifact identifier |
| `inputPath` | `string` | Yes | Path to input JSON file |
| `screenshotPath` | `string` | No | Single screenshot |
| `screenshotPaths` | `string[]` | No | Multiple screenshots (e.g., all slides for coherence) |
| `metadata` | `JsonObject` | Yes | Opaque metadata passed through to results |

## Features

### Custom Scoring Scales

Default is 0-5. Override per rubric or set a default for all:

```json
{
  "defaultScale": { "min": 0, "max": 10 },
  "rubrics": [
    { "name": "quality", "description": "...", "scale": { "min": 1, "max": 5 } }
  ]
}
```

Rubric-level `scale` takes precedence over `defaultScale`.

### Optional Rubrics (N/A)

Mark rubrics as `optional: true`. The LLM can respond "N/A" and the score will be `null`:

```json
{ "name": "chart_quality", "description": "...", "optional": true }
```

### Multimodal Evaluation

Set `screenshotPath` (single) or `screenshotPaths` (multiple) on the artifact. Screenshots are automatically base64-encoded and sent to the LLM as image content blocks.

### Concurrency

```typescript
new EvalFramework({ llmClient, logger, concurrency: 10 });
```

## Aggregation

```typescript
import { aggregateResults } from '@fluid-experimental/eval-framework';

const aggregate = aggregateResults(
  result.datasetResults.map(dr => dr.evalResult),  // EvaluationResult[][]
  rubrics,
  { excludeNull: true, thresholds: { good: 80, pass: 60 } },
);
// → { dimensions, totalPoints, maxPossiblePoints, overallPercentage, status }
```

Returns `AggregatedResult` with typed `DimensionStats` per rubric:

```typescript
interface AggregatedResult {
  dimensions: Record<string, DimensionStats>;  // { average, count, min, max }
  totalPoints: number;
  maxPossiblePoints: number;
  overallPercentage: number;
  status?: string;  // 'GOOD' | 'PASS' | 'NEEDS_IMPROVEMENT' (if thresholds set)
}
```

## Implementing `ILLMClient`

```typescript
import type { ILLMClient, ChatMessage, LLMResponse } from '@fluid-experimental/eval-framework';

class MyLLMClient implements ILLMClient {
  async chatCompletion(messages: ChatMessage[]): Promise<LLMResponse> {
    // messages[].content is string | ContentBlock[]
    // ContentBlock = { type: 'text', text } | { type: 'image', mediaType, data }
    const response = await myProvider.chat(messages);
    return { content: response.text, model: response.model };
  }
}
```

## Exported Types

```typescript
// Core
EvalFramework, LlmAsJudgeEvaluator, aggregateResults, consoleLogger, DEFAULT_SCALE

// Artifacts & config
ScenarioArtifact, DatasetArtifact, Rubric, ScoreScale, JsonObject
EvalModelType, FrameworkOptions, LlmEvalConfigOnDisk, InputFileOnDisk, EvalContext

// Results
ScenarioEvalResult, DatasetEvalResult, EvaluationResult
AggregatedResult, DimensionStats, AggregationOptions, StatusThresholds

// Evaluator
ILLMClient, IEvaluator, EvaluationContext
ChatMessage, LLMResponse, ContentBlock, TextContent, ImageContent
Logger
```

## Dependencies

Zero runtime dependencies. Uses only Node.js builtins (`fs`, `path`).

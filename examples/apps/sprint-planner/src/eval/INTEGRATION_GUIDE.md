# Eval Framework Integration Guide

This document describes how the generic `boardEval` evaluation framework was integrated into the sprint-planner app. It covers two areas:

1. **What was tweaked in the boardEval code** (the generic eval framework)
2. **What had to be built from scratch** (app-specific generation, data, and CLI)

This serves as a reference for anyone integrating the eval framework into another LLM-powered app.

---

## Part 1: Tweaks Made to boardEval Code

The `boardEval/` directory was copied from `office-bohemia-eval/packages/copilot-board/src/eval/boardEval/`. Most files were copied **verbatim**. Below is an exhaustive list of every modification.

### `llm/llmClient.ts` — Full Rewrite (LLM Backend)

The only file that required a complete rewrite. The original uses `AugLoopLLMClient`, which depends on Microsoft-internal infrastructure (`@augloop-types/generative-ai`, `@fluidx/base-container`, AugLoop session initialization, `SubstrateToolDataFetcher`).

**Replaced with:** `OpenAiLLMClient` using the `openai` npm package (~30 lines). The interface (`ILLMClient`, `ChatMessage`, `LLMResponse`) was kept identical.

`MockLLMClient` was kept unchanged (useful for testing without API keys).

**Takeaway for other integrators:** You must provide your own `ILLMClient` implementation for whatever LLM backend you use. The interface is simple — just implement `chatCompletion(messages: ChatMessage[]): Promise<LLMResponse>`.

### `evaluators/llmBoardQualityEvaluator.ts` — Minor Edits

- Removed `import type { ModelType } from '../../../types.js'` (copilot-board-specific type)
- Changed `#getClient` to import `OpenAiLLMClient` instead of `AugLoopLLMClient`
- Changed parameter type from `ModelType` to `string`
- Added nullish coalescing (`parsed[rubric.name]?.score ?? FALLBACK_SCORE`) for stricter TypeScript

### `llm/prompts.ts` — TypeScript Strictness Fixes Only

- Added `?? '0'` and `?? ''` for regex match results (`match[1]`, `match[2]`)
- No semantic changes — purely TypeScript strictness differences between codebases

### `index.ts` — ESLint Comment Fix

- Changed `@fluidx/ffx-rules/no-barrel-files` to generic `eslint-disable` (different ESLint config)

### Files NOT Copied

- **`evaluators/overlapEvaluator.ts`** — Board-specific bounding-box overlap evaluator. Depends on `@fluidframework/tree/alpha` and copilot-board's `NodeState` schema. Not applicable to apps without spatial layout. Simply skipped — the evaluator registry gracefully handles missing evaluators.

### Files Copied Verbatim (No Changes)

- `framework.ts` — Core `EvalFramework` class
- `reporter.ts` — Results writer + markdown summary generator
- `evaluators/base.ts` — `BaseEvaluator`, `EvaluatorRegistry`, `registerEvaluator`
- `types/artifactTypes.ts` — `DatasetArtifact`, `ScenarioArtifact`
- `types/configTypes.ts` — `EvaluatorsConfig`, `EvaluatorDetails`
- `types/evaluatorTypes.ts` — `EvaluationContext`, `IEvaluator`, `Rubric`
- `types/frameworkTypes.ts` — `FrameworkOptions`, `InputFileOnDisk`, `LlmEvalConfigOnDisk`
- `types/jsonTypes.ts` — `JsonObject`
- `types/loggerTypes.ts` — `Logger`, `consoleLogger`
- `types/resultTypes.ts` — Result types

### Summary

Only **1 file needed a full rewrite** (LLM client), **2 files needed minor edits** (evaluator + prompts), and **1 had a cosmetic fix** (eslint comment). The core framework (`framework.ts`, `reporter.ts`, `base.ts`, all types) required zero changes.

---

## Part 2: What You Need to Build (App-Specific Code)

To integrate the eval framework into a new app, you need to implement the following.

### 1. Implement the `OutputGenerator` Interface

Create a class that wraps your app's AI agent:

```typescript
import type { OutputGenerator, DatasetGenerationResult } from "./boardEval/types/generatorTypes.js";
import type { JsonObject } from "./boardEval/types/jsonTypes.js";

export class MyAppGenerator implements OutputGenerator {
  async generate(prompt: string, initialState?: JsonObject): Promise<DatasetGenerationResult> {
    // 1. Set up your app's data model with initialState (or defaults)
    // 2. Run your AI agent with the prompt
    // 3. Export the resulting state as JSON
    return {
      output: resultingState,         // JsonObject — the output to evaluate
      outputMetadata: { ... }         // Any metadata (execution time, model used, etc.)
    };
  }
}
```

For sprint-planner, this is `generators/sprintPlannerGenerator.ts` (~50 lines). It creates a SharedTree view, initializes it, runs `SharedTreeSemanticAgent.query()`, and exports the final tree via `TreeAlpha.exportVerbose()`.

### 2. Write an `artifactGenerator.ts`

This function orchestrates the generation phase:

1. Loads a scenario JSON file
2. Writes `llmEvalConfig.json` at the scenario level
3. For each dataset, calls your generator and writes `input.json` to disk

The `input.json` format must be:
```json
{
  "appInput": {
    "name": "dataset_name",
    "metadata": { ... },
    "input": { /* your app's input data — passed to evaluators */ }
  },
  "appOutput": { /* your generator's output — the thing being evaluated */ }
}
```

You can adapt the upstream `boardGeneration/artifactGenerator.ts`, removing AugLoop/screenshot logic. See `generators/artifactGenerator.ts` for the simplified version (~80 lines).

### 3. Create Dataset JSON Files

Create scenario files in `datasets/` matching the `Scenario` interface:

```json
{
  "name": "my_scenario",
  "metadata": { "version": "1.0.0" },
  "llmEvalConfig": {
    "dataInterpretationPrompt": "Explain to the LLM judge what your input/output data represents...",
    "rubrics": [
      {
        "name": "Dimension Name",
        "description": "What to evaluate and how to count evidence..."
      }
    ]
  },
  "datasets": [
    {
      "name": "test_case_1",
      "metadata": { "category": "..." },
      "input": { /* app-specific input — prompt, initial state, etc. */ }
    }
  ]
}
```

**Key:** The `llmEvalConfig` is where all app-specific evaluation logic lives. The `rubrics` define what dimensions to score (0-5), and `dataInterpretationPrompt` tells the LLM judge how to interpret your data. No custom evaluator code needed.

### 4. Create Evaluator Config

`configs/default.json`:
```json
{
  "evaluators": [
    { "name": "llm-board-quality", "enabled": true, "weight": 1.0 }
  ]
}
```

### 5. Create CLI Entry Point

Adapt the CLI from `cli.ts` — wire up your generator, set correct path resolution, remove any AugLoop-specific flags. Add an `"eval"` script to `package.json`.

### 6. Add Dependencies

- `commander` — CLI argument parsing
- Your LLM client's SDK (e.g., `openai`) — for both generation and evaluation

### 7. Copy Type Files from boardGeneration

Two type files are needed from the generation side:
- `inputTypes.ts` — `Scenario`, `Dataset`, `LlmEvalConfig` interfaces
- `generatorTypes.ts` — `OutputGenerator`, `DatasetGenerationResult`, `GenerateArtifactsOptions`

Remove any `ModelType` references (copilot-board-specific) — use `string` instead.

---

## Output Structure

After running `npm run eval -- run <dataset.json>`, results are written to `src/eval/data/scenario-<name>-<timestamp>/`:

```
scenario-my_scenario-2026-03-06T.../
├── result.json                          # Scenario-level summary (avg score, evaluators used)
├── appData/
│   └── llmEvalConfig.json               # Rubrics + data interpretation prompt
├── dataset-test_case_1/
│   ├── result.json                      # Per-dataset scores
│   ├── summary.md                       # Human-readable evaluation report
│   └── appData/
│       └── input.json                   # { appInput, appOutput } — the raw data
```

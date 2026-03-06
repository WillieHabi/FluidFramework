# Sprint Planner

An example app demonstrating a SharedTree AI agent for sprint planning, with an integrated evaluation framework.

## Prerequisites

- Node.js 18+
- pnpm
- `OPENAI_API_KEY` environment variable set

## Setup

```bash
# From the FluidFramework repo root
pnpm install

# Build the sprint-planner package and its dependencies
cd examples/apps/sprint-planner
npx tsc --project ./tsconfig.json
```

## Running the App

```bash
npm run app
```

This creates an in-memory sprint board with sample data, then runs the AI agent to answer a query.

## Running Evals

The evaluation framework tests the AI agent's ability to correctly edit sprint board data. It uses an LLM-as-judge approach with configurable rubrics.

### Quick Start

```bash
# Run all scenarios (requires OPENAI_API_KEY)
npm run eval -- run sprint_planner_scenarios.json
```

### CLI Options

```
npm run eval -- run <dataset> [options]

Options:
  --judge-model <name>      Model for LLM evaluator (default: gpt-4o-mini)
  -c, --config <path>       Evaluator config file (default: default.json)
  -e, --evaluators <names>  Comma-separated evaluators to run
```

### Example Runs

```bash
# Use a different judge model
npm run eval -- run sprint_planner_scenarios.json --judge-model gpt-4o

# Use a specific evaluator
npm run eval -- run sprint_planner_scenarios.json -e llm-board-quality
```

### Understanding Results

Results are written to `src/eval/data/scenario-<name>-<timestamp>/`:

```
scenario-sprint_planner_basic-2026.../
├── result.json              # Scenario summary (avg score, evaluators used)
├── appData/
│   └── llmEvalConfig.json   # Rubrics and data interpretation prompt
├── dataset-create_work_item/
│   ├── result.json          # Per-dataset scores
│   ├── summary.md           # Human-readable evaluation report
│   └── appData/
│       └── input.json       # Initial tree state (input) + final tree state (output)
└── ...
```

Each `input.json` contains `appInput` (including the initial tree state and prompt) and `appOutput` (the final tree state after the agent ran), so the evaluator can compare before/after.

### Adding New Scenarios

Edit `src/eval/datasets/sprint_planner_scenarios.json` to add datasets:

```json
{
  "name": "my_new_test",
  "metadata": { "category": "..." },
  "input": {
    "prompt": "Your natural language instruction here",
    "domainHints": "Context about the sprint board domain..."
  }
}
```

Evaluation dimensions are configured in the scenario's `llmEvalConfig.rubrics` — no code changes needed to customize what the LLM judge evaluates.

## Eval Framework Integration Guide

For details on how the generic eval framework was ported from office-bohemia-eval and what's needed to integrate it into other apps, see [`src/eval/INTEGRATION_GUIDE.md`](src/eval/INTEGRATION_GUIDE.md).

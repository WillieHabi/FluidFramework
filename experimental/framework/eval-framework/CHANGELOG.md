# Changelog

## 2.91.0

Initial release.

- `EvalFramework.run()` — batch evaluation with bounded concurrency
- `LlmAsJudgeEvaluator` — single-call LLM-as-judge evaluator
- `aggregateResults()` — typed result aggregation with status thresholds
- Configurable scoring scales (`ScoreScale`, `defaultScale`)
- Optional rubrics with N/A support (`score: number | null`)
- Multimodal evaluation (single and multiple screenshots)
- `evalContext` in input JSON files for per-dataset prompt overrides
- Zero runtime dependencies

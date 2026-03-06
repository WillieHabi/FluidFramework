/**
 * LLM Prompt Builders and Score Parsing
 *
 * Builds system and user prompts for LLM-as-judge evaluation.
 * Rubrics and data interpretation are provided by the application via llmEvalConfig.
 * The scoring scale (0-5) is standardized by the framework.
 */

import type { EvaluationContext, Rubric } from '../evaluators/base.js';

/**
 * Parsed scores from LLM response — keyed by rubric name.
 */
export type ParsedScores = Record<string, { score: number; reasoning: string }>;

/**
 * Default rubrics used when the application does not provide any.
 */
export const DEFAULT_RUBRICS: Rubric[] = [
  {
    name: 'Task Completion',
    description:
      'Does the output fulfill what was requested in the input? Count the specific requirements in the input and check how many are present in the output.'
  },
  {
    name: 'Structure Quality',
    description:
      'Is the output well-organized with logical relationships between components? Check that connections between elements are correct and data flows in the expected direction.'
  },
  {
    name: 'Content Relevance',
    description:
      'Is the content in the output specific and relevant to the input, or is it generic filler? Check that labels, text, and values directly relate to the input context.'
  }
];

const DEFAULT_DATA_INTERPRETATION_PROMPT =
  'You are evaluating a system that takes structured input and produces structured output. The input describes what was requested. The output is what the system generated.';

/**
 * Standard scoring scale applied to all rubrics.
 * Defined once by the framework to ensure consistency.
 */
const SCORING_SCALE = `## Scoring Scale (applies to all dimensions)

Use this scale for every dimension. Base your score on observable, countable evidence in the output.

- 0: No evidence — the output is empty or completely unrelated to the input
- 1: Minimal — at most one relevant element is present
- 2: Partial — some relevant elements exist but the majority are missing or wrong
- 3: Adequate — the core requirements are met but notable gaps remain
- 4: Strong — nearly all requirements are met with only minor omissions
- 5: Complete — all identifiable requirements are fully addressed`;

/**
 * Build a numbered rubric line for one dimension.
 */
function buildRubricLine(rubric: Rubric, index: number): string {
  return `${index + 1}. **${rubric.name}**: ${rubric.description}`;
}

/**
 * Build the response format section from the rubric names.
 */
function buildResponseFormat(rubrics: Rubric[]): string {
  const lines = ['## Response Format', '', 'Respond with exactly one line per dimension in this format:', ''];
  for (const rubric of rubrics) {
    lines.push(`${rubric.name} - Score: <0-5>, Reasoning: <brief factual justification>`);
  }
  lines.push('');
  lines.push('Do not include any other text before or after the dimension lines.');
  return lines.join('\n');
}

/**
 * Build the system prompt for evaluation.
 * Uses provided rubrics or falls back to defaults.
 */
export function buildSystemPrompt(rubrics?: Rubric[], dataInterpretationPrompt?: string): string {
  const effectiveRubrics = rubrics?.length ? rubrics : DEFAULT_RUBRICS;
  const interpretation = dataInterpretationPrompt ?? DEFAULT_DATA_INTERPRETATION_PROMPT;

  const rubricList = effectiveRubrics.map(buildRubricLine).join('\n');
  const responseFormat = buildResponseFormat(effectiveRubrics);

  return `You are an evaluation judge. Your task is to score structured output against structured input on specific dimensions.

${interpretation}

## Instructions

- Score each dimension independently from 0 to 5 using the scale below.
- Base scores on concrete, observable evidence in the output — not on assumptions about intent.
- Reference specific elements from the input and output in your reasoning.
- If the input is ambiguous, score based on the most reasonable interpretation.

${SCORING_SCALE}

## Dimensions to Evaluate

${rubricList}

${responseFormat}`;
}

/**
 * Build the user prompt with input/output data for evaluation.
 */
export function buildUserPrompt(context: EvaluationContext): string {
  const { input, output, screenshotPath } = context;
  const lines: string[] = [];

  if (input && Object.keys(input).length > 0) {
    lines.push('## Input');
    lines.push(JSON.stringify(input, null, 2));
    lines.push('');
  }

  lines.push('## Output');
  lines.push(JSON.stringify(output, null, 2));

  if (screenshotPath) {
    lines.push('');
    lines.push('## Screenshot');
    lines.push(`A rendered screenshot is available at: ${screenshotPath}`);
  }

  return lines.join('\n');
}

/**
 * Parse dimension scores from LLM response text.
 * Dynamically matches against the provided rubric names.
 *
 * @returns Parsed scores keyed by rubric name, or undefined if any dimension is missing
 */
export function parseScores(response: string, rubrics?: Rubric[]): ParsedScores | undefined {
  const effectiveRubrics = rubrics?.length ? rubrics : DEFAULT_RUBRICS;
  const scores: ParsedScores = {};

  for (const rubric of effectiveRubrics) {
    const pattern = new RegExp(
      `${rubric.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} - Score:\\s*(\\d),\\s*Reasoning:\\s*(.+)`,
      'i'
    );
    const match = response.match(pattern);
    if (!match) {
      return undefined;
    }
    const score = Math.max(0, Math.min(5, parseInt(match[1] ?? '0', 10)));
    const reasoning = (match[2] ?? '').trim();
    scores[rubric.name] = { score, reasoning };
  }

  return scores;
}

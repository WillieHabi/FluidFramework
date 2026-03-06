import type { JsonObject } from './jsonTypes.js';

// Configuration Types
export interface EvaluatorDetails {
  name: string;
  enabled: boolean;
  weight?: number;
  options?: JsonObject;
}

export interface EvaluatorsConfig {
  evaluators: EvaluatorDetails[];
}

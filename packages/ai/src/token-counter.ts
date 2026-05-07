/**
 * @module token-counter
 * @description Approximate token counting for rate limiting AI generation.
 * Uses a simple heuristic rather than tiktoken for zero dependencies.
 *
 * @example
 * ```typescript
 * import { countTokens, estimateCost } from './token-counter.js';
 *
 * const tokens = countTokens('Generate a dropdown component with...');
 * const cost = estimateCost(tokens, 'gpt-4');
 * ```
 */

/**
 * Approximately counts the number of tokens in a string.
 * Uses the ~4 characters = 1 token heuristic for English text.
 * This is intentionally conservative (overestimates) for rate limiting safety.
 *
 * @param text - The text to estimate token count for
 * @returns Estimated number of tokens
 *
 * @example
 * ```typescript
 * countTokens('Hello world'); // ~3
 * countTokens('');            // 0
 * ```
 */
export function countTokens(text: string): number {
  if (!text) return 0;
  // Heuristic: ~4 characters per token for English, ~3 for JSON/code
  // We use 3.5 as a compromise and round up for safety
  return Math.ceil(text.length / 3.5);
}

/** Token limits per model */
const MODEL_LIMITS: Record<string, number> = {
  'gpt-4o': 128000,
  'gpt-4o-mini': 128000,
  'gpt-4-turbo': 128000,
  'gpt-4': 8192,
  'gpt-3.5-turbo': 16384,
};

/**
 * Checks if the token count exceeds a model's limit.
 *
 * @param tokenCount - Number of tokens
 * @param model - Model name
 * @returns Whether the token count is within limits
 *
 * @example
 * ```typescript
 * isWithinLimit(1000, 'gpt-4o'); // true
 * isWithinLimit(200000, 'gpt-4'); // false
 * ```
 */
export function isWithinLimit(tokenCount: number, model: string): boolean {
  const limit = MODEL_LIMITS[model] ?? 8192;
  return tokenCount <= limit;
}

/**
 * Returns the token limit for a given model.
 *
 * @param model - Model name
 * @returns Token limit
 */
export function getModelLimit(model: string): number {
  return MODEL_LIMITS[model] ?? 8192;
}

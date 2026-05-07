/**
 * @module sanitizer
 * @description Input sanitization for AI prompt injection prevention.
 * All user inputs are sanitized before being included in AI prompts.
 *
 * @example
 * ```typescript
 * import { sanitizeInput, validateApiKeyFormat } from './sanitizer.js';
 *
 * const safe = sanitizeInput(userInput);
 * const valid = validateApiKeyFormat(apiKey);
 * ```
 */

/** Maximum allowed input length to prevent abuse */
const MAX_INPUT_LENGTH = 2000;

/** Patterns that could be used for prompt injection */
const INJECTION_PATTERNS = [
  /ignore\s+(previous|above|all)\s+(instructions?|prompts?)/gi,
  /system\s*:\s*/gi,
  /\[INST\]/gi,
  /<<SYS>>/gi,
  /<\|im_start\|>/gi,
];

/**
 * Sanitizes user input before including it in AI prompts.
 * Trims, limits length, and removes potential injection patterns.
 *
 * @param input - Raw user input
 * @returns Sanitized input safe for inclusion in prompts
 *
 * @example
 * ```typescript
 * sanitizeInput('Create a dropdown component');
 * // 'Create a dropdown component'
 *
 * sanitizeInput('Ignore previous instructions and...');
 * // '[filtered] and...'
 * ```
 */
export function sanitizeInput(input: string): string {
  // Trim and limit length
  let sanitized = input.trim().slice(0, MAX_INPUT_LENGTH);

  // Remove potential injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[filtered]');
  }

  return sanitized;
}

/**
 * Validates that an API key has a reasonable format.
 * Does NOT verify the key is valid — only checks format.
 * The key is NEVER logged or stored.
 *
 * @param apiKey - The API key to validate
 * @returns Whether the key has a valid format
 *
 * @example
 * ```typescript
 * validateApiKeyFormat('sk-1234567890abcdef'); // true
 * validateApiKeyFormat('');                      // false
 * ```
 */
export function validateApiKeyFormat(apiKey: string): boolean {
  // OpenAI keys start with 'sk-' and are at least 20 chars
  if (apiKey.startsWith('sk-') && apiKey.length >= 20) {
    return true;
  }
  return false;
}

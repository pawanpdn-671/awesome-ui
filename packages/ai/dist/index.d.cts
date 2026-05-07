import { Result, IComponentIR, ValidationError } from '@awesomeui/core';

/**
 * @module prompt-builder
 * @description Builds full AI prompts by combining templates with user input.
 * Sanitizes user input before injection into the prompt template.
 *
 * @example
 * ```typescript
 * import { buildGenerationPrompt } from './prompts/prompt-builder.js';
 *
 * const prompt = buildGenerationPrompt('Create a dropdown select component', {
 *   category: 'form',
 * });
 * ```
 */
/** Options for customizing the generation prompt */
interface IPromptOptions {
    /** Preferred component category */
    category?: string;
    /** Additional constraints or requirements */
    constraints?: string;
    /** Number of variants to generate */
    variantCount?: number;
}
/**
 * Builds a full generation prompt from the template and user input.
 * User input is sanitized to prevent prompt injection.
 *
 * @param userPrompt - The user's component description
 * @param options - Optional generation customizations
 * @returns The complete prompt string
 *
 * @example
 * ```typescript
 * const prompt = buildGenerationPrompt('A modal dialog with title, body, and footer slots');
 * // Returns full prompt with schema reference + sanitized user input
 * ```
 */
declare function buildGenerationPrompt(userPrompt: string, options?: IPromptOptions): string;

/**
 * @module generator
 * @description AI-powered component IR generation using OpenAI.
 * Streams responses with progress callbacks and validates output against the IR schema.
 *
 * @example
 * ```typescript
 * import { generateComponentIR } from '@awesomeui/ai';
 *
 * const result = await generateComponentIR('A toggle switch component', {
 *   apiKey: process.env.OPENAI_API_KEY!,
 *   onProgress: (chunk) => process.stdout.write(chunk),
 * });
 * ```
 */

/** Options for AI component generation */
interface IGenerateOptions {
    /** OpenAI API key (never stored or logged) */
    apiKey: string;
    /** Model to use (default: gpt-4o) */
    model?: string;
    /** Streaming progress callback */
    onProgress?: (chunk: string) => void;
    /** Generation prompt customizations */
    promptOptions?: IPromptOptions;
    /** Timeout in ms (default: 30000) */
    timeoutMs?: number;
}
/**
 * Generates a component IR definition from a natural language description.
 * Uses OpenAI API with streaming and validates the output against the IR schema.
 *
 * **Security:**
 * - API key is never stored or logged
 * - User input is sanitized before prompt injection
 * - Output is validated against the schema before returning
 * - 30s timeout by default (configurable)
 *
 * @param description - Natural language description of the component
 * @param options - Generation options including API key
 * @returns Result with the validated IComponentIR or an error
 *
 * @example
 * ```typescript
 * const result = await generateComponentIR(
 *   'A star rating component with 1-5 stars, hover effects, and half-star support',
 *   {
 *     apiKey: 'sk-...',
 *     onProgress: (chunk) => process.stdout.write(chunk),
 *   }
 * );
 *
 * if (isOk(result)) {
 *   console.log(result.data.name); // e.g., 'star-rating'
 * }
 * ```
 */
declare function generateComponentIR(description: string, options: IGenerateOptions): Promise<Result<IComponentIR, ValidationError>>;

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
declare function sanitizeInput(input: string): string;
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
declare function validateApiKeyFormat(apiKey: string): boolean;

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
declare function countTokens(text: string): number;
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
declare function isWithinLimit(tokenCount: number, model: string): boolean;
/**
 * Returns the token limit for a given model.
 *
 * @param model - Model name
 * @returns Token limit
 */
declare function getModelLimit(model: string): number;

export { type IGenerateOptions, type IPromptOptions, buildGenerationPrompt, countTokens, generateComponentIR, getModelLimit, isWithinLimit, sanitizeInput, validateApiKeyFormat };

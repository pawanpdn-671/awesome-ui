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

import OpenAI from 'openai';
import {
  validateComponentIR,
  isOk,
  ok,
  err,
  type Result,
  type IComponentIR,
  ValidationError,
} from '@awesomeui/core';
import { buildGenerationPrompt, type IPromptOptions } from './prompts/prompt-builder.js';
import { validateApiKeyFormat } from './sanitizer.js';
import { countTokens, isWithinLimit } from './token-counter.js';

/** AI generation timeout in milliseconds (workspace rule: 30s) */
const GENERATION_TIMEOUT_MS = 30_000;

/** Default model to use */
const DEFAULT_MODEL = 'gpt-4o';

/** Options for AI component generation */
export interface IGenerateOptions {
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
export async function generateComponentIR(
  description: string,
  options: IGenerateOptions
): Promise<Result<IComponentIR, ValidationError>> {
  // Validate API key format
  if (!validateApiKeyFormat(options.apiKey)) {
    return err(
      new ValidationError('Invalid API key format', [
        { path: 'apiKey', message: 'API key must start with "sk-" and be at least 20 characters', code: 'invalid_format' },
      ])
    );
  }

  const model = options.model ?? DEFAULT_MODEL;
  const timeoutMs = options.timeoutMs ?? GENERATION_TIMEOUT_MS;

  // Build prompt
  const prompt = buildGenerationPrompt(description, options.promptOptions);

  // Check token limits
  const promptTokens = countTokens(prompt);
  if (!isWithinLimit(promptTokens, model)) {
    return err(
      new ValidationError('Prompt exceeds model token limit', [
        { path: 'prompt', message: `Estimated ${promptTokens} tokens exceeds ${model} limit`, code: 'token_limit' },
      ])
    );
  }

  // Create OpenAI client
  const client = new OpenAI({ apiKey: options.apiKey });

  try {
    // Stream the response
    const stream = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'You are a component designer that outputs only valid JSON.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      stream: true,
    });

    let fullResponse = '';
    const startTime = Date.now();

    for await (const chunk of stream) {
      // Check timeout
      if (Date.now() - startTime > timeoutMs) {
        return err(
          new ValidationError(`Generation timed out after ${timeoutMs}ms`, [
            { path: 'timeout', message: 'AI generation exceeded time limit', code: 'timeout' },
          ])
        );
      }

      const delta = chunk.choices[0]?.delta?.content ?? '';
      fullResponse += delta;

      // Stream progress callback
      if (options.onProgress && delta) {
        options.onProgress(delta);
      }
    }

    // Parse JSON from response
    const jsonStr = extractJSON(fullResponse);
    if (!jsonStr) {
      return err(
        new ValidationError('Failed to extract valid JSON from AI response', [
          { path: 'response', message: 'AI output did not contain valid JSON', code: 'parse_error' },
        ])
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      return err(
        new ValidationError('AI output is not valid JSON', [
          { path: 'response', message: 'JSON.parse failed on AI output', code: 'parse_error' },
        ])
      );
    }

    // Validate against ComponentIR schema
    const validationResult = validateComponentIR(parsed);
    if (isOk(validationResult)) {
      return ok(validationResult.data);
    }

    return validationResult;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown AI generation error';
    return err(
      new ValidationError(`AI generation failed: ${message}`, [
        { path: 'api', message, code: 'api_error' },
      ])
    );
  }
}

/**
 * Extracts JSON from an AI response that may contain markdown fences or extra text.
 *
 * @param text - Raw AI response text
 * @returns Extracted JSON string or null
 */
function extractJSON(text: string): string | null {
  // Try parsing directly first
  const trimmed = text.trim();
  if (trimmed.startsWith('{')) {
    // Find the matching closing brace
    let depth = 0;
    for (let i = 0; i < trimmed.length; i++) {
      if (trimmed[i] === '{') depth++;
      if (trimmed[i] === '}') depth--;
      if (depth === 0) {
        return trimmed.slice(0, i + 1);
      }
    }
  }

  // Try extracting from markdown code fences
  const fenceMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch?.[1]) {
    return fenceMatch[1].trim();
  }

  // Try finding JSON in the text
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }

  return null;
}

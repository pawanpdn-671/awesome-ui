/**
 * @module @awesomeui/ai
 * @description AI-powered component generation for AwesomeUI.
 * Uses OpenAI to generate component IR from natural language descriptions.
 */

export { generateComponentIR, type IGenerateOptions } from './generator.js';
export { buildGenerationPrompt, type IPromptOptions } from './prompts/prompt-builder.js';
export { sanitizeInput, validateApiKeyFormat } from './sanitizer.js';
export { countTokens, isWithinLimit, getModelLimit } from './token-counter.js';

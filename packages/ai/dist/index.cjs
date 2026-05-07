'use strict';

var OpenAI = require('openai');
var core = require('@awesomeui/core');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var OpenAI__default = /*#__PURE__*/_interopDefault(OpenAI);

// src/generator.ts

// src/sanitizer.ts
var MAX_INPUT_LENGTH = 2e3;
var INJECTION_PATTERNS = [
  /ignore\s+(previous|above|all)\s+(instructions?|prompts?)/gi,
  /system\s*:\s*/gi,
  /\[INST\]/gi,
  /<<SYS>>/gi,
  /<\|im_start\|>/gi
];
function sanitizeInput(input) {
  let sanitized = input.trim().slice(0, MAX_INPUT_LENGTH);
  for (const pattern of INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, "[filtered]");
  }
  return sanitized;
}
function validateApiKeyFormat(apiKey) {
  if (apiKey.startsWith("sk-") && apiKey.length >= 20) {
    return true;
  }
  return false;
}

// src/prompts/prompt-builder.ts
var PROMPT_TEMPLATE = `You are an expert UI component designer. Generate a component definition in AwesomeUI IR (Intermediate Representation) JSON format.

## Rules

1. Output ONLY valid JSON \u2014 no markdown, no explanation, no code fences.
2. The JSON must validate against the AwesomeUI ComponentIR schema.
3. Component name must be kebab-case.
4. Version should be "1.0.0".
5. Include meaningful props with types, defaults, and descriptions.
6. Use Tailwind CSS utility classes for all styles.
7. Include accessibility metadata (role, aria attributes, keyboard interactions).
8. Include at least a "default" slot for content projection.
9. Props with type "enum" MUST include a "values" array.

## Schema Reference

{
  "name": string (kebab-case),
  "version": "1.0.0",
  "description": string,
  "category": "primitive" | "form" | "layout" | "navigation" | "feedback" | "data-display" | "overlay" | "utility",
  "props": { [name]: { "type": "string"|"number"|"boolean"|"enum"|"object"|"array", "default"?: any, "required"?: boolean, "description": string, "values"?: string[] } },
  "slots": { [name]: { "description": string } },
  "events": { [name]: { "description": string } },
  "template": TemplateNode,
  "styles": { "base": string, [variantGroup]: { [value]: string } },
  "accessibility": { "role": string, "ariaAttributes": { [attr]: "{{expression}}" }, "keyboardInteractions": string[] }
}

TemplateNode types:
- Element: { "tag": string, "class"?: "{{expr}}", "attributes"?: {}, "children"?: TemplateNode[] }
- Text: { "text": "{{expr}}" }
- Slot: { "slot": string, "fallback"?: string }
- Conditional: { "if": string, "then": TemplateNode, "else"?: TemplateNode }
- Loop: { "each": string, "as": string, "key"?: string, "children": TemplateNode[] }

Expression syntax: {{props.name}}, {{styles.base}}, {{styles.variant[props.variant]}}

## User Request

Generate the following component:

{{USER_PROMPT}}`;
function buildGenerationPrompt(userPrompt, options) {
  const sanitized = sanitizeInput(userPrompt);
  let enrichedPrompt = sanitized;
  if (options?.category) {
    enrichedPrompt += `

Preferred category: ${sanitizeInput(options.category)}`;
  }
  if (options?.constraints) {
    enrichedPrompt += `

Additional requirements: ${sanitizeInput(options.constraints)}`;
  }
  if (options?.variantCount) {
    enrichedPrompt += `

Include at least ${options.variantCount} visual variants.`;
  }
  return PROMPT_TEMPLATE.replace("{{USER_PROMPT}}", enrichedPrompt);
}

// src/token-counter.ts
function countTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 3.5);
}
var MODEL_LIMITS = {
  "gpt-4o": 128e3,
  "gpt-4o-mini": 128e3,
  "gpt-4-turbo": 128e3,
  "gpt-4": 8192,
  "gpt-3.5-turbo": 16384
};
function isWithinLimit(tokenCount, model) {
  const limit = MODEL_LIMITS[model] ?? 8192;
  return tokenCount <= limit;
}
function getModelLimit(model) {
  return MODEL_LIMITS[model] ?? 8192;
}

// src/generator.ts
var GENERATION_TIMEOUT_MS = 3e4;
var DEFAULT_MODEL = "gpt-4o";
async function generateComponentIR(description, options) {
  if (!validateApiKeyFormat(options.apiKey)) {
    return core.err(
      new core.ValidationError("Invalid API key format", [
        { path: "apiKey", message: 'API key must start with "sk-" and be at least 20 characters', code: "invalid_format" }
      ])
    );
  }
  const model = options.model ?? DEFAULT_MODEL;
  const timeoutMs = options.timeoutMs ?? GENERATION_TIMEOUT_MS;
  const prompt = buildGenerationPrompt(description, options.promptOptions);
  const promptTokens = countTokens(prompt);
  if (!isWithinLimit(promptTokens, model)) {
    return core.err(
      new core.ValidationError("Prompt exceeds model token limit", [
        { path: "prompt", message: `Estimated ${promptTokens} tokens exceeds ${model} limit`, code: "token_limit" }
      ])
    );
  }
  const client = new OpenAI__default.default({ apiKey: options.apiKey });
  try {
    const stream = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are a component designer that outputs only valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4096,
      stream: true
    });
    let fullResponse = "";
    const startTime = Date.now();
    for await (const chunk of stream) {
      if (Date.now() - startTime > timeoutMs) {
        return core.err(
          new core.ValidationError(`Generation timed out after ${timeoutMs}ms`, [
            { path: "timeout", message: "AI generation exceeded time limit", code: "timeout" }
          ])
        );
      }
      const delta = chunk.choices[0]?.delta?.content ?? "";
      fullResponse += delta;
      if (options.onProgress && delta) {
        options.onProgress(delta);
      }
    }
    const jsonStr = extractJSON(fullResponse);
    if (!jsonStr) {
      return core.err(
        new core.ValidationError("Failed to extract valid JSON from AI response", [
          { path: "response", message: "AI output did not contain valid JSON", code: "parse_error" }
        ])
      );
    }
    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      return core.err(
        new core.ValidationError("AI output is not valid JSON", [
          { path: "response", message: "JSON.parse failed on AI output", code: "parse_error" }
        ])
      );
    }
    const validationResult = core.validateComponentIR(parsed);
    if (core.isOk(validationResult)) {
      return core.ok(validationResult.data);
    }
    return validationResult;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown AI generation error";
    return core.err(
      new core.ValidationError(`AI generation failed: ${message}`, [
        { path: "api", message, code: "api_error" }
      ])
    );
  }
}
function extractJSON(text) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{")) {
    let depth = 0;
    for (let i = 0; i < trimmed.length; i++) {
      if (trimmed[i] === "{") depth++;
      if (trimmed[i] === "}") depth--;
      if (depth === 0) {
        return trimmed.slice(0, i + 1);
      }
    }
  }
  const fenceMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch?.[1]) {
    return fenceMatch[1].trim();
  }
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  return null;
}

exports.buildGenerationPrompt = buildGenerationPrompt;
exports.countTokens = countTokens;
exports.generateComponentIR = generateComponentIR;
exports.getModelLimit = getModelLimit;
exports.isWithinLimit = isWithinLimit;
exports.sanitizeInput = sanitizeInput;
exports.validateApiKeyFormat = validateApiKeyFormat;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map
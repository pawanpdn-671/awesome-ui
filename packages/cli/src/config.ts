/**
 * @module config
 * @description Reads and writes `awesomeui.config.json` project configuration files.
 *
 * @example
 * ```typescript
 * import { readConfig, writeConfig } from './config.js';
 *
 * const config = await readConfig('/path/to/project');
 * ```
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ok, err, type Result, ValidationError } from '@awesomeui/core';
import { z } from 'zod';

/** The config file name */
const CONFIG_FILENAME = 'awesomeui.config.json';

/** Zod schema for the config file */
const ConfigSchema = z.object({
  /** Target framework */
  framework: z.enum(['react', 'vue', 'svelte', 'angular', 'solid', 'angularjs', 'react-native']),
  /** Style adapter */
  style: z.enum(['tailwind', 'css', 'css-in-js', 'panda']).default('tailwind'),
  /** Output directory for generated components */
  outputDir: z.string().default('./src/components/ui'),
  /** TypeScript enabled */
  typescript: z.boolean().default(true),
  /** List of installed component names */
  components: z.array(z.string()).default([]),
});

/** Configuration type */
export type IConfig = z.infer<typeof ConfigSchema>;

/** Default configuration */
const DEFAULT_CONFIG: IConfig = {
  framework: 'react',
  style: 'tailwind',
  outputDir: './src/components/ui',
  typescript: true,
  components: [],
};

/**
 * Reads the `awesomeui.config.json` file from a directory.
 * Returns a default config if the file doesn't exist.
 *
 * @param cwd - Working directory to search from
 * @returns Result with parsed config or validation error
 */
export async function readConfig(cwd: string): Promise<Result<IConfig, ValidationError>> {
  const configPath = join(cwd, CONFIG_FILENAME);

  try {
    const content = await readFile(configPath, 'utf-8');
    const parsed = JSON.parse(content) as unknown;
    const result = ConfigSchema.safeParse(parsed);

    if (result.success) {
      return ok(result.data);
    }

    return err(
      new ValidationError('Invalid awesomeui.config.json', result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      })))
    );
  } catch {
    // Config file doesn't exist — return defaults
    return ok(DEFAULT_CONFIG);
  }
}

/**
 * Writes an `awesomeui.config.json` file.
 *
 * @param cwd - Directory to write to
 * @param config - Config data to write
 */
export async function writeConfig(cwd: string, config: IConfig): Promise<void> {
  const configPath = join(cwd, CONFIG_FILENAME);
  await writeFile(configPath, JSON.stringify(config, null, 2) + '\n', 'utf-8');
}

/**
 * Returns the default config (used by the `init` command).
 */
export function getDefaultConfig(): IConfig {
  return { ...DEFAULT_CONFIG };
}

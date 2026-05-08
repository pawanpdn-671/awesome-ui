/**
 * @module commands/add
 * @description The `awesomeui add <component>` command.
 * Loads a component IR from the registry, transpiles it to the target framework,
 * and writes the generated file to the output directory.
 *
 * @example
 * ```bash
 * awesomeui add button --framework react
 * awesomeui add badge --framework vue --output ./src/components
 * ```
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { isOk } from '@awesomeui/core';
import { ReactTranspiler } from '@awesomeui/transpiler-react';
import { VueTranspiler } from '@awesomeui/transpiler-vue';
import { AngularJSTranspiler } from '@awesomeui/transpiler-angularjs';
import { ReactNativeTranspiler } from '@awesomeui/transpiler-react-native';
import { SvelteTranspiler } from '@awesomeui/transpiler-svelte';
import { SolidTranspiler } from '@awesomeui/transpiler-solid';
import { getComponent } from '../registry.js';
import { readConfig, writeConfig } from '../config.js';

/**
 * Creates the `add` command for Commander.
 *
 * @example
 * ```typescript
 * program.addCommand(createAddCommand());
 * ```
 */
export function createAddCommand(): Command {
  const cmd = new Command('add')
    .description('Add a component to your project')
    .argument('<component>', 'Component name (e.g., button, badge, input)')
    .option('-f, --framework <framework>', 'Target framework (react, vue)', '')
    .option('-o, --output <dir>', 'Output directory', '')
    .option('-s, --style <style>', 'Style adapter (tailwind, css)', 'tailwind')
    .action(async (componentName: string, options: Record<string, string>) => {
      const spinner = ora();

      try {
        // Read project config
        const cwd = process.cwd();
        const configResult = await readConfig(cwd);
        const config = isOk(configResult) ? configResult.data : null;

        // Determine framework
        const framework = options['framework'] || config?.framework || '';
        if (!framework) {
          console.error(
            chalk.red('✗ No framework specified. Use --framework or run `awesomeui init` first.')
          );
          process.exit(1);
        }

        // Determine output dir
        const outputDir = options['output'] || config?.outputDir || './src/components/ui';
        const resolvedOutput = resolve(cwd, outputDir);

        // Load component
        spinner.start(`Loading component ${chalk.cyan(componentName)}...`);
        const componentResult = getComponent(componentName);

        if (!isOk(componentResult)) {
          spinner.fail(chalk.red(`Component "${componentName}" not found`));
          console.error(chalk.gray(componentResult.error.formatErrors()));
          process.exit(1);
        }

        const ir = componentResult.data;
        spinner.succeed(`Loaded ${chalk.cyan(ir.name)} v${ir.version}`);

        // Transpile
        spinner.start(`Transpiling to ${chalk.yellow(framework)}...`);

        const transpiler = createTranspiler(framework);
        if (!transpiler) {
          spinner.fail(chalk.red(`Unsupported framework: ${framework}`));
          console.error(chalk.gray(`Supported: react, vue, angularjs, react-native, svelte, solid`));
          process.exit(1);
        }

        const transpileResult = transpiler.transpile(ir, {
          styleAdapter: (options['style'] as 'tailwind' | 'css') ?? 'tailwind',
          typescript: config?.typescript ?? true,
        });

        if (!isOk(transpileResult)) {
          spinner.fail(chalk.red('Transpilation failed'));
          console.error(chalk.gray(transpileResult.error.formatErrors()));
          process.exit(1);
        }

        const output = transpileResult.data;
        spinner.succeed(`Transpiled to ${chalk.yellow(output.framework)}`);

        // Write file
        spinner.start('Writing component file...');
        await mkdir(resolvedOutput, { recursive: true });
        const filePath = join(resolvedOutput, output.filename);
        await writeFile(filePath, output.code, 'utf-8');

        // Update config with installed component
        if (config) {
          if (!config.components.includes(componentName)) {
            config.components.push(componentName);
            await writeConfig(cwd, config);
          }
        }

        spinner.succeed(chalk.green(`✓ ${output.filename}`));
        console.log(chalk.gray(`  → ${filePath}`));

        // Install npm dependencies if any
        const npmDeps = ir.npmDependencies;
        if (npmDeps && npmDeps.length > 0) {
          const depsToInstall = npmDeps
            .filter((d) => !d.dev)
            .map((d) => (d.version ? `${d.name}@${d.version}` : d.name));
          const devDepsToInstall = npmDeps
            .filter((d) => d.dev)
            .map((d) => (d.version ? `${d.name}@${d.version}` : d.name));

          if (depsToInstall.length > 0) {
            spinner.start('Installing npm dependencies...');
            try {
              execSync(`npm install ${depsToInstall.join(' ')}`, { cwd, stdio: 'ignore' });
              spinner.succeed(chalk.green('Installed npm dependencies'));
            } catch {
              spinner.warn(chalk.yellow(`Could not auto-install deps. Run: npm install ${depsToInstall.join(' ')}`));
            }
          }

          if (devDepsToInstall.length > 0) {
            spinner.start('Installing npm dev dependencies...');
            try {
              execSync(`npm install --save-dev ${devDepsToInstall.join(' ')}`, { cwd, stdio: 'ignore' });
              spinner.succeed(chalk.green('Installed npm dev dependencies'));
            } catch {
              spinner.warn(chalk.yellow(`Could not auto-install devDeps. Run: npm install --save-dev ${devDepsToInstall.join(' ')}`));
            }
          }
        }

        console.log();
      } catch (error) {
        spinner.fail(chalk.red('Failed to add component'));
        if (error instanceof Error) {
          console.error(chalk.gray(error.message));
        }
        process.exit(1);
      }
    });

  return cmd;
}

/**
 * Factory function to create the appropriate transpiler for a framework.
 */
function createTranspiler(framework: string) {
  switch (framework) {
    case 'react':
      return new ReactTranspiler();
    case 'vue':
      return new VueTranspiler();
    case 'angularjs':
      return new AngularJSTranspiler();
    case 'react-native':
      return new ReactNativeTranspiler();
    case 'svelte':
      return new SvelteTranspiler();
    case 'solid':
      return new SolidTranspiler();
    default:
      return null;
  }
}

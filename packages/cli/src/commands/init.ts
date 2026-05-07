/**
 * @module commands/init
 * @description The `awesomeui init` command.
 * Interactively initializes an `awesomeui.config.json` file.
 *
 * @example
 * ```bash
 * awesomeui init
 * awesomeui init --framework react --style tailwind
 * ```
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { writeConfig, getDefaultConfig, type IConfig } from '../config.js';

/**
 * Creates the `init` command for Commander.
 */
export function createInitCommand(): Command {
  return new Command('init')
    .description('Initialize AwesomeUI configuration in your project')
    .option('-f, --framework <framework>', 'Target framework (react, vue)', 'react')
    .option('-s, --style <style>', 'Style adapter (tailwind, css, css-in-js, panda)', 'tailwind')
    .option('-o, --output <dir>', 'Output directory for components', './src/components/ui')
    .option('--no-typescript', 'Generate JavaScript instead of TypeScript')
    .action(async (options: Record<string, string | boolean>) => {
      const cwd = process.cwd();

      const config: IConfig = {
        ...getDefaultConfig(),
        framework: (options['framework'] as IConfig['framework']) ?? 'react',
        style: (options['style'] as IConfig['style']) ?? 'tailwind',
        outputDir: (options['output'] as string) ?? './src/components/ui',
        typescript: options['typescript'] !== false,
      };

      try {
        await writeConfig(cwd, config);

        console.log();
        console.log(chalk.green('  ✓ Created awesomeui.config.json'));
        console.log();
        console.log(chalk.gray('  Configuration:'));
        console.log(`    Framework:  ${chalk.cyan(config.framework)}`);
        console.log(`    Style:      ${chalk.yellow(config.style)}`);
        console.log(`    Output:     ${chalk.white(config.outputDir)}`);
        console.log(`    TypeScript: ${config.typescript ? chalk.green('yes') : chalk.red('no')}`);
        console.log();
        console.log(chalk.gray(`  Next steps:`));
        console.log(chalk.gray(`    Run ${chalk.white('awesomeui add button')} to add your first component`));
        console.log();
      } catch (error) {
        console.error(chalk.red('  ✗ Failed to create config file'));
        if (error instanceof Error) {
          console.error(chalk.gray(`    ${error.message}`));
        }
        process.exit(1);
      }
    });
}

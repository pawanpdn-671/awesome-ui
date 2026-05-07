/**
 * @module commands/list
 * @description The `awesomeui list` command.
 * Displays all available components in a formatted table.
 *
 * @example
 * ```bash
 * awesomeui list
 * ```
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { listComponents } from '../registry.js';

/**
 * Creates the `list` command for Commander.
 */
export function createListCommand(): Command {
  return new Command('list')
    .description('List all available components')
    .action(() => {
      const components = listComponents();

      console.log();
      console.log(chalk.bold('  Available Components'));
      console.log(chalk.gray('  ─'.repeat(30)));
      console.log();

      // Column widths
      const nameWidth = 18;
      const versionWidth = 10;
      const categoryWidth = 14;

      // Header
      console.log(
        chalk.gray(
          `  ${'Name'.padEnd(nameWidth)}${'Version'.padEnd(versionWidth)}${'Category'.padEnd(categoryWidth)}Description`
        )
      );
      console.log(chalk.gray('  ' + '─'.repeat(80)));

      // Rows
      for (const component of components) {
        const name = chalk.cyan(component.name.padEnd(nameWidth));
        const version = chalk.gray(component.version.padEnd(versionWidth));
        const category = chalk.yellow(component.category.padEnd(categoryWidth));
        const desc = component.description;

        console.log(`  ${name}${version}${category}${desc}`);
      }

      console.log();
      console.log(chalk.gray(`  ${components.length} component(s) available`));
      console.log(chalk.gray(`  Run ${chalk.white('awesomeui add <name> --framework <react|vue>')} to add a component`));
      console.log();
    });
}

/**
 * @module @awesomeui/cli
 * @description CLI entry point for the AwesomeUI component platform.
 *
 * @example
 * ```bash
 * awesomeui add button --framework react
 * awesomeui list
 * awesomeui init --framework vue
 * ```
 */

import { Command } from 'commander';
import { createAddCommand } from './commands/add.js';
import { createListCommand } from './commands/list.js';
import { createInitCommand } from './commands/init.js';

const program = new Command()
  .name('awesomeui')
  .description('AwesomeUI — Cross-framework component platform')
  .version('0.1.0');

program.addCommand(createAddCommand());
program.addCommand(createListCommand());
program.addCommand(createInitCommand());

program.parse();

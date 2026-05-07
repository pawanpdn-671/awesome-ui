import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { writeConfig, getDefaultConfig, type IConfig } from '../config.js';

const UTILS_TS = `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

const UTILS_JS = `import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
`;

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

        const isTs = config.typescript;
        const utilsDir = resolve(cwd, 'src', 'lib');
        const utilsFile = join(utilsDir, isTs ? 'utils.ts' : 'utils.js');

        await mkdir(utilsDir, { recursive: true });
        await writeFile(utilsFile, isTs ? UTILS_TS : UTILS_JS, 'utf-8');

        console.log();
        console.log(chalk.green('  ✓ Created awesomeui.config.json'));
        console.log(chalk.green(`  ✓ Created ${isTs ? 'src/lib/utils.ts' : 'src/lib/utils.js'}`));

        console.log();
        console.log(chalk.gray('  Configuration:'));
        console.log(`    Framework:  ${chalk.cyan(config.framework)}`);
        console.log(`    Style:      ${chalk.yellow(config.style)}`);
        console.log(`    Output:     ${chalk.white(config.outputDir)}`);
        console.log(`    TypeScript: ${config.typescript ? chalk.green('yes') : chalk.red('no')}`);
        console.log();

        const spinner = ora('Installing clsx and tailwind-merge...').start();
        try {
          execSync('npm install clsx tailwind-merge', { cwd, stdio: 'ignore' });
          spinner.succeed(chalk.green('Installed clsx and tailwind-merge'));
        } catch {
          spinner.warn(chalk.yellow('Could not auto-install dependencies. Run: npm install clsx tailwind-merge'));
        }

        console.log();
        console.log(chalk.gray('  Next steps:'));
        console.log(chalk.gray(`    1. Make sure your project has a path alias from ${chalk.white('@')} to ${chalk.white('./src')}`));
        console.log(chalk.gray(`       (e.g., in tsconfig.json: ${chalk.white('"paths": { "@/*": ["./src/*"] }')})`));
        console.log(chalk.gray(`    2. Run ${chalk.white('awesomeui add button')} to add your first component`));
        console.log();
      } catch (error) {
        console.error(chalk.red('  ✗ Failed to initialize'));
        if (error instanceof Error) {
          console.error(chalk.gray(`    ${error.message}`));
        }
        process.exit(1);
      }
    });
}

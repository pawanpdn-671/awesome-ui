import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
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

/**
 * Detects and patches vite.config with @ path alias if missing.
 */
async function setupViteAlias(cwd: string): Promise<boolean> {
  const viteFiles = ['vite.config.ts', 'vite.config.js', 'vite.config.mjs'];
  let viteFile: string | null = null;

  for (const file of viteFiles) {
    if (existsSync(join(cwd, file))) {
      viteFile = file;
      break;
    }
  }

  if (!viteFile) return false;

  const configPath = join(cwd, viteFile);
  let content = await readFile(configPath, 'utf-8');

  // Already has @ alias in resolve — skip
  if (content.includes("'@'") || content.includes('"@"')) {
    if (content.includes('resolve')) return false;
  }

  // Already has a resolve block — can't safely merge, skip
  if (content.includes('resolve:')) return false;

  // Add path import if missing
  if (!content.includes("from 'path'") && !content.includes('from "path"')) {
    content = content.replace(
      /^(import .+)$/m,
      "import path from 'path';\n$1"
    );
  }

  // Insert resolve.alias before closing of defineConfig(...)
  const aliasBlock = `,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },`;

  // Match end of defineConfig: `});` or `})` or `})` with possible trailing content
  content = content.replace(/(\n\}\);?)$/, `${aliasBlock}\n});`);

  await writeFile(configPath, content, 'utf-8');
  return true;
}

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

        // Auto-configure path alias for @/* in build config
        const viteAlias = await setupViteAlias(cwd);

        // Auto-configure path alias for @/*
        const aliasConfigFile = isTs ? 'tsconfig.json' : 'jsconfig.json';
        const aliasConfigPath = join(cwd, aliasConfigFile);
        let aliasConfigured = false;

        try {
          const existing = await readFile(aliasConfigPath, 'utf-8');
          const parsed = JSON.parse(existing);
          if (parsed?.compilerOptions?.paths?.['@/*']) {
            aliasConfigured = true;
          }
        } catch {
          // Config file doesn't exist — create it for JS projects
          if (!isTs) {
            const jsConfig = {
              compilerOptions: {
                baseUrl: '.',
                paths: { '@/*': ['./src/*'] },
              },
            };
            await writeFile(aliasConfigPath, JSON.stringify(jsConfig, null, 2) + '\n', 'utf-8');
            aliasConfigured = true;
          }
        }

        console.log();
        console.log(chalk.green('  ✓ Created awesomeui.config.json'));
        console.log(chalk.green(`  ✓ Created ${isTs ? 'src/lib/utils.ts' : 'src/lib/utils.js'}`));
        if (aliasConfigured && !isTs) {
          console.log(chalk.green(`  ✓ Created ${aliasConfigFile} with @ path alias`));
        }
        if (viteAlias) {
          console.log(chalk.green('  ✓ Updated vite config with @ path alias'));
        }

        console.log();
        console.log(chalk.gray('  Configuration:'));
        console.log(`    Framework:  ${chalk.cyan(config.framework)}`);
        console.log(`    Style:      ${chalk.yellow(config.style)}`);
        console.log(`    Output:     ${chalk.white(config.outputDir)}`);
        console.log(`    TypeScript: ${config.typescript ? chalk.green('yes') : chalk.red('no')}`);
        console.log();

        if (!aliasConfigured && !viteAlias) {
          console.log(chalk.yellow(`  ⚠ Path alias '@/*' not found in project config`));
          console.log(chalk.gray(`    See https://vite.dev/config/shared-options.html#resolve-alias`));
          console.log();
        }

        const spinner = ora('Installing clsx and tailwind-merge...').start();
        try {
          execSync('npm install clsx tailwind-merge', { cwd, stdio: 'ignore' });
          spinner.succeed(chalk.green('Installed clsx and tailwind-merge'));
        } catch {
          spinner.warn(chalk.yellow('Could not auto-install dependencies. Run: npm install clsx tailwind-merge'));
        }

        console.log();
        console.log(chalk.gray('  Next step:'));
        console.log(chalk.gray(`    Run ${chalk.white('awesomeui add button')} to add your first component`));
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

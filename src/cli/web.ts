#!/usr/bin/env node

import { spawn } from 'child_process';
import * as path from 'path';
import chalk from 'chalk';

// Get the project root directory
// When compiled, this will be in dist/cli/web.js, so project root is ../..
// When running from source, we need to handle both cases
const projectRoot = path.resolve(__dirname, '../..');

console.log(chalk.cyan.bold('🛫 Starting FlightBoard Web UI...'));
console.log(chalk.gray(`Project root: ${projectRoot}`));

// Start Next.js dev server
const nextProcess = spawn('npx', ['next', 'dev', '--turbopack'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

nextProcess.on('error', (err) => {
  console.error(chalk.red('Failed to start FlightBoard Web UI:'), err);
  process.exit(1);
});

nextProcess.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(chalk.red(`FlightBoard Web UI exited with code ${code}`));
    process.exit(code);
  }
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n👋 Shutting down FlightBoard Web UI...'));
  nextProcess.kill('SIGINT');
});
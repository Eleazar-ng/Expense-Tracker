#!/usr/bin/env node
import { Command } from 'commander';
import { addExpense } from './tracker_operations.js';

// Main CLI 
const program = new Command()

program
  .name('Expense-tracker')
  .description('A simple CLI to manage your finances')
  .version('1.0.0');

// Add Command
program
  .command('add')
  .description('add an expense')
  .requiredOption('--description <description>', 'Expense description')
  .requiredOption('--amount <amount>', 'Expense amount')
  .action((options) => {
    addExpense(options.description, options.amount)
  });

// Handle unknown commands
program.on('command:*', () => {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
});

// Parse arguments
program.parse();

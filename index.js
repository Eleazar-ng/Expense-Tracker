#!/usr/bin/env node

import { Command } from 'commander';
import { addExpense, deleteExpense, updateExpense } from './tracker_operations.js';

// Main CLI 
const program = new Command()

program
  .name('Expense-tracker')
  .description('A simple CLI to manage your finances')
  .version('1.0.0');

// Add Command
program
  .command('add')
  .description('Add an expense')
  .requiredOption('--description <description>', 'Expense description')
  .requiredOption('--amount <amount>', 'Expense amount')
  .action((options) => {
    addExpense(options.description, options.amount)
  });

// Delete Command  
program
  .command('delete')
  .description('Delete an expense')
  .requiredOption('--id <id>', 'Expense ID')
  .action((options) => {
    deleteExpense(options.id)
  });

// Update Command  
program
  .command('update')
  .description('Update an expense')
  .requiredOption('--id <id>', 'Expense ID')
  .option('--description <description>', 'New expense description')
  .option('--amount <amount>', 'New expense amount')
  .action((options) => {
    if(!options.description && !options.amount){
      console.error('Either description or amount must provided to update an expense')
      process.exit(1)
    }
    updateExpense(options.id, options.description, options.amount)
  });


// Handle unknown commands
program.on('command:*', () => {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
});

// Parse arguments
program.parse();

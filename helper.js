
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Expense JSON File
const EXPENSE_FILE = path.join(__dirname, 'expenses.json');
const CURRENCY = '$';

function loadExpenses(){
  try {
    if (!fs.existsSync(EXPENSE_FILE)) {
      return [];
    }
    const data = fs.readFileSync(EXPENSE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading expenses:', error.message);
    return [];
  }
}

function isValidNumber(id){
  const isValidId = /^\d+$/.test(id);
	return isValidId
}

function isGreaterThanZero(amount){
  if(amount <= 0){
    return false
  }
  return true
}

function isValidDescription(description){
  if(!description || description.length == 0){
    return false
  }
  return true
}

function generateExpenseId(expenses){
  if (expenses.length === 0) return 1;
	return Math.max(...expenses.map(task => task.id)) + 1;
}

function formatCurrency(amount) {
  const parsedCurrency = parseInt(amount);
  return `${CURRENCY}${parsedCurrency}`;
}

function getCurrentDate(){
  return new Date().toISOString().split('T')[0];
}

function saveExpenses(expenses){
  try {
    fs.writeFileSync(EXPENSE_FILE, JSON.stringify(expenses, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving expenses:', error.message);
    return false;
  }
}

function isExistingId(id, expenses){
  const expenseIdExists = expenses.some(expense => expense.id === id);
  return expenseIdExists;
}

export {
  loadExpenses,
  isValidNumber,
  isGreaterThanZero,
  isValidDescription,
  generateExpenseId,
  formatCurrency,
  getCurrentDate,
  saveExpenses,
  isExistingId
}
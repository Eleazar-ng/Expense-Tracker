
import { formatCurrency, generateExpenseId, getCurrentDate, isGreaterThanZero, isValidAmount, isValidDescription, isValidNumber, loadExpenses, saveExpenses } from "./helper.js"

function addExpense(description, amount){
  const expenses = loadExpenses()
  const validDescription = isValidDescription(description);
  if(!validDescription){
    console.error(`${description} cannot be empty`);
    return
  }

  const validAmount = isValidAmount(amount);
  if(!validAmount){
    console.error(`${amount} is not a valid amount; Amount must be a number!`);
    return
  }

  const amountGreaterThanZero  = isGreaterThanZero(amount);
  if(!amountGreaterThanZero){
    console.error(`Amount must be greater than 0!`);
    return
  }

  try {
    const newExpenseId = generateExpenseId(expenses);
    const newExpense = {
      id: newExpenseId,
      description,
      amount: formatCurrency(amount),
      createdAt: getCurrentDate()
    }

    expenses.push(newExpense);

    if (saveExpenses(expenses)) {
      console.log(`Expense added successfully (ID: ${newExpenseId})`);
    } else {
      console.error('Failed to add expense');
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

export {
  addExpense
}
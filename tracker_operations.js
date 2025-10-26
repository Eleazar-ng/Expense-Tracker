
import { formatCurrency, generateExpenseId, getCurrentDate, isExistingId, isGreaterThanZero, isValidDescription, isValidNumber, loadExpenses, saveExpenses } from "./helper.js"

function addExpense(description, amount){
  const expenses = loadExpenses()
  const validDescription = isValidDescription(description);
  if(!validDescription){
    console.error(`${description} cannot be empty`);
    return
  }

  const validAmount = isValidNumber(amount);
  if(!validAmount){
    console.error(`${amount} is not a valid amount; Amount must be a number!`);
    return
  }

  const amountGreaterThanZero  = isGreaterThanZero(amount);
  if(!amountGreaterThanZero){
    console.error(`${amount} must be greater than 0!`);
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

function deleteExpense(id){
  const expenses = loadExpenses();
  const validId = isValidNumber(id);
  if(!validId){
    console.error(`${id} is not a valid ID`)
    return
  }
  const expenseId = parseInt(id);

  const existingId = isExistingId(expenseId, expenses)
  if(!existingId){
    console.error(`Expense with ID:${expenseId} does not exist`)
    return
  }

  const filteredExpenses = expenses.filter(expense => expense.id !== expenseId)

  if(saveExpenses(filteredExpenses)){
		console.log(`Expense deleted successfully`);
	} else {
		console.error('Failed to delete expense');
	}
}

export {
  addExpense,
  deleteExpense
}
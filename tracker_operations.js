
import { formatAmount, formatCurrency, generateExpenseId, getCurrentDate, getMonthFromDate, getMonthName, isExistingId, isGreaterThanZero, isValidDescription, isValidNumber, loadExpenses, saveExpenses, validateMonth } from "./helper.js"

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
      date: getCurrentDate()
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

function updateExpense(id, description, amount){
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

  try {
    const expenseIndex = expenses.findIndex(expense => expense.id === expenseId);
    if(description){
      expenses[expenseIndex].description = description;
    }
    if(amount){
      expenses[expenseIndex].amount = formatCurrency(amount);
    }

    expenses[expenseIndex].date = getCurrentDate();

    if(saveExpenses(expenses)){
      console.log(`Expense updated successfully (ID: ${id})`);
    } else {
      console.error('Failed to update expense');
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

function listExpense(){
  const expenses = loadExpenses();
  if(expenses.length === 0){
    console.log('No expenses were found');
    return
  }

  console.log('\n    ID   Date        Description     Amount');
  expenses.forEach((expense, index) => {
    console.log(`${index + 1}.  ${expense.id.toString().padEnd(4)} ${expense.date}  ${expense.description.padEnd(12)} ${expense.amount.padStart(8)}`);
  })
  return
}

function getSummary(month = null){
  const expenses = loadExpenses();
  if(expenses.length === 0){
    console.log('No expenses were found');
    return
  }

  let totalExpense = 0

  try {
    if(month){
      const validMonth = validateMonth(month);
      if(!validMonth){
        console.error(`${month} is not a valid month number. Month must be between 1 - 12`)
        return
      }

      const currentMonth = parseInt(month);
      const currentYear = new Date().getFullYear();
      const monthName = getMonthName(month)

      const filteredExpensesByMonth = expenses.filter((expense) => {
        let expenseMonth = getMonthFromDate(expense.date);
        return expenseMonth === currentMonth
      })

      if(filteredExpensesByMonth.length === 0){
        console.log(`No expenses were found for ${monthName}`);
        return
      }

      const filteredExpensesByCurrentYear = filteredExpensesByMonth.filter((expense) => {
        let expenseYear = new Date(expense.date).getFullYear();
        return expenseYear === currentYear;
      })

      if(filteredExpensesByCurrentYear.length === 0){
        console.log(`No expenses were found for ${monthName} ${currentYear}`);
        return
      }

      totalExpense = filteredExpensesByCurrentYear.reduce((sum, expense) => sum + formatAmount(expense.amount), 0)

      console.log(`Total expenses for ${monthName}: ${formatCurrency(totalExpense)}`);
      return
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

export {
  addExpense,
  deleteExpense,
  updateExpense,
  listExpense,
  getSummary
}
import { CATEGORIES } from "../utils/constants.js";

let expenseEditId = null;

export function handleExpenseSubmit(e, deps) {
  e.preventDefault();

  const { getExpenses, saveExpenses, renderExpenses, updateDashboard } = deps;

  const saveData = getExpenses();
  const title = document.querySelector("#expense-title").value;
  const amount = Number(document.querySelector("#expense-amount").value);
  const expenseCategory = document.querySelector("#expense-category").value;
  const date = document.querySelector("#expense-date").value;

  if (
    title.trim() === "" ||
    isNaN(amount) ||
    amount <= 0 ||
    !CATEGORIES.includes(expenseCategory)
  ) {
    return;
  }

  if (expenseEditId !== null) {
    const updatedExpense = saveData.map((item) => {
      if (item.id === expenseEditId) {
        return { ...item, title, amount };
      }
      return item;
    });

    saveExpenses(updatedExpense);
    expenseEditId = null;
  } else {
    const expense = {
      id: Date.now(),
      title,
      amount,
      expenseCategory,
      date,
    };

    saveData.push(expense);
    saveExpenses(saveData);
  }

  renderExpenses();
  updateDashboard();
  document.querySelector("#expense-form").reset();
}

export function handleExpenseClick(e, deps) {
  const { getExpenses, saveExpenses, renderExpenses, updateDashboard } = deps;

  if (e.target.classList.contains("edit")) {
    const id = Number(e.target.dataset.id);

    const item = getExpenses().find((el) => el.id === id);

    document.querySelector("#expense-title").value = item.title;
    document.querySelector("#expense-amount").value = item.amount;

    expenseEditId = id;
  }

  if (e.target.classList.contains("delete")) {
    const id = Number(e.target.dataset.id);

    const newExpenses = getExpenses().filter((item) => item.id !== id);

    saveExpenses(newExpenses);
    renderExpenses();
    updateDashboard();
  }
}

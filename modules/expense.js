import { CATEGORIES } from "../utils/constants.js";
import { getTodayDateValue } from "../utils/helpers.js";

let expenseEditId = null;

const expenseForm = document.querySelector("#expense-form");
const expenseTitleInput = document.querySelector("#expense-title");
const expenseAmountInput = document.querySelector("#expense-amount");
const expenseCategoryInput = document.querySelector("#expense-category");
const expenseDateInput = document.querySelector("#expense-date");
const expenseSubmitButton = expenseForm.querySelector('button[type="submit"]');

function setExpenseFormMode(isEditing) {
  expenseForm.dataset.mode = isEditing ? "editing" : "create";
  expenseSubmitButton.textContent = isEditing ? "Save Expense" : "Add Expense";
}

function resetExpenseForm() {
  expenseForm.reset();
  expenseDateInput.value = getTodayDateValue();
  expenseEditId = null;
  setExpenseFormMode(false);
}

export function initExpenseForm() {
  expenseDateInput.value = getTodayDateValue();
  setExpenseFormMode(false);
}

export function handleExpenseSubmit(e, deps) {
  e.preventDefault();

  const { getExpenses, saveExpenses, renderExpenses, updateDashboard } = deps;

  const saveData = getExpenses();
  const title = expenseTitleInput.value.trim();
  const amount = Number(expenseAmountInput.value);
  const expenseCategory = expenseCategoryInput.value;
  const date = expenseDateInput.value || getTodayDateValue();

  if (
    title === "" ||
    isNaN(amount) ||
    amount <= 0 ||
    !CATEGORIES.includes(expenseCategory)
  ) {
    return;
  }

  if (expenseEditId !== null) {
    const updatedExpense = saveData.map((item) => {
      if (item.id === expenseEditId) {
        return { ...item, title, amount, expenseCategory, date };
      }
      return item;
    });

    saveExpenses(updatedExpense);
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
  resetExpenseForm();
}

export function handleExpenseClick(e, deps) {
  const { getExpenses, saveExpenses, renderExpenses, updateDashboard } = deps;

  if (e.target.classList.contains("edit")) {
    const id = Number(e.target.dataset.id);

    const item = getExpenses().find((el) => el.id === id);

    if (!item) return;

    expenseTitleInput.value = item.title;
    expenseAmountInput.value = item.amount;
    expenseCategoryInput.value = item.expenseCategory;
    expenseDateInput.value = item.date || getTodayDateValue();

    expenseEditId = id;
    setExpenseFormMode(true);
  }

  if (e.target.classList.contains("delete")) {
    const id = Number(e.target.dataset.id);

    const newExpenses = getExpenses().filter((item) => item.id !== id);

    saveExpenses(newExpenses);
    renderExpenses();
    updateDashboard();

    if (expenseEditId === id) {
      resetExpenseForm();
    }
  }
}

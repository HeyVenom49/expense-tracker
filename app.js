import {
  getExpenses,
  saveExpenses,
  getSubscription,
  setSubscription,
  setBudget,
} from "./modules/storage.js";

import {
  renderExpenses,
  renderSubscriptions,
  updateBudgetUI,
  updateDashboard,
} from "./modules/ui.js";

import { handleExpenseSubmit, handleExpenseClick } from "./modules/expense.js";

import {
  handleSubscriptionSubmit,
  handleSubscriptionClick,
} from "./modules/subscription.js";

// ================= DOM SELECT =================

const expenseForm = document.querySelector("#expense-form");
const expenseList = document.querySelector("#expense-list");

const subscriptionForm = document.querySelector("#subscription-form");
const subscriptionList = document.querySelector("#subscription-list");

const budgetButton = document.querySelector("#set-budget-btn");

// ================= EXPENSE EVENTS =================

expenseForm.addEventListener("submit", (e) =>
  handleExpenseSubmit(e, {
    getExpenses,
    saveExpenses,
    renderExpenses,
    updateDashboard,
  }),
);

expenseList.addEventListener("click", (e) =>
  handleExpenseClick(e, {
    getExpenses,
    saveExpenses,
    renderExpenses,
    updateDashboard,
  }),
);

// ================= SUBSCRIPTION EVENTS =================

subscriptionForm.addEventListener("submit", (e) =>
  handleSubscriptionSubmit(e, {
    getSubscription,
    setSubscription,
    renderSubscriptions,
    updateDashboard,
  }),
);

subscriptionList.addEventListener("click", (e) =>
  handleSubscriptionClick(e, {
    getSubscription,
    setSubscription,
    renderSubscriptions,
    updateDashboard,
  }),
);

// ================= BUDGET =================

budgetButton.addEventListener("click", (e) => {
  e.preventDefault();

  const budgetInput = Number(document.querySelector("#budget-input").value);

  if (isNaN(budgetInput) || budgetInput <= 0) return;

  setBudget(budgetInput);
  updateBudgetUI();
  updateDashboard();

  document.querySelector("#budget-input").value = "";
});

// ================= INIT =================

renderExpenses();
renderSubscriptions();
updateBudgetUI();
updateDashboard();

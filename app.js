import {
  getExpenses,
  getSubscription,
  saveExpenses,
  setBudget,
  setSubscription,
} from "./modules/storage.js";

import {
  renderExpenses,
  renderSubscriptions,
  updateBudgetUI,
  updateDashboard,
} from "./modules/ui.js";

import {
  handleExpenseClick,
  handleExpenseSubmit,
  initExpenseForm,
} from "./modules/expense.js";

import {
  handleSubscriptionClick,
  handleSubscriptionSubmit,
  initSubscriptionForm,
} from "./modules/subscription.js";

import { renderAnalytics } from "./modules/analytics.js";

const expenseForm = document.querySelector("#expense-form");
const expenseList = document.querySelector("#expense-list");
const subscriptionForm = document.querySelector("#subscription-form");
const subscriptionList = document.querySelector("#subscription-list");
const budgetInput = document.querySelector("#budget-input");
const budgetButton = document.querySelector("#set-budget-btn");
const openAnalyticsButton = document.querySelector("#open-analytics");
const closeAnalyticsButton = document.querySelector("#close-analytics");
const analyticsOverlay = document.querySelector("#analytics-overlay");

function saveBudgetValue() {
  const budgetValue = Number(budgetInput.value);

  if (Number.isNaN(budgetValue) || budgetValue <= 0) {
    budgetInput.focus();
    return;
  }

  setBudget(budgetValue);
  updateBudgetUI();
  updateDashboard();
  budgetInput.value = "";
}

function openAnalytics() {
  analyticsOverlay.classList.remove("hidden");
  analyticsOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  renderAnalytics();
}

function closeAnalytics() {
  analyticsOverlay.classList.add("hidden");
  analyticsOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

expenseForm.addEventListener("submit", (event) =>
  handleExpenseSubmit(event, {
    getExpenses,
    saveExpenses,
    renderExpenses,
    updateDashboard,
  }),
);

expenseList.addEventListener("click", (event) =>
  handleExpenseClick(event, {
    getExpenses,
    saveExpenses,
    renderExpenses,
    updateDashboard,
  }),
);

subscriptionForm.addEventListener("submit", (event) =>
  handleSubscriptionSubmit(event, {
    getSubscription,
    setSubscription,
    renderSubscriptions,
    updateDashboard,
  }),
);

subscriptionList.addEventListener("click", (event) =>
  handleSubscriptionClick(event, {
    getSubscription,
    setSubscription,
    renderSubscriptions,
    updateDashboard,
  }),
);

budgetButton.addEventListener("click", (event) => {
  event.preventDefault();
  saveBudgetValue();
});

budgetInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;

  event.preventDefault();
  saveBudgetValue();
});

openAnalyticsButton.addEventListener("click", openAnalytics);
closeAnalyticsButton.addEventListener("click", closeAnalytics);

analyticsOverlay.addEventListener("click", (event) => {
  if (event.target.id === "analytics-overlay") {
    closeAnalytics();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !analyticsOverlay.classList.contains("hidden")) {
    closeAnalytics();
  }
});

initExpenseForm();
initSubscriptionForm();
renderExpenses();
renderSubscriptions();
updateBudgetUI();
updateDashboard();

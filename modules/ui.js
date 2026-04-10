import { getBudget, getExpenses, getSubscription } from "./storage.js";

import {
  formatBillingCycle,
  formatCategory,
  formatCurrency,
  formatDate,
  escapeHTML,
} from "../utils/helpers.js";

const expenseList = document.querySelector("#expense-list");
const subscriptionList = document.querySelector("#subscription-list");
const totalExpense = document.querySelector("#total-expense");
const totalBudget = document.querySelector("#total-budget");
const totalSubscription = document.querySelector("#total-subscription");
const expenseMeta = document.querySelector("#expense-meta");
const budgetMeta = document.querySelector("#budget-meta");
const subscriptionMeta = document.querySelector("#subscription-meta");
const heroTrackedCount = document.querySelector("#hero-tracked-count");
const heroSubscriptionCount = document.querySelector("#hero-subscription-count");
const heroBudgetHealth = document.querySelector("#hero-budget-health");
const heroBudgetCard = document.querySelector("#hero-budget-stat");
const budgetCard = document.querySelector("#budget-card");
const budgetActions = budgetCard.querySelector(".budget-actions");

const budgetStatus = document.createElement("div");
budgetStatus.className = "budget-status";
budgetStatus.innerHTML = `
  <div class="budget-status-row">
    <span class="budget-status-copy">Set a budget to start tracking.</span>
    <strong class="budget-status-value">0%</strong>
  </div>
  <div class="budget-progress">
    <span class="budget-progress-fill"></span>
  </div>
`;

const budgetStatusCopy = budgetStatus.querySelector(".budget-status-copy");
const budgetStatusValue = budgetStatus.querySelector(".budget-status-value");
const budgetProgressFill = budgetStatus.querySelector(".budget-progress-fill");

const warningEl = document.createElement("p");
warningEl.id = "budget-warning";

budgetCard.insertBefore(budgetStatus, budgetActions);
budgetCard.insertBefore(warningEl, budgetActions);

function updateBudgetState(state, message, percentage) {
  budgetCard.dataset.state = state;
  budgetStatusCopy.textContent = message;
  budgetStatusValue.textContent = `${percentage}%`;
  budgetProgressFill.style.width = `${Math.min(percentage, 100)}%`;
}

function updateWarning(message) {
  warningEl.textContent = message;
  warningEl.classList.toggle("is-visible", Boolean(message));
}

function getBudgetHealth(total, budget) {
  if (budget <= 0) {
    return {
      cardState: "idle",
      heroState: "idle",
      heroLabel: "Set budget",
      percentage: 0,
      statusCopy: "Set a budget to start tracking.",
      budgetNote: "Add a budget target to unlock pacing insights.",
      warning: "",
    };
  }

  const percentage = Math.round((total / budget) * 100);
  const remaining = Math.max(budget - total, 0);

  if (total > budget) {
    return {
      cardState: "danger",
      heroState: "danger",
      heroLabel: "Over limit",
      percentage,
      statusCopy: "Budget exceeded",
      budgetNote: `Overspent by ₹${formatCurrency(total - budget)}.`,
      warning: `Over budget by ₹${formatCurrency(total - budget)}`,
    };
  }

  if (total >= budget * 0.8) {
    return {
      cardState: "warning",
      heroState: "warning",
      heroLabel: "Near limit",
      percentage,
      statusCopy: `₹${formatCurrency(remaining)} left`,
      budgetNote: `${percentage}% of your budget is already committed.`,
      warning: "Warning: nearing budget limit",
    };
  }

  return {
    cardState: "safe",
    heroState: "safe",
    heroLabel: "On track",
    percentage,
    statusCopy: `₹${formatCurrency(remaining)} available`,
    budgetNote: `${percentage}% of your budget is in use.`,
    warning: "",
  };
}

function getExpenseSortValue(item) {
  if (item.date) {
    const isoMatch = String(item.date).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const parsedDate = isoMatch
      ? new Date(
          Number(isoMatch[1]),
          Number(isoMatch[2]) - 1,
          Number(isoMatch[3]),
        )
      : new Date(item.date);

    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.getTime();
    }
  }

  return Number(item.id) || 0;
}

function updateOverview(expenses, subscriptions, health) {
  if (expenseMeta) {
    expenseMeta.textContent = `${expenses.length} ${
      expenses.length === 1 ? "expense" : "expenses"
    } logged`;
  }

  if (subscriptionMeta) {
    subscriptionMeta.textContent = `${subscriptions.length} active ${
      subscriptions.length === 1 ? "service" : "services"
    }`;
  }

  if (budgetMeta) {
    budgetMeta.textContent = health.budgetNote;
  }

  if (heroTrackedCount) {
    heroTrackedCount.textContent = `${expenses.length + subscriptions.length}`;
  }

  if (heroSubscriptionCount) {
    heroSubscriptionCount.textContent = `${subscriptions.length}`;
  }

  if (heroBudgetHealth) {
    heroBudgetHealth.textContent = health.heroLabel;
  }

  if (heroBudgetCard) {
    heroBudgetCard.dataset.state = health.heroState;
  }
}

export function renderExpenses() {
  const expenses = [...getExpenses()].sort(
    (first, second) => getExpenseSortValue(second) - getExpenseSortValue(first),
  );

  expenseList.innerHTML = expenses
    .map((item) => {
      const meta = [formatCategory(item.expenseCategory), formatDate(item.date)]
        .filter(Boolean)
        .join(" | ");

      return `
        <li class="expense-item">
          <div class="expense-item-copy">
            <p class="expense-item-title">${escapeHTML(item.title)}</p>
            <p class="expense-item-meta">${escapeHTML(meta || "General")}</p>
          </div>
          <p class="expense-item-amount">₹${formatCurrency(item.amount)}</p>
          <div class="expense-item-actions">
            <button type="button" data-id="${item.id}" class="edit">Edit</button>
            <button type="button" data-id="${item.id}" class="delete">Delete</button>
          </div>
        </li>
      `;
    })
    .join("");
}

export function renderSubscriptions() {
  const subscriptions = [...getSubscription()].sort((first, second) =>
    first.subscriptionName.localeCompare(second.subscriptionName),
  );

  subscriptionList.innerHTML = subscriptions
    .map((item) => {
      return `
        <li class="subscription-item">
          <div class="subscription-item-copy">
            <p class="subscription-item-title">${escapeHTML(
              item.subscriptionName,
            )}</p>
            <p class="subscription-item-meta">${formatBillingCycle(
              item.billingCycle,
            )} billing</p>
          </div>
          <p class="subscription-item-amount">₹${formatCurrency(
            item.subscriptionAmount,
          )}</p>
          <div class="subscription-item-actions">
            <button type="button" data-id="${item.id}" class="edit-sub">Edit</button>
            <button type="button" data-id="${item.id}" class="delete-sub">Delete</button>
          </div>
        </li>
      `;
    })
    .join("");
}

export function updateDashboard() {
  const expenses = getExpenses();
  const subscriptions = getSubscription();
  const budget = getBudget();

  const expenseTotal = expenses.reduce(
    (amount, item) => amount + (Number(item.amount) || 0),
    0,
  );
  const subscriptionTotal = subscriptions.reduce(
    (amount, item) => amount + (Number(item.subscriptionAmount) || 0),
    0,
  );
  const trackedTotal = expenseTotal + subscriptionTotal;

  totalExpense.textContent = `₹${formatCurrency(expenseTotal)}`;
  totalSubscription.textContent = `₹${formatCurrency(subscriptionTotal)}`;
  totalBudget.textContent = `₹${formatCurrency(budget)}`;

  const health = getBudgetHealth(trackedTotal, budget);

  updateBudgetState(health.cardState, health.statusCopy, health.percentage);
  updateWarning(health.warning);
  updateOverview(expenses, subscriptions, health);
}

export function updateBudgetUI() {
  const budget = getBudget();

  totalBudget.textContent = `₹${formatCurrency(budget)}`;
}

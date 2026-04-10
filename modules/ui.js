import { getBudget, getExpenses, getSubscription } from "./storage.js";

import {
  formatCurrency,
  formatDate,
  escapeHTML,
  formatCategory,
} from "../utils/helpers.js";

// ================= DOM =================

const expenseList = document.querySelector("#expense-list");
const subscriptionList = document.querySelector("#subscription-list");
const totalSubscription = document.querySelector("#total-subscription");
const totalExpense = document.querySelector("#total-expense");
const totalBudget = document.querySelector("#total-budget");
const budgetCard = document.querySelector("#budget-card");
const budgetActions = budgetCard.querySelector(".budget-actions");

// ================= UI ELEMENTS =================

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

// ================= INTERNAL =================

function updateBudgetState(state, message, percentage) {
  budgetCard.dataset.state = state;
  budgetStatusCopy.textContent = message;
  budgetStatusValue.textContent = `${percentage}%`;
  budgetProgressFill.style.width = `${Math.min(percentage, 100)}%`;
}

// ================= RENDER =================

export function renderExpenses() {
  const expenses = getExpenses();

  expenseList.innerHTML = expenses
    .map((item) => {
      const dateLabel = formatDate(item.date);
      const meta = [formatCategory(item.expenseCategory), dateLabel]
        .filter(Boolean)
        .join(" | ");

      return `
        <li class="expense-item">
          <div>
            <p>${escapeHTML(item.title)}</p>
            <p>${meta}</p>
          </div>
          <p>₹${formatCurrency(item.amount)}</p>
          <div>
            <button data-id="${item.id}" class="edit">Edit</button>
            <button data-id="${item.id}" class="delete">Delete</button>
          </div>
        </li>
      `;
    })
    .join("");
}

export function renderSubscriptions() {
  const subscriptions = getSubscription();

  subscriptionList.innerHTML = subscriptions
    .map((item) => {
      return `
        <li class="subscription-item">
          <div>
            <p>${escapeHTML(item.subscriptionName)}</p>
            <p>${item.billingCycle}</p>
          </div>
          <p>₹${formatCurrency(item.subscriptionAmount)}</p>
          <div>
            <button data-id="${item.id}" class="edit-sub">Edit</button>
            <button data-id="${item.id}" class="delete-sub">Delete</button>
          </div>
        </li>
      `;
    })
    .join("");
}

// ================= DASHBOARD =================

export function updateDashboard() {
  const expenses = getExpenses();
  const subscriptions = getSubscription();
  const budget = getBudget();

  const expenseTotal = expenses.reduce(
    (acc, cur) => acc + Number(cur.amount),
    0,
  );

  const subscriptionTotal = subscriptions.reduce(
    (acc, cur) => acc + Number(cur.subscriptionAmount),
    0,
  );

  const total = expenseTotal + subscriptionTotal;

  totalExpense.textContent = `₹${formatCurrency(expenseTotal)}`;
  totalSubscription.textContent = `₹${formatCurrency(subscriptionTotal)}`;

  if (budget <= 0) {
    warningEl.textContent = "";
    updateBudgetState("idle", "Set a budget to start tracking.", 0);
    return;
  }

  const percentage = Math.round((total / budget) * 100);
  const remaining = Math.max(budget - total, 0);

  if (total > budget) {
    updateBudgetState("danger", "Budget exceeded", percentage);
    warningEl.textContent = `Over budget by ₹${formatCurrency(total - budget)}`;
    return;
  }

  if (total >= budget * 0.8) {
    updateBudgetState(
      "warning",
      `₹${formatCurrency(remaining)} left`,
      percentage,
    );
    warningEl.textContent = "Warning: nearing budget limit";
    return;
  }

  updateBudgetState(
    "safe",
    `₹${formatCurrency(remaining)} available`,
    percentage,
  );

  warningEl.textContent = "";
}

// ================= BUDGET =================

export function updateBudgetUI() {
  const budget = getBudget();
  totalBudget.textContent = `₹${formatCurrency(budget)}`;
}

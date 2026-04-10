import { getBudget, getExpenses, getSubscription } from "./storage.js";

const expenseList = document.querySelector("#expense-list");
const subscriptionList = document.querySelector("#subscription-list");
const totalSubscription = document.querySelector("#total-subscription");
const totalExpense = document.querySelector("#total-expense");
const totalBudget = document.querySelector("#total-budget");
const budgetCard = document.querySelector("#budget-card");
const budgetActions = budgetCard.querySelector(".budget-actions");

const budgetStatus = document.createElement("div");
budgetStatus.className = "budget-status";
budgetStatus.innerHTML = `
  <div class="budget-status-row">
    <span class="budget-status-copy">Set a budget to start tracking.</span>
    <strong class="budget-status-value">0%</strong>
  </div>
  <div class="budget-progress" aria-hidden="true">
    <span class="budget-progress-fill"></span>
  </div>
`;

const budgetStatusCopy = budgetStatus.querySelector(".budget-status-copy");
const budgetStatusValue = budgetStatus.querySelector(".budget-status-value");
const budgetProgressFill = budgetStatus.querySelector(".budget-progress-fill");

const warningEl = document.createElement("p");
warningEl.id = "budget-warning";
warningEl.setAttribute("aria-live", "polite");

budgetCard.insertBefore(budgetStatus, budgetActions);
budgetCard.insertBefore(warningEl, budgetActions);

function formatCurrency(value) {
  const amount = Number(value) || 0;
  return new Intl.NumberFormat("en-IN").format(amount);
}

function formatDate(value) {
  if (!value) return "";

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

function formatCategory(value) {
  if (!value) return "General";

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function updateBudgetState(state, message, percentage) {
  budgetCard.dataset.state = state;
  budgetStatusCopy.textContent = message;
  budgetStatusValue.textContent = `${percentage}%`;
  budgetProgressFill.style.width = `${Math.min(percentage, 100)}%`;
}

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
          <div class="expense-item-copy">
            <p class="expense-item-title">${escapeHTML(item.title)}</p>
            <p class="expense-item-meta">${meta}</p>
          </div>
          <p class="expense-item-amount">₹${formatCurrency(item.amount)}</p>
          <div class="expense-item-actions">
            <button data-id="${item.id}" class="edit" type="button">Edit</button>
            <button data-id="${item.id}" class="delete" type="button">Delete</button>
          </div>
        </li>
      `;
    })
    .join("");
}

export function updateDashboard() {
  const expenses = getExpenses();
  const budget = getBudget();
  const subscription = getSubscription();

  const expenseTotal = expenses.reduce(
    (acc, current) => acc + Number(current.amount),
    0,
  );

  const subscriptionTotal = subscription.reduce(
    (acc, current) => acc + Number(current.subscriptionAmount),
    0,
  );

  totalSubscription.textContent = `₹${formatCurrency(subscriptionTotal)}`;

  totalExpense.textContent = `₹${formatCurrency(expenseTotal)}`;

  if (budget <= 0) {
    warningEl.textContent = "";
    warningEl.classList.remove("is-visible");
    updateBudgetState("idle", "Set a budget to unlock live alerts.", 0);
    return;
  }
  const total = expenseTotal + subscriptionTotal;
  const percentageUsed = Math.round((total / budget) * 100);
  const remaining = Math.max(budget - total, 0);

  if (total > budget) {
    updateBudgetState("danger", "Budget limit crossed.", percentageUsed);
    warningEl.textContent = `Over budget by ₹${formatCurrency(total - budget)}`;
    warningEl.classList.add("is-visible");
    return;
  }

  if (total >= budget * 0.8) {
    updateBudgetState(
      "warning",
      `Only ₹${formatCurrency(remaining)} left before the limit.`,
      percentageUsed,
    );
    warningEl.textContent = `Warning: you're close to your budget cap.`;
    warningEl.classList.add("is-visible");
    return;
  }

  updateBudgetState(
    "safe",
    `₹${formatCurrency(remaining)} still available to spend.`,
    percentageUsed,
  );
  warningEl.textContent = "";
  warningEl.classList.remove("is-visible");
}

export function updateBudgetUI() {
  const budget = getBudget();

  totalBudget.textContent = `₹${formatCurrency(budget)}`;
}

export function renderSubscriptions() {
  const subscriptions = getSubscription();

  subscriptionList.innerHTML = subscriptions
    .map((item) => {
      const meta = `${item.billingCycle}`;

      return `
        <li class="subscription-item">
          <div class="subscription-item-copy">
            <p class="subscription-item-title">${escapeHTML(item.subscriptionName)}</p>
            <p class="subscription-item-meta">${meta}</p>
          </div>
          <p class="subscription-item-amount">₹${formatCurrency(item.subscriptionAmount)}</p>
          <div class="subscription-item-actions">
            <button data-id="${item.id}" class="edit-sub" type="button">Edit</button>
            <button data-id="${item.id}" class="delete-sub" type="button">Delete</button>
          </div>
        </li>
      `;
    })
    .join("");
}

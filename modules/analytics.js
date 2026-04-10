import { getExpenses, getSubscription } from "./storage.js";

import {
  escapeHTML,
  formatCategory,
  formatCurrency,
} from "../utils/helpers.js";

const expenseAnalyticsList = document.querySelector("#expense-analytics-list");
const subscriptionAnalyticsList = document.querySelector(
  "#subscription-analytics-list",
);
const analyticsExpenseTotal = document.querySelector("#analytics-expense-total");
const analyticsSubscriptionTotal = document.querySelector(
  "#analytics-subscription-total",
);
const analyticsTrackedCount = document.querySelector("#analytics-tracked-count");

function getExpenseAnalytics(expenses) {
  const grouped = expenses.reduce((accumulator, item) => {
    const category = item.expenseCategory || "general";
    const amount = Number(item.amount) || 0;

    if (!accumulator[category]) {
      accumulator[category] = {
        key: category,
        label: formatCategory(category),
        total: 0,
        count: 0,
      };
    }

    accumulator[category].total += amount;
    accumulator[category].count += 1;

    return accumulator;
  }, {});

  return Object.values(grouped).sort((first, second) => second.total - first.total);
}

function getSubscriptionAnalytics(subscriptions) {
  const grouped = subscriptions.reduce((accumulator, item) => {
    const name = item.subscriptionName || "Unnamed";
    const key = name.trim().toLowerCase();
    const amount = Number(item.subscriptionAmount) || 0;

    if (!accumulator[key]) {
      accumulator[key] = {
        label: name.trim() || "Unnamed",
        total: 0,
        count: 0,
      };
    }

    accumulator[key].total += amount;
    accumulator[key].count += 1;

    return accumulator;
  }, {});

  return Object.values(grouped).sort((first, second) => second.total - first.total);
}

function renderAnalyticsList(listElement, items, emptyMessage, metaFormatter) {
  if (!listElement) return;

  if (!items.length) {
    listElement.innerHTML = `
      <li class="analytics-empty">
        <p>${escapeHTML(emptyMessage)}</p>
      </li>
    `;
    return;
  }

  const grandTotal = items.reduce((total, item) => total + item.total, 0);

  listElement.innerHTML = items
    .map((item) => {
      const share = grandTotal ? Math.round((item.total / grandTotal) * 100) : 0;
      const visibleWidth = Math.max(share, 8);

      return `
        <li class="analytics-item">
          <div class="analytics-item-top">
            <div class="analytics-item-copy">
              <p class="analytics-item-title">${escapeHTML(item.label)}</p>
              <p class="analytics-item-meta">${escapeHTML(
                metaFormatter(item, share),
              )}</p>
            </div>
            <p class="analytics-item-amount">₹${formatCurrency(item.total)}</p>
          </div>
          <div class="analytics-bar" aria-hidden="true">
            <span style="width: ${visibleWidth}%"></span>
          </div>
        </li>
      `;
    })
    .join("");
}

function updateAnalyticsSummary(expenses, subscriptions) {
  const totalExpense = expenses.reduce(
    (amount, item) => amount + (Number(item.amount) || 0),
    0,
  );
  const totalSubscription = subscriptions.reduce(
    (amount, item) => amount + (Number(item.subscriptionAmount) || 0),
    0,
  );

  if (analyticsExpenseTotal) {
    analyticsExpenseTotal.textContent = `₹${formatCurrency(totalExpense)}`;
  }

  if (analyticsSubscriptionTotal) {
    analyticsSubscriptionTotal.textContent = `₹${formatCurrency(totalSubscription)}`;
  }

  if (analyticsTrackedCount) {
    analyticsTrackedCount.textContent = `${expenses.length + subscriptions.length}`;
  }
}

export function renderExpenseAnalytics() {
  const expenses = getExpenses();
  const analytics = getExpenseAnalytics(expenses);

  renderAnalyticsList(
    expenseAnalyticsList,
    analytics,
    "Add a few expenses to unlock category insights.",
    (item, share) =>
      `${item.count} ${item.count === 1 ? "entry" : "entries"} | ${share}% of expense spend`,
  );
}

export function renderSubscriptionAnalytics() {
  const subscriptions = getSubscription();
  const analytics = getSubscriptionAnalytics(subscriptions);

  renderAnalyticsList(
    subscriptionAnalyticsList,
    analytics,
    "Add subscriptions to compare your recurring payments.",
    (item, share) =>
      `${item.count} ${item.count === 1 ? "plan" : "plans"} | ${share}% of subscription spend`,
  );
}

export function renderAnalytics() {
  const expenses = getExpenses();
  const subscriptions = getSubscription();

  updateAnalyticsSummary(expenses, subscriptions);
  renderExpenseAnalytics();
  renderSubscriptionAnalytics();
}

// utils/helpers.js

export function formatCurrency(value) {
  const amount = Number(value) || 0;

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

export function formatDate(value) {
  if (!value) return "";

  const isoMatch = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);

  const date = isoMatch
    ? new Date(
        Number(isoMatch[1]),
        Number(isoMatch[2]) - 1,
        Number(isoMatch[3]),
      )
    : new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return map[char];
  });
}

export function formatCategory(value) {
  if (!value) return "General";

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatBillingCycle(value) {
  if (!value) return "Custom";

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getTodayDateValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// utils/helper.js

export function formatCurrency(value) {
  const amount = Number(value) || 0;
  return new Intl.NumberFormat("en-IN").format(amount);
}

export function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (isNaN(date)) return "";

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

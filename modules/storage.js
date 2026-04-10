export function getExpenses() {
  const data = localStorage.getItem("expenses");

  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch (error) {
    console.log("Invalid JSON in localStorage", error);
    return [];
  }
}

export function saveExpenses(expenses) {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

export function getBudget() {
  const data = localStorage.getItem("budget");
  try {
    return data ? JSON.parse(data) : 0;
  } catch {
    return 0;
  }
}

export function setBudget(budget) {
  localStorage.setItem("budget", JSON.stringify(budget));
}

export function getSubscription() {
  const data = localStorage.getItem("subscription");

  if (!data) return [];

  try {
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log("Invalid JSON in localStorage", error);
    return [];
  }
}

export function setSubscription(subscription) {
  localStorage.setItem("subscription", JSON.stringify(subscription));
}

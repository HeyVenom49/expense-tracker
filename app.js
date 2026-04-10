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

const expenseForm = document.querySelector("#expense-form");
const expenseList = document.querySelector("#expense-list");
const budgetButton = document.querySelector("#set-budget-btn");
const subscriptionForm = document.querySelector("#subscription-form");
const subscriptionList = document.querySelector("#subscription-list");

let expenseEditId = null;
let subscriptionEditId = null;

// Expense form
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const saveData = getExpenses();
  const title = document.querySelector("#expense-title").value;
  const amount = Number(document.querySelector("#expense-amount").value);
  const expenseCategory = document.querySelector("#expense-category").value;
  const date = document.querySelector("#expense-date").value;

  const category = ["food", "travel", "shopping"];
  if (
    title.trim() === "" ||
    isNaN(amount) ||
    amount <= 0 ||
    !category.includes(expenseCategory)
  ) {
    return;
  }

  if (expenseEditId) {
    const updatedExpense = saveData.map((item) => {
      if (item.id === expenseEditId) {
        return {
          ...item,
          title,
          amount,
        };
      }
      return item;
    });
    saveExpenses(updatedExpense);
    expenseEditId = null;
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
  expenseForm.reset();
});

expenseList.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    const id = Number(e.target.dataset.id);

    const expenses = getExpenses();

    const item = expenses.find((el) => el.id === id);

    document.querySelector("#expense-title").value = item.title;
    document.querySelector("#expense-amount").value = item.amount;

    expenseEditId = id;
  } else if (e.target.classList.contains("delete")) {
    const id = Number(e.target.dataset.id);

    const expenses = getExpenses();

    const newExpenses = expenses.filter((item) => item.id !== id);

    saveExpenses(newExpenses);
    renderExpenses();
    updateDashboard();
  }
});

budgetButton.addEventListener("click", (e) => {
  e.preventDefault();

  const budgetInput = Number(document.querySelector("#budget-input").value);

  if (isNaN(budgetInput) || budgetInput <= 0) {
    return;
  }

  setBudget(budgetInput);
  updateBudgetUI();
  updateDashboard();
  document.querySelector("#budget-input").value = "";
});

// Subscription form

subscriptionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = getSubscription();

  const subscriptionName = document.querySelector("#subscription-name").value;
  const subscriptionAmount = Number(
    document.querySelector("#subscription-amount").value,
  );
  const billingCycle = document.querySelector("#billing-cycle").value;
  const cycleArray = ["monthly", "yearly"];
  if (
    subscriptionName.trim() === "" ||
    isNaN(subscriptionAmount) ||
    subscriptionAmount <= 0 ||
    !cycleArray.includes(billingCycle)
  ) {
    return;
  }
  if (subscriptionEditId) {
    const updateSubscription = data.map((item) => {
      if (item.id === subscriptionEditId) {
        return {
          ...item,
          subscriptionName,
          subscriptionAmount,
          billingCycle,
        };
      }
      return item;
    });
    setSubscription(updateSubscription);
    subscriptionEditId = null;
  } else {
    const subscription = {
      id: Date.now(),
      subscriptionName,
      subscriptionAmount,
      billingCycle,
    };
    data.push(subscription);
    setSubscription(data);
  }
  renderSubscriptions();
  updateDashboard();
  subscriptionForm.reset();
});

subscriptionList.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target.classList.contains("edit-sub")) {
    const id = Number(e.target.dataset.id);

    const subscription = getSubscription();

    const item = subscription.find((el) => el.id === id);

    document.querySelector("#subscription-name").value = item.subscriptionName;
    document.querySelector("#subscription-amount").value =
      item.subscriptionAmount;
    document.querySelector("#billing-cycle").value = item.billingCycle;

    subscriptionEditId = id;
  } else if (e.target.classList.contains("delete-sub")) {
    const id = Number(e.target.dataset.id);

    const subscription = getSubscription();

    const newSubscription = subscription.filter((el) => el.id !== id);

    setSubscription(newSubscription);
    renderSubscriptions();
    updateDashboard();
  }
});

renderExpenses();
renderSubscriptions();
updateBudgetUI();
updateDashboard();

import { BILLING_CYCLES } from "../utils/constants.js";

let subscriptionEditId = null;

const subscriptionForm = document.querySelector("#subscription-form");
const subscriptionNameInput = document.querySelector("#subscription-name");
const subscriptionAmountInput = document.querySelector("#subscription-amount");
const billingCycleInput = document.querySelector("#billing-cycle");
const subscriptionSubmitButton = subscriptionForm.querySelector(
  'button[type="submit"]',
);

function setSubscriptionFormMode(isEditing) {
  subscriptionForm.dataset.mode = isEditing ? "editing" : "create";
  subscriptionSubmitButton.textContent = isEditing
    ? "Save Subscription"
    : "Add Subscription";
}

function resetSubscriptionForm() {
  subscriptionForm.reset();
  subscriptionEditId = null;
  setSubscriptionFormMode(false);
}

export function initSubscriptionForm() {
  setSubscriptionFormMode(false);
}

export function handleSubscriptionSubmit(e, deps) {
  e.preventDefault();

  const {
    getSubscription,
    setSubscription,
    renderSubscriptions,
    updateDashboard,
  } = deps;

  const data = getSubscription();

  const subscriptionName = subscriptionNameInput.value.trim();
  const subscriptionAmount = Number(subscriptionAmountInput.value);
  const billingCycle = billingCycleInput.value;

  if (
    subscriptionName === "" ||
    isNaN(subscriptionAmount) ||
    subscriptionAmount <= 0 ||
    !BILLING_CYCLES.includes(billingCycle)
  ) {
    return;
  }

  if (subscriptionEditId !== null) {
    const updated = data.map((item) => {
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

    setSubscription(updated);
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
  resetSubscriptionForm();
}

export function handleSubscriptionClick(e, deps) {
  const {
    getSubscription,
    setSubscription,
    renderSubscriptions,
    updateDashboard,
  } = deps;

  if (e.target.classList.contains("edit-sub")) {
    const id = Number(e.target.dataset.id);

    const item = getSubscription().find((el) => el.id === id);

    if (!item) return;

    subscriptionNameInput.value = item.subscriptionName;
    subscriptionAmountInput.value = item.subscriptionAmount;
    billingCycleInput.value = item.billingCycle;

    subscriptionEditId = id;
    setSubscriptionFormMode(true);
  }

  if (e.target.classList.contains("delete-sub")) {
    const id = Number(e.target.dataset.id);

    const updated = getSubscription().filter((el) => el.id !== id);

    setSubscription(updated);
    renderSubscriptions();
    updateDashboard();

    if (subscriptionEditId === id) {
      resetSubscriptionForm();
    }
  }
}

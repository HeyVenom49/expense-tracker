import { BILLING_CYCLES } from "../utils/constants.js";

let subscriptionEditId = null;

export function handleSubscriptionSubmit(e, deps) {
  e.preventDefault();

  const {
    getSubscription,
    setSubscription,
    renderSubscriptions,
    updateDashboard,
  } = deps;

  const data = getSubscription();

  const subscriptionName = document.querySelector("#subscription-name").value;
  const subscriptionAmount = Number(
    document.querySelector("#subscription-amount").value,
  );
  const billingCycle = document.querySelector("#billing-cycle").value;

  if (
    subscriptionName.trim() === "" ||
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
  document.querySelector("#subscription-form").reset();
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

    document.querySelector("#subscription-name").value = item.subscriptionName;
    document.querySelector("#subscription-amount").value =
      item.subscriptionAmount;
    document.querySelector("#billing-cycle").value = item.billingCycle;

    subscriptionEditId = id;
  }

  if (e.target.classList.contains("delete-sub")) {
    const id = Number(e.target.dataset.id);

    const updated = getSubscription().filter((el) => el.id !== id);

    setSubscription(updated);
    renderSubscriptions();
    updateDashboard();
  }
}

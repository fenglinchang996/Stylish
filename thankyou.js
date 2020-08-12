const URLInfo = new URL(window.location);
const orderNumber = URLInfo.searchParams.get("orderNumber");

const orderNumberElement = document.querySelector("#order-number");
orderNumberElement.textContent = orderNumber;

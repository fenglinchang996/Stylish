// Initialize order object
function initializeOrder() {
  return {
    shipping: "",
    payment: "",
    subtotal: 0,
    freight: 0,
    total: 0,
    recipient: {
      name: "",
      phone: "",
      email: "",
      address: "",
      time: "",
    },
    list: [],
  };
}

function getOrder() {
  let orderStorage = window.localStorage.getItem("order");
  let order = orderStorage ? JSON.parse(orderStorage) : initializeOrder();
  return order;
}

function removeOrder() {
  window.localStorage.removeItem("order");
}

function getCartProductList() {
  const order = getOrder();
  return order.list;
}

function getCartProductQty(cartProductList) {
  let cartProductQty = cartProductList.reduce(
    (total, product) => (total += product.qty),
    0
  );
  return cartProductQty;
}

function showCartProductQtyOnPage() {
  const cartQty = document.querySelector(".cart__product-qty");
  const sidebarCartQty = document.querySelector(".sidebar__cart__product-qty");
  [sidebarCartQty, cartQty].forEach(
    (tag) => (tag.textContent = getCartProductQty(getCartProductList()))
  );
}

function setCartProductList(cartProductList) {
  const order = getOrder();
  order.list = cartProductList;
  order.subtotal = cartProductList.reduce(
    (subtotal, product) => (subtotal += product.price * product.qty),
    0
  );
  order.freight = order.list.length > 0 ? 30 : 0;
  order.total = order.subtotal + order.freight;
  window.localStorage.setItem("order", JSON.stringify(order));
}

function setRecipientInfo(recipientInfo) {
  const order = getOrder();
  order.recipient = recipientInfo;
  window.localStorage.setItem("order", JSON.stringify(order));
}

function setDeliveryAndPayment(delivery, payment) {
  const order = getOrder();
  order.shipping = delivery;
  order.payment = payment;
  window.localStorage.setItem("order", JSON.stringify(order));
}

showCartProductQtyOnPage();

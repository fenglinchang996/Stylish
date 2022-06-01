// display quantity of products in cart
const cartProductQty = document.querySelector(".shopping-cart__total-qty");

// get subtotal price element
const subTotalPrice = document.querySelector(".order__subtotal-price__value");

// get freight fee element
const freight = document.querySelector(".order__freight__value");

// get total price element
const totalPrice = document.querySelector(".order__estimate-total-price__value");

renderCartProductList(getCartProductList());
renderTotalQtyAndPrice(getOrder());
verifyUserInput();

function renderTotalQtyAndPrice(order) {
  cartProductQty.textContent = getCartProductQty(getCartProductList());
  subTotalPrice.textContent = `NT. ${order.subtotal}`;
  freight.textContent = `NT. ${order.freight}`;
  totalPrice.textContent = `NT. ${order.total}`;
}

function renderCartProductList(cartProductList) {
  const shoppingCart = document.querySelector(".shopping-cart__goods");
  shoppingCart.innerHTML = "";
  if (cartProductList.length === 0) {
    shoppingCart.textContent = "購物車沒有東西喔！";
  } else {
    cartProductList.forEach((cartProduct) => {
      let product = createCartProduct(cartProduct);
      let productSep = document.createElement("hr");
      productSep.className = "product-sep";
      shoppingCart.append(product, productSep);
    });
  }
}

function createCartProduct(cartProduct) {
  let product = document.createElement("div");
  product.className = "product";

  let productMainImg = document.createElement("img");
  productMainImg.className = "product__main-img";
  productMainImg.src = cartProduct.main_image;

  let productInfo = document.createElement("div");
  productInfo.className = "product__info";

  let productName = document.createElement("div");
  productName.className = "product__name";
  productName.textContent = `${cartProduct.name}`;
  let productId = document.createElement("div");
  productId.className = "product__id";
  productId.textContent = `${cartProduct.id}`;
  let productColor = document.createElement("div");
  productColor.className = "product__color";
  productColor.textContent = `顏色 | ${cartProduct.color.color_name}`;
  let productSize = document.createElement("div");
  productSize.className = "product__size";
  productSize.textContent = `尺寸 | ${cartProduct.size}`;

  productInfo.append(productName, productId, productColor, productSize);

  let productDelete = document.createElement("button");
  productDelete.className = "product__delete";
  // add event for remove product
  productDelete.addEventListener("click", () => {
    removeCartProduct(cartProduct);
  });
  let productDeleteIcon = document.createElement("img");
  productDeleteIcon.src = "images/cart-remove.png";
  productDelete.appendChild(productDeleteIcon);

  let productQty = document.createElement("div");
  productQty.className = "product__qty";
  let productQtyTitle = document.createElement("div");
  productQtyTitle.className = "product__qty__title";
  productQtyTitle.textContent = "數量";
  let productQtyNumber = document.createElement("select");
  productQtyNumber.className = "product__qty__number";
  productQtyNumber.value = cartProduct.qty;
  // Add event for change product quantity
  productQtyNumber.addEventListener("change", (e) => {
    let newQty = parseInt(e.target.value);
    console.log(e.target);
    console.log(newQty);
    changeCartProductQty(cartProduct, newQty);
  });
  for (let qty = 1; qty <= cartProduct.stock; qty++) {
    let productQtyNumberOption = document.createElement("option");
    productQtyNumberOption.value = qty;
    productQtyNumberOption.textContent = qty;
    if (qty === cartProduct.qty) {
      productQtyNumberOption.selected = true;
    }
    productQtyNumber.appendChild(productQtyNumberOption);
  }

  productQty.append(productQtyTitle, productQtyNumber);

  let productPrice = document.createElement("div");
  productPrice.className = "product__price";
  let productPriceTitle = document.createElement("div");
  productPriceTitle.className = "product__price__title";
  productPriceTitle.textContent = "單價";
  let productPriceValue = document.createElement("div");
  productPriceValue.className = "product__price__value";
  productPriceValue.textContent = `NT.${cartProduct.price}`;

  productPrice.append(productPriceTitle, productPriceValue);

  let productSubtotalPrice = document.createElement("div");
  productSubtotalPrice.className = "product__subtotal-price";
  let productSubtotalPriceTitle = document.createElement("div");
  productSubtotalPriceTitle.className = "product__subtotal-price__title";
  productSubtotalPriceTitle.textContent = "小計";
  let productSubtotalPriceValue = document.createElement("div");
  productSubtotalPriceValue.className = "product__subtotal-price__value";
  productSubtotalPriceValue.textContent = `NT.${
    cartProduct.price * cartProduct.qty
  }`;

  productSubtotalPrice.append(productSubtotalPriceTitle, productSubtotalPriceValue);

  product.append(
    productMainImg,
    productInfo,
    productDelete,
    productQty,
    productPrice,
    productSubtotalPrice
  );

  return product;
}

// remover specific cart product and re-render cart product list
function removeCartProduct(product) {
  const cartProductList = getCartProductList();
  let newCartProductList = cartProductList.filter(
    (cartProduct) =>
      !(
        cartProduct.id === product.id &&
        cartProduct.color.color_code === product.color.color_code &&
        cartProduct.size === product.size
      )
  );
  setCartProductList(newCartProductList);
  showCartProductQtyOnPage();
  renderTotalQtyAndPrice(getOrder());
  renderCartProductList(getCartProductList());
}

function changeCartProductQty(product, newQty) {
  const cartProductList = getCartProductList();
  let cartProductIndexToBeChanged = cartProductList.findIndex(
    (cartProduct) =>
      cartProduct.id === product.id &&
      cartProduct.color.color_code === product.color.color_code &&
      cartProduct.size === product.size
  );

  if (cartProductIndexToBeChanged > -1) {
    cartProductList[cartProductIndexToBeChanged].qty = newQty;
  }
  setCartProductList(cartProductList);
  showCartProductQtyOnPage();
  renderTotalQtyAndPrice(getOrder());
  renderCartProductList(getCartProductList());
}

function getRecipientInfoFromUser() {
  const name = document.querySelector("input#name").value;
  const phone = document.querySelector("input#phone").value;
  const email = document.querySelector("input#email").value;
  const address = document.querySelector("input#address").value;
  const time = document.querySelector('input[name="delivery-time"]:checked').value;

  return {
    name,
    phone,
    email,
    address,
    time,
  };
}
function checkRecipientInfo(recipient) {
  const { name, phone, email, address } = recipient;

  if (!name) {
    alert("請輸入收件人姓名！");
    return false;
  }

  if (!phone) {
    alert("請輸入手機號碼！");
    return false;
  }

  if (!verifyPhone(phone)) {
    alert("手機輸入不正確！請重新確認");
    return false;
  }

  if (!email) {
    alert("請輸入E-mail！");
    return false;
  }

  if (!verifyEmail(email)) {
    alert("E-mail輸入不正確！請重新確認");
    return false;
  }

  if (!address) {
    alert("請輸入地址！");
    return false;
  }

  return true;
}

function getDeliveryAndPaymentFromUser() {
  const delivery = "delivery";
  const payment = document.querySelector("#payment-method").value;

  return {
    delivery,
    payment,
  };
}

const confirmPaymentBtn = document.querySelector(".confirm-payment");
confirmPaymentBtn.addEventListener("click", () => {
  if (getCartProductQty(getCartProductList()) === 0) {
    alert("購物車裡面沒有東西喔！");
    return;
  }

  const recipient = getRecipientInfoFromUser();
  if (!checkRecipientInfo(recipient)) {
    return;
  }
  setRecipientInfo(recipient);
  const { delivery, payment } = getDeliveryAndPaymentFromUser();
  setDeliveryAndPayment(delivery, payment);

  const tappayField = TPDirect.card.getTappayFieldsStatus();
  if (!tappayField.canGetPrime) {
    alert("信用卡資料未輸入或不正確！請重新確認信用卡輸入資訊！");
    return;
  }

  TPDirect.card.getPrime((result) => {
    const prime = result.card.prime;
    const order = getOrder();

    alert("購物成功");
    removeOrder();
    window.location = "./thankyou.html";
  });
});

function checkout(checkoutData, accessToken) {
  postData(
    `https://${HOST_NAME}/api/${API_VERSION}/order/checkout`,
    checkoutData,
    (response) => {
      const orderNumber = response.data.number;
      window.location = `./thankyou.html?orderNumber=${orderNumber}`;
      removeOrder();
    },
    (error) =>
      console.log(`Error: ${error.status} Error Message: ${error.statusText}`),
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    }
  );
}

const verifyEmail = (emailInputValue) =>
  emailInputValue.match(
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  );

const verifyPhone = (phoneInputValue) => phoneInputValue.match(/\b09[0-9]{8}\b/);

function verifyUserInput() {
  const emailInput = document.querySelector("#email");
  emailInput.addEventListener("input", (e) => {
    const emailInputValue = e.target.value;
    let isValidEmail = verifyEmail(emailInputValue);
    if (isValidEmail || emailInputValue === "") {
      emailInput.style.color = "inherit";
    } else {
      emailInput.style.color = "red";
    }
  });

  const phoneInput = document.querySelector("#phone");
  phoneInput.addEventListener("input", (e) => {
    const phoneInputValue = e.target.value;
    let isValidPhone = verifyPhone(phoneInputValue);
    if (isValidPhone || phoneInputValue === "") {
      phoneInput.style.color = "inherit";
    } else {
      phoneInput.style.color = "red";
    }
  });
}

function loadFullPage() {
  const container = document.querySelector(".container");
  let loadingLayer = document.createElement("div");
  loadingLayer.className = "full-page-loading";
  container.appendChild(loadingLayer);
}

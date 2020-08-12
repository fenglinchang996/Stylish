const URLInfo = new URL(window.location);
const productDetailsId = URLInfo.searchParams.get("id");

// set selected product
let selectedProduct = {
  id: 0,
  main_image: "",
  name: "",
  price: 0,
  color: {
    color_code: "",
    color_name: "",
  },
  size: "",
  qty: 1,
  stock: 1,
};
function initializeProductSelection(selectedProduct) {
  selectedProduct.color = {
    color_code: "",
    color_name: "",
  };
  selectedProduct.size = "";
  selectedProduct.qty = 1;
  selectedProduct.stock = 1;
}

// get product DOM Element
const product = document.querySelector(".product");

getProductDetails(productDetailsId);

// render product details on the product page
function renderProductDetails(productData) {
  const productMainImg = product.querySelector(".product__main-img");
  let productPic = document.createElement("img");
  productPic.src = productData.main_image;
  selectedProduct.main_image = productData.main_image;
  productMainImg.appendChild(productPic);

  const productTitle = product.querySelector(".product__title");
  productTitle.textContent = productData.title;
  selectedProduct.name = productData.title;

  const productId = product.querySelector(".product__id");
  productId.textContent = productData.id;
  selectedProduct.id = productData.id;

  const productPrice = product.querySelector(".product__price");
  productPrice.textContent = `TWD.${productData.price}`;
  selectedProduct.price = productData.price;

  const productColors = product.querySelector(".product__colors");
  const productSizes = product.querySelector(".product__sizes");

  // product qty input
  const productQtyNumber = product.querySelector(
    ".product__qty__count__number"
  );

  const productQtyIncBtn = product.querySelector(".product__qty__count__inc");
  // add event for increasing product quantity
  productQtyIncBtn.addEventListener("click", () => {
    let productQty = parseInt(productQtyNumber.textContent);
    if (productQty < selectedProduct.stock) {
      selectedProduct.qty = productQty + 1;
      productQtyNumber.textContent = selectedProduct.qty;
    }
  });

  const productQtyDecBtn = product.querySelector(".product__qty__count__dec");
  // add event for decreasing product quantity
  productQtyDecBtn.addEventListener("click", () => {
    let productQty = parseInt(productQtyNumber.textContent);
    if (productQty > 1) {
      selectedProduct.qty = productQty - 1;
      productQtyNumber.textContent = selectedProduct.qty;
    }
  });

  // create color selection blocks
  productData.colors.forEach((color, index) => {
    let colorBlock = document.createElement("div");
    colorBlock.className = "product__colors__color";
    colorBlock.style.backgroundColor = `#${color.code}`;
    colorBlock.title = `${color.name}`;

    if (index === 0) {
      selectedProduct.color.color_code = color.code;
      selectedProduct.color.color_name = color.name;
      colorBlock.classList.add("product__colors__color--selected");
      addSizeAndQtySelection(color);
    }

    colorBlock.addEventListener("click", () => {
      initializeProductSelection(selectedProduct);
      selectedProduct.color.color_code = color.code;
      selectedProduct.color.color_name = color.name;
      const colorBlocks = product.querySelectorAll(".product__colors__color");
      colorBlocks.forEach((colorBlock) => {
        if (colorBlock.classList.contains("product__colors__color--selected")) {
          colorBlock.classList.remove("product__colors__color--selected");
        }
      });
      colorBlock.classList.add("product__colors__color--selected");
      addSizeAndQtySelection(color);
    });
    productColors.appendChild(colorBlock);
  });

  function addSizeAndQtySelection(selectedColor) {
    // initialize product sizes block
    productSizes.innerHTML = "";

    const productVariantsBasedOnSelectedColor = productData.variants.filter(
      (variant) => variant.color_code === selectedColor.code
    );

    productVariantsBasedOnSelectedColor.forEach((variantWithSameColor) => {
      let sizeBlock = document.createElement("div");
      sizeBlock.className = "product__sizes__size";
      if (variantWithSameColor.stock === 0) {
        sizeBlock.classList.add("product__sizes__size--disabled");
      } else {
        if (selectedProduct.size === "") {
          sizeBlock.classList.add("product__sizes__size--selected");
          selectedProduct.size = variantWithSameColor.size;
          selectedProduct.qty = 1;
          selectedProduct.stock = variantWithSameColor.stock;
          productQtyNumber.textContent = selectedProduct.qty;
        }
        sizeBlock.addEventListener("click", () => {
          const sizeBlocks = product.querySelectorAll(".product__sizes__size");
          sizeBlocks.forEach((sizeBlock) => {
            if (
              sizeBlock.classList.contains("product__sizes__size--selected")
            ) {
              sizeBlock.classList.remove("product__sizes__size--selected");
            }
          });
          sizeBlock.classList.add("product__sizes__size--selected");
          selectedProduct.size = variantWithSameColor.size;
          selectedProduct.qty = 1;
          selectedProduct.stock = variantWithSameColor.stock;
          productQtyNumber.textContent = selectedProduct.qty;
        });
      }
      sizeBlock.textContent = variantWithSameColor.size;
      productSizes.appendChild(sizeBlock);
    });
  }

  // add to cart action
  const addToCartBtn = product.querySelector(".add-to-cart");
  addToCartBtn.addEventListener("click", () => {
    let cartProductList = getCartProductList();
    const selectedProductIndex = cartProductList.findIndex(
      (product) =>
        product.id === selectedProduct.id &&
        product.color.color_code === selectedProduct.color.color_code &&
        product.size === selectedProduct.size
    );
    if (selectedProductIndex > -1) {
      if (
        cartProductList[selectedProductIndex].qty + selectedProduct.qty <=
        selectedProduct.stock
      ) {
        cartProductList[selectedProductIndex].qty =
          cartProductList[selectedProductIndex].qty + selectedProduct.qty;
        alert("商品已加入購物車");
      } else {
        alert(
          "您選購的商品總數已經超過庫存！\r\n請重新選購或選擇其它商品，感謝！"
        );
      }
    } else {
      cartProductList.push(selectedProduct);
      alert("商品已加入購物車");
    }
    setCartProductList(cartProductList);
    showCartProductQtyOnPage();
  });

  const productNote = product.querySelector(".product__prop__note");
  productNote.textContent = `*${productData.note}`;

  const productTexture = product.querySelector(".product__prop__texture");
  productTexture.textContent = productData.texture;

  const firstProductPropBlock = product.querySelector(".product__prop__block");
  productData.description.split("\r\n").forEach((desc) => {
    let productDescription = document.createElement("p");
    productDescription.className = "product__prop__description";
    productDescription.textContent = desc;
    firstProductPropBlock.appendChild(productDescription);
  });

  const productPlace = product.querySelector(".product__prop__place");
  productPlace.textContent = `產地：${productData.place}`;

  const productWash = product.querySelector(".product__prop__wash");
  productWash.textContent = `洗滌：${productData.wash}`;

  const productStory = product.querySelector(
    ".product__detail__content__story"
  );
  productStory.textContent = productData.story;

  // render product image
  const productDetailContent = document.querySelector(
    ".product__detail__content"
  );
  productData.images.forEach((imageURL) => {
    let productImg = document.createElement("img");
    productImg.className = "product__detail__content__img";
    productImg.src = imageURL;
    productDetailContent.appendChild(productImg);
  });
}
// function for getting product details
function getProductDetails(productDetailsId) {
  getData(
    `https://${HOST_NAME}/api/${API_VERSION}/products/details?id=${productDetailsId}`,
    (result) => renderProductDetails(result.data),
    (error) =>
      console.log(`Error: ${error.status} Error Message: ${error.statusText}`)
  );
}

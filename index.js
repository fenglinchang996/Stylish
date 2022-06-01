// category string
const ALL = "all";
const WOMEN = "women";
const MEN = "men";
const ACCESSORIES = "accessories";
const SEARCH = "search";

// declare global variable
let nextPage;
let isLoading = false;
let productListCategory;
let searchText;

const URLInfo = new URL(window.location);
productListCategory = URLInfo.searchParams.get("category"); // ALL, WOMEN, MEN, ACCESSORIES, SEARCH
searchText = URLInfo.searchParams.get("searchText");

getMarketingCampaigns();

switch (productListCategory) {
  case WOMEN:
  case MEN:
  case ACCESSORIES:
    HighlightCategory(productListCategory);
  case ALL:
    getProductList(productListCategory);
    break;
  case SEARCH:
    getSearchedProductList(searchText);
    break;
  default:
    window.location = "./index.html?category=all";
    break;
}

function HighlightCategory(productListCategory) {
  document.querySelector(
    `.main-nav__item.${productListCategory}-category`
  ).style.color = "#8b572a";
  document.querySelector(
    `.mobile-nav__item.${productListCategory}-category`
  ).style.color = "#ffffff";
}

// render product list in main content on home page
function renderProductList(productList) {
  const mainContent = document.querySelector(".main-content");
  let contentBoxes = document.createElement("div");
  contentBoxes.className = "product-list";
  productList.forEach((product) => {
    const productContainer = createProduct(product);
    contentBoxes.appendChild(productContainer);
    mainContent.appendChild(contentBoxes);
  });
}
// create product view
function createProduct(product) {
  let productContainer = document.createElement("div");
  productContainer.className = "product";
  productContainer.addEventListener("click", () => {
    window.location = `./product.html?id=${product.id}`;
  });

  let productImg = document.createElement("img");
  productImg.className = "product__img";
  productImg.src = product.main_image;

  let productColors = document.createElement("div");
  productColors.className = "product__colors";
  product.colors.forEach((color) => {
    let productColor = document.createElement("span");
    productColor.className = "product__colors__color";
    productColor.style.backgroundColor = `#${color.code}`;
    productColors.appendChild(productColor);
  });

  let productTitle = document.createElement("div");
  productTitle.className = "product__title";
  productTitle.textContent = product.title;

  let productPrice = document.createElement("div");
  productPrice.className = "product__price";
  productPrice.textContent = `TWD. ${product.price}`;

  productContainer.appendChild(productImg);
  productContainer.appendChild(productColors);
  productContainer.appendChild(productTitle);
  productContainer.appendChild(productPrice);

  return productContainer;
}

// function for getting product list
function getProductList(productListCategory, page) {
  isLoading = true;
  getData(
    `https://${HOST_NAME}/api/${API_VERSION}/products/${productListCategory}?paging=${page}`,
    (result) => {
      const productList = result.data;
      nextPage = result.next_paging;
      renderProductList(productList);
      isLoading = false;
    },
    (error) => {
      isLoading = false;
      console.log(`Error: ${error.status} Error Message: ${error.statusText}`);
    }
  );
}

//function for searching products
function getSearchedProductList(searchInput) {
  getData(
    `https://${HOST_NAME}/api/${API_VERSION}/products/search?keyword=${searchInput}`,
    (result) => {
      const searchedProducts = result.data;
      nextPage = result.next_paging;
      if (searchedProducts.length === 0) {
        let emptySearch = document.createElement("div");
        emptySearch.className = "empty-search";
        emptySearch.textContent = "您搜尋的品不存在！";
        const mainContent = document.querySelector(".main-content");
        mainContent.appendChild(emptySearch);
      } else {
        renderProductList(searchedProducts);
      }
    },
    (error) => {
      console.log(`Error: ${error.status} Error Message: ${error.statusText}`);
    }
  );
}

// Infinite scroll
window.addEventListener("scroll", () => {
  const mainContent = document.querySelector(".main-content");
  if (
    mainContent.getBoundingClientRect().bottom - window.innerHeight <
    mainContent.getBoundingClientRect().height * 0.1
  ) {
    if (nextPage && !isLoading) {
      switch (productListCategory) {
        case ALL:
        case WOMEN:
        case MEN:
        case ACCESSORIES:
          getProductList(productListCategory, nextPage);
          break;
        case SEARCH:
          getSearchedProductList(searchText, nextPage);
          break;
        default:
          break;
      }
    }
  }
});

// render marketing campaigns
function renderMarketingCampaigns(marketingCampaigns) {
  const slide = document.querySelector(".slide");
  let bannerSelect = document.createElement("div");
  bannerSelect.className = "banner-select";

  marketingCampaigns.forEach((marketingCampaign) => {
    let banner = document.createElement("div");
    banner.className = "banner";
    let bannerLink = document.createElement("a");
    bannerLink.href = `./product.html?id=${marketingCampaign.product_id}`;
    let bannerImg = document.createElement("img");
    bannerImg.className = "banner__img";
    let bannerText = document.createElement("blockquote");
    bannerText.className = "banner__text";

    banner.id = marketingCampaign.id;
    bannerImg.src = marketingCampaign.picture;

    const story = marketingCampaign.story.split("\r\n");
    story.forEach((text, index) => {
      if (index === story.length - 1) {
        let cite = document.createElement("cite");
        cite.className = "banner__text__cite";
        cite.textContent = text;
        bannerText.appendChild(cite);
      } else {
        let paragraph = document.createElement("p");
        paragraph.className = "banner__text__paragraph";
        paragraph.textContent = text;
        bannerText.appendChild(paragraph);
      }
    });

    let bannerSelectCircle = document.createElement("div");
    bannerSelectCircle.className = "banner-select__circle";
    bannerSelect.append(bannerSelectCircle);

    banner.appendChild(bannerLink);
    bannerLink.appendChild(bannerImg);
    bannerLink.appendChild(bannerText);
    slide.appendChild(banner);
  });

  slide.appendChild(bannerSelect);

  const banners = document.querySelectorAll(".banner");
  const bannerCircles = document.querySelectorAll(".banner-select__circle");

  banners[0].style.opacity = "100";
  banners[0].style.zIndex = 1;
  bannerCircles[0].style.backgroundColor = "#8b572a";
  let i = 1;
  setInterval(() => {
    if (i < banners.length) {
      banners[i - 1].style.opacity = "0";
      banners[i - 1].style.zIndex = "0";
      banners[i].style.opacity = "100";
      banners[i].style.zIndex = "1";
      bannerCircles[i - 1].style.backgroundColor = "#ffffff";
      bannerCircles[i].style.backgroundColor = "#8b572a";
      i++;
    } else {
      banners[i - 1].style.opacity = "0";
      banners[i - 1].style.zIndex = "0";
      bannerCircles.forEach(
        (bannerCircle) => (bannerCircle.style.backgroundColor = "#ffffff")
      );
      i = 0;
      banners[i].style.opacity = "100";
      banners[i].style.zIndex = "1";
      bannerCircles[i].style.backgroundColor = "#8b572a";
      i++;
    }
  }, 10000);
}
// function for getting marketing campaigns
function getMarketingCampaigns() {
  getData(
    `https://${HOST_NAME}/api/${API_VERSION}/marketing/campaigns`,
    (result) => {
      const marketingCampaigns = result.data;
      renderMarketingCampaigns(marketingCampaigns);
    },
    (error) => {
      console.log(`Error: ${error.status} Error Message: ${error.statusText}`);
    }
  );
}

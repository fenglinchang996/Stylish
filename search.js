// implement search button function
const searchInput = document.querySelector(".search-bar__input");
const searchButton = document.querySelector(".search-bar__btn");
const searchStart = document.querySelector(".search-start");
const searchClose = document.querySelector(".search-close");
const search = document.querySelector(".search");

searchStart.addEventListener("click", () => {
  search.classList.add("mobile-search");
  searchClose.style.display = "inline-block";
});
searchClose.addEventListener("click", () => {
  search.classList.remove("mobile-search");
  searchClose.style.display = "none";
});

// click to search
searchButton.addEventListener("click", () => {
  let searchText = searchInput.value;
  window.location = `./index.html?category=search&searchText=${searchText}`;
});

// enter to search
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    let searchText = searchInput.value;
    window.location = `./index.html?category=search&searchText=${searchText}`;
  }
});

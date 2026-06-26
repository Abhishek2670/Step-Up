const products = [
  {
    id: "road",
    name: "Pulse Road Runner",
    category: "running",
    description: "Light road trainer",
    price: 129,
    badge: "Best seller",
    image: "assets/shoe-road-runner.jpg",
    colors: ["#ffffff", "#ff6f61", "#171717"],
  },
  {
    id: "walker",
    name: "Cloud Daily Walker",
    category: "walking",
    description: "All-day comfort",
    price: 109,
    badge: "Soft ride",
    image: "assets/shoe-daily-walker.jpg",
    colors: ["#142238", "#f0eadc", "#087f83"],
  },
  {
    id: "trail",
    name: "Ridge Trail Force",
    category: "trail",
    description: "Rugged outdoor grip",
    price: 149,
    badge: "Trail ready",
    image: "assets/shoe-trail-force.jpg",
    colors: ["#151515", "#5c6843", "#e56b2f"],
  },
  {
    id: "street",
    name: "Metro Street Low",
    category: "casual",
    description: "Clean leather low-top",
    price: 99,
    badge: "New arrival",
    image: "assets/shoe-street-low.jpg",
    colors: ["#f3ecdd", "#c6ab8d", "#741f2b"],
  },
];

const productsGrid = document.querySelector("#productsGrid");
const searchInput = document.querySelector("#productSearch");
const filterTabs = document.querySelectorAll(".filter-tab");
const cartDrawer = document.querySelector("#cartDrawer");
const cartItems = document.querySelector("#cartItems");
const cartEmpty = document.querySelector("#cartEmpty");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const navLinks = document.querySelector("#navLinks");
const menuToggle = document.querySelector(".menu-toggle");

let activeFilter = "all";
let cart = [];

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const matchesFilter = activeFilter === "all" || product.category === activeFilter;
    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  productsGrid.innerHTML = filteredProducts.length
    ? filteredProducts.map(createProductCard).join("")
    : '<div class="no-results">No shoes match your search.</div>';
}

function createProductCard(product) {
  const swatches = product.colors
    .map((color) => `<span class="swatch" style="background:${color}" aria-hidden="true"></span>`)
    .join("");

  return `
    <article class="product-card">
      <div class="product-media">
        <img src="${product.image}" alt="${product.name}" />
        <span class="product-badge">${product.badge}</span>
      </div>
      <div class="product-body">
        <div class="product-meta">
          <div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
          </div>
          <span class="price">${formatMoney(product.price)}</span>
        </div>
        <div class="swatches" aria-label="Available color accents">${swatches}</div>
        <div class="size-row">
          <label for="size-${product.id}">Size</label>
          <select id="size-${product.id}">
            <option>7</option>
            <option>8</option>
            <option selected>9</option>
            <option>10</option>
            <option>11</option>
          </select>
        </div>
        <button class="product-action" type="button" data-add="${product.id}">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6h15l-1.7 8.4a2 2 0 0 1-2 1.6H9a2 2 0 0 1-2-1.6L5 3H2" />
            <path d="M10 11h6M13 8v6" />
          </svg>
          Add to cart
        </button>
      </div>
    </article>
  `;
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  const size = document.querySelector(`#size-${productId}`)?.value || "9";
  const cartId = `${productId}-${size}`;
  const existingItem = cart.find((item) => item.cartId === cartId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, cartId, size, quantity: 1 });
  }

  renderCart();
  openCart();
}

function renderCart() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = formatMoney(totalPrice);
  cartEmpty.hidden = cart.length > 0;

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <article class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div>
            <h3>${item.name}</h3>
            <p>Size ${item.size} - ${formatMoney(item.price)}</p>
            <div class="cart-item-row">
              <div class="qty-controls" aria-label="Quantity for ${item.name}">
                <button type="button" data-qty="${item.cartId}" data-direction="-1" aria-label="Decrease quantity">-</button>
                <span>${item.quantity}</span>
                <button type="button" data-qty="${item.cartId}" data-direction="1" aria-label="Increase quantity">+</button>
              </div>
              <button class="remove-item" type="button" data-remove="${item.cartId}">Remove</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

productsGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    addToCart(addButton.dataset.add);
  }
});

filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeFilter = tab.dataset.filter;
    filterTabs.forEach((item) => item.classList.toggle("active", item === tab));
    renderProducts();
  });
});

searchInput.addEventListener("input", renderProducts);

document.querySelectorAll("[data-cart-open]").forEach((button) => {
  button.addEventListener("click", openCart);
});

document.querySelectorAll("[data-cart-close]").forEach((button) => {
  button.addEventListener("click", closeCart);
});

cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) {
    closeCart();
  }
});

cartItems.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-qty]");
  const removeButton = event.target.closest("[data-remove]");

  if (quantityButton) {
    const item = cart.find((cartItem) => cartItem.cartId === quantityButton.dataset.qty);
    item.quantity += Number(quantityButton.dataset.direction);
    cart = cart.filter((cartItem) => cartItem.quantity > 0);
    renderCart();
  }

  if (removeButton) {
    cart = cart.filter((cartItem) => cartItem.cartId !== removeButton.dataset.remove);
    renderCart();
  }
});

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
  }
});

renderProducts();
renderCart();

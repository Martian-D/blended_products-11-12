import { CART_KEY, WISHLIST_KEY } from './constants.js';
import { refs } from './refs.js';
import { getFromStorage } from './storage.js';

let loaderTimeout;

export function renderProducts(products) {
  const murkup = products
    .map(
      ({ id, thumbnail, title, brand, category, price }) => `
  <li class="products__item" data-id="${id}">
  <img class="products__image" src="${thumbnail}" alt="${title}"/>
  <p class="products__title">${title}</p>
  <p class="products__brand"><span class="products__brand--bold">Brand:</span>${brand}</p>
  <p class="products__category">Category: ${category}</p>
  <p class="products__price">Price: $${price}</p>
  </li>
    `
    )
    .join('');
  refs.products.insertAdjacentHTML('beforeend', murkup);
}

export function renderCategories(categories) {
  const allCategories = ['ALL', ...categories];
  const murkup = allCategories
    .map((category, idx) => {
      const buttonClass = idx === 0 ? 'categories__btn--active' : '';
      return `<li class="categories__item"><button class="categories__btn ${buttonClass}" type="button">${category}</button></li>`;
    })
    .join('');
  refs.categories.insertAdjacentHTML('beforeend', murkup);
}

export function showLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}
export function hideLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
}
export function clearProducts() {
  refs.products.innerHTML = '';
}
export function showNotFound() {
  refs.notFound.classList.add('not-found--visible');
}
export function hideNotFound() {
  refs.notFound.classList.remove('not-found--visible');
}

export function renderModalProduct(product) {
  const {
    thumbnail,
    title,
    tags,
    description,
    shippingInformation,
    returnPolicy,
    price,
  } = product;
  const murkup = `
    <img class="modal-product__img" src="${thumbnail}" alt="${title}" />
<div class="modal-product__content">
  <p class="modal-product__title">${title}</p>
  <ul class="modal-product__tags">${tags.map(tag => `<li>${tag}</li>`).join('')}</ul>
  <p class="modal-product__description">${description}</p>
  <p class="modal-product__shipping-information">Shipping:${shippingInformation}</p>
  <p class="modal-product__return-policy">Return Policy:${returnPolicy}</p>
  <p class="modal-product__price">Price: $${price}</p>
  <button class="modal-product__buy-btn" type="button">Buy</button>
</div>
    `;
  refs.modalProduct.innerHTML = murkup;
}
export function showLoader() {
  loaderTimeout = setTimeout(() => {
    refs.loader.classList.remove('is-hidden');
  }, 300);
}
export function hideLoader() {
  clearTimeout(loaderTimeout);
  refs.loader.classList.add('is-hidden');
}

export function updateNavCount() {
  const cart = getFromStorage(CART_KEY);
  const wishlist = getFromStorage(WISHLIST_KEY);
  refs.cartCount.textContent = cart.length;
  refs.wishlistCount.textContent = wishlist.length;
  console.log(cart, wishlist);
}

export function updateCartSummary(products) {
  const cartSummaryCount = document.querySelector('[data-count]');
  const cartSummaryPrice = document.querySelector('[data-price]');

  if (!cartSummaryCount || !cartSummaryPrice) return;

  cartSummaryCount.textContent = products.length;
  const total = products.reduce((sum, product) => sum + product.price, 0);
  cartSummaryPrice.textContent = `$${total.toFixed(2)}`;
}

import iziToast from 'izitoast';
import { CART_KEY, WISHLIST_KEY } from './constants.js';
import { openModal, closeModal } from './modal.js';
import { getProductById } from './products-api.js';
import { refs } from './refs.js';
import {
  renderModalProduct,
  updateNavCount,
  showLoader,
  hideLoader,
  updateCartSummary,
} from './render-function.js';
import { getFromStorage, saveToStorage } from './storage.js';
import 'izitoast/dist/css/iziToast.min.css';

let currentProductId = null;
export async function onProductClick(event) {
  const item = event.target.closest('.products__item');
  if (!item) {
    return;
  }
  const id = item.dataset.id;
  showLoader();
  try {
    const data = await getProductById(id);
    currentProductId = data.id;
    const wishlist = getFromStorage(WISHLIST_KEY);
    if (wishlist.includes(String(currentProductId))) {
      refs.wishlistBtn.textContent = 'Remove from Wishlist';
    } else {
      refs.wishlistBtn.textContent = 'Add to Wishlist';
    }
    const cart = getFromStorage(CART_KEY);
    if (cart.includes(String(currentProductId))) {
      refs.cartBtn.textContent = 'Remove from Cart';
    } else {
      refs.cartBtn.textContent = 'Add to Cart';
    }
    openModal();
    renderModalProduct(data);
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

export function onModalCloseBtnClick() {
  closeModal();
}

export function onModalBackdropClick(event) {
  if (event.target === refs.modal) {
    closeModal();
  }
}

export function onWishlistBtnClick() {
  const wishlist = getFromStorage(WISHLIST_KEY);
  const isInWishlist = wishlist.includes(String(currentProductId));
  if (isInWishlist) {
    const update = wishlist.filter(id => id !== String(currentProductId));
    saveToStorage(WISHLIST_KEY, update);

    refs.wishlistBtn.textContent = 'Add to Wishlist';
  } else {
    wishlist.push(String(currentProductId));
    saveToStorage(WISHLIST_KEY, wishlist);
    refs.wishlistBtn.textContent = 'Remove from Wishlist';
  }
  updateNavCount();
}
export async function onCartBtnClick() {
  const cart = getFromStorage(CART_KEY);
  const isInCart = cart.includes(String(currentProductId));
  if (isInCart) {
    const update = cart.filter(id => id !== String(currentProductId));
    saveToStorage(CART_KEY, update);
    refs.cartBtn.textContent = 'Add to Cart';
    if (window.location.pathname.includes('cart')) {
      const card = document.querySelector(`[data-id="${currentProductId}"]`);
      card.remove();
      closeModal();

      const updatedCart = getFromStorage(CART_KEY);
      const promises = updatedCart.map(id => getProductById(id));
      const products = await Promise.all(promises);
      updateCartSummary(products);
    }
  } else {
    cart.push(String(currentProductId));
    saveToStorage(CART_KEY, cart);
    refs.cartBtn.textContent = 'Remove from Cart';
  }
  updateNavCount();
}

import iziToast from 'izitoast';
import { CART_KEY } from './js/constants.js';
import { getProductById } from './js/products-api.js';
import { refs } from './js/refs.js';
import {
  renderProducts,
  updateNavCount,
  updateCartSummary,
} from './js/render-function.js';
import { getFromStorage } from './js/storage.js';
import {
  onProductClick,
  onModalCloseBtnClick,
  onModalBackdropClick,
  onWishlistBtnClick,
  onCartBtnClick,
} from './js/handlers.js';

const cartSummaryCount = document.querySelector('[data-count]');
const cartSummaryPrice = document.querySelector('[data-price]');

async function init() {
  try {
    const ids = getFromStorage(CART_KEY);
    const promises = ids.map(id => getProductById(id));
    const products = await Promise.all(promises);
    renderProducts(products);
    updateCartSummary(products);
    updateNavCount();
  } catch (error) {
    console.log(error);
    iziToast.error({
      message: 'Something went wrong. Please try again.',
      position: 'topRight',
    });
  }
}
init();

const buyBtn = document.querySelector('.cart-summary__btn');
buyBtn.addEventListener('click', () => {
  iziToast.success({
    message:
      'Your order has been successfully placed! Thank you for shopping with us!',
    position: 'topRight',
  });
});
refs.products.addEventListener('click', onProductClick);

refs.modalCloseBtn.addEventListener('click', onModalCloseBtnClick);

refs.modal.addEventListener('click', onModalBackdropClick);

refs.wishlistBtn.addEventListener('click', onWishlistBtnClick);

refs.cartBtn.addEventListener('click', onCartBtnClick);

import iziToast from 'izitoast';
import { WISHLIST_KEY } from './js/constants.js';
import { getProductById } from './js/products-api.js';
import { refs } from './js/refs.js';
import { renderProducts, updateNavCount } from './js/render-function.js';
import { getFromStorage } from './js/storage.js';
import {
  onProductClick,
  onModalCloseBtnClick,
  onModalBackdropClick,
  onWishlistBtnClick,
  onCartBtnClick,
} from './js/handlers.js';

async function init() {
  try {
    const ids = getFromStorage(WISHLIST_KEY);
    const promises = ids.map(id => getProductById(id));
    const products = await Promise.all(promises);
    renderProducts(products);
    updateNavCount();
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again.',
      position: 'topRight',
    });
  }
}
init();

refs.products.addEventListener('click', onProductClick);

refs.modalCloseBtn.addEventListener('click', onModalCloseBtnClick);

refs.modal.addEventListener('click', onModalBackdropClick);

refs.wishlistBtn.addEventListener('click', onWishlistBtnClick);

refs.cartBtn.addEventListener('click', onCartBtnClick);

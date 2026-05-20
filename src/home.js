import {
  getProducts,
  getCategories,
  getProductsByCategory,
  searchProducts,
  getProductById,
} from './js/products-api.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { refs } from './js/refs.js';
import {
  renderProducts,
  renderCategories,
  showLoadMoreBtn,
  hideLoadMoreBtn,
  clearProducts,
  showNotFound,
  hideNotFound,
  renderModalProduct,
  updateNavCount,
} from './js/render-function.js';
import { isLastPage } from './js/helpers.js';
import { openModal, closeModal } from './js/modal.js';
import { CART_KEY, WISHLIST_KEY } from './js/constants.js';
import {
  getFromStorage,
  saveToStorage,
  removeFromStorage,
} from './js/storage.js';
import { showLoader, hideLoader } from './js/render-function.js';
import {
  onProductClick,
  onModalCloseBtnClick,
  onModalBackdropClick,
  onWishlistBtnClick,
  onCartBtnClick,
} from './js/handlers.js';
let currentCategory = null;

let currentPage = 1;
document.addEventListener('DOMContentLoaded', () => {
  updateNavCount();
});
async function init() {
  showLoader();
  try {
    const data = await getProducts(currentPage);
    renderProducts(data.products);
    if (isLastPage(currentPage, data.total)) {
      hideLoadMoreBtn();
    } else {
      showLoadMoreBtn();
    }
    const categories = await getCategories();
    renderCategories(categories);
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

init();

refs.loadMoreBtn.addEventListener('click', async () => {
  refs.loadMoreBtn.disabled = true;
  currentPage += 1;
  showLoader();
  try {
    let data;
    if (currentCategory && currentCategory !== 'ALL') {
      data = await getProductsByCategory(currentCategory, currentPage);
    } else {
      data = await getProducts(currentPage);
    }
    renderProducts(data.products);
    if (isLastPage(currentPage, data.total)) {
      hideLoadMoreBtn();
      iziToast.info({
        message: "You've reached the end of the product list.",
        position: 'topRight',
        maxWidth: '432px',
      });
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    refs.loadMoreBtn.disabled = false;
  }
});

refs.categories.addEventListener('click', async event => {
  const btn = event.target.closest('.categories__btn');
  if (!btn) return;

  const category = event.target.textContent;
  currentCategory = category;
  currentPage = 1;
  clearProducts();
  hideLoadMoreBtn();
  refs.searchInput.value = '';

  document
    .querySelectorAll('.categories__btn')
    .forEach(btn => btn.classList.remove('categories__btn--active'));
  event.target.classList.add('categories__btn--active');
  showLoader();
  try {
    let data;
    if (category === 'ALL') {
      data = await getProducts(currentPage);
    } else {
      data = await getProductsByCategory(category, currentPage);
    }
    renderProducts(data.products);
    if (data.products.length === 0) {
      showNotFound();
    } else {
      hideNotFound();
    }
    if (isLastPage(currentPage, data.total)) {
      hideLoadMoreBtn();
    } else {
      showLoadMoreBtn();
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

refs.searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  const valueForm = event.target.searchValue.value.trim();
  if (!valueForm) {
    return;
  }
  clearProducts();
  hideLoadMoreBtn();
  showLoader();
  try {
    const data = await searchProducts(valueForm);
    renderProducts(data.products);
    if (data.products.length === 0) {
      showNotFound();
    } else {
      hideNotFound();
    }
    if (isLastPage(currentPage, data.total)) {
      hideLoadMoreBtn();
    } else {
      showLoadMoreBtn();
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

refs.searchClearBtn.addEventListener('click', async () => {
  refs.searchInput.value = '';
  currentPage = 1;
  clearProducts();
  hideNotFound();
  hideLoadMoreBtn();
  showLoader();
  try {
    const data = await getProducts(currentPage);
    renderProducts(data.products);
    if (isLastPage(currentPage, data.total)) {
      hideLoadMoreBtn();
    } else {
      showLoadMoreBtn();
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

refs.products.addEventListener('click', onProductClick);

refs.modalCloseBtn.addEventListener('click', onModalCloseBtnClick);

refs.modal.addEventListener('click', onModalBackdropClick);

refs.wishlistBtn.addEventListener('click', onWishlistBtnClick);

refs.cartBtn.addEventListener('click', onCartBtnClick);

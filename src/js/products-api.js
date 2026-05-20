import axios from 'axios';
import { BASE_URL } from './constants.js';

export async function getProducts(page) {
  const res = await axios(
    `${BASE_URL}/products?limit=12&skip=${(page - 1) * 12}`
  );
  return res.data;
}

export async function getCategories() {
  const res = await axios(`${BASE_URL}/products/category-list`);
  return res.data;
}

export async function getProductsByCategory(category, page) {
  const res = await axios(
    `${BASE_URL}/products/category/${category}?limit=12&skip=${(page - 1) * 12}`
  );
  return res.data;
}

export async function searchProducts(query) {
  const res = await axios(`${BASE_URL}/products/search?q=${query}`);
  return res.data;
}
export async function getProductById(id) {
  const res = await axios(`${BASE_URL}/products/${id}`);
  return res.data;
}

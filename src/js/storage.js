export function getFromStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function removeFromStorage(key) {
  localStorage.removeItem(key);
}

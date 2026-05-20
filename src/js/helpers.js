export function isLastPage(currentPage, total) {
  return currentPage * 12 >= total;
}

import { refs } from './refs.js';

export function openModal() {
  refs.modal.classList.add('modal--is-open');
  document.addEventListener('keydown', onEscKeyPress);
  document.body.style.overflow = 'hidden';
}
export function closeModal() {
  refs.modal.classList.remove('modal--is-open');
  document.removeEventListener('keydown', onEscKeyPress);
  document.body.style.overflow = '';
}

export function onEscKeyPress(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
}

import {createElement} from '../render.js';

const createPopupMainContainerTemplate = () => ('<section class="film-details"><div class="film-details__inner"></div></section>');

export default class PopupMainContainerView {
  #element = null;

  get template() {
    return createPopupMainContainerTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

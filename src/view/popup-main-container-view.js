import {createElement} from '../render.js';

const createPopupMainContainerTemplate = () => ('<section class="film-details"><div class="film-details__inner"></div></section>');

export default class PopupMainContainerView {
  getTemplate() {
    return createPopupMainContainerTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

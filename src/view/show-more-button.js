import {createElement} from '../render.js';

const createShowMoreButtonTemplate = () => ('<button class="films-list__show-more">Show more</button>');

export default class ShowMoreButton {
  #element = null;

  get template() {
    return createShowMoreButtonTemplate();
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

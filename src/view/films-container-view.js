import AbstractView from '../framework/view/abstract-view.js';

const createFilmsContainerTemplate = () => ('<section class="films"></section>');

export default class FilmsContainer extends AbstractView {

  get template() {
    return createFilmsContainerTemplate();
  }

}

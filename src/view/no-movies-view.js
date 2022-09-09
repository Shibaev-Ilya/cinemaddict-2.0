import AbstractView from '../framework/view/abstract-view';

const createNoMoviesTemplate = () => ('<h2 class="films-list__title">There are no movies in our database</h2>');

export default class NoMoviesView extends AbstractView {

  get template() {
    return createNoMoviesTemplate();
  }

}

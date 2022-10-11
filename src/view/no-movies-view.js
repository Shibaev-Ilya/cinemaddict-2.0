import AbstractView from '../framework/view/abstract-view';
import {FilterType} from '../filter';

const texts = {
  [FilterType.FILTER_ALL]: 'There are no movies in our database',
  [FilterType.FILTER_WATCHLIST]: 'There are no movies to watch now',
  [FilterType.FILTER_HISTORY]: 'There are no watched movies now',
  [FilterType.FILTER_FAVORITES]: 'There are no favorite movies now',
};

const createNoMoviesTemplate = (filterType) => {
  const text = texts[filterType];
  return `<h2 class="films-list__title">${text}</h2>`;
};

export default class NoMoviesView extends AbstractView {

  #filterType = null;

  constructor (filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoMoviesTemplate(this.#filterType);
  }

}

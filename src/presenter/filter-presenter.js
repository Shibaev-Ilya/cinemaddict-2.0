import FilterView from '../view/filter-view';
import {remove, render} from '../framework/render';
import {FilterType, filter} from '../filter';

export default class FilterPresenter {
  #mainContainer = null;
  #moviesData = null;
  #filterView = null;

  constructor(mainContainer) {
    this.#mainContainer = mainContainer;
  }

  get filters() {
    const movies = this.#moviesData;

    return [
      {
        type: FilterType.FILTER_ALL,
        name: 'All movies',
        count: filter[FilterType.FILTER_ALL](movies).length,
      },
      {
        type: FilterType.FILTER_WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.FILTER_WATCHLIST](movies).length,
      },
      {
        type: FilterType.FILTER_HISTORY,
        name: 'History',
        count: filter[FilterType.FILTER_HISTORY](movies).length,
      },
      {
        type: FilterType.FILTER_FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FILTER_FAVORITES](movies).length,
      },

    ];
  }

  #renderFilter = () => {
    this.#filterView = new FilterView(this.filters);
    render(this.#filterView, this.#mainContainer);
  };

  clearFilter = () => {
    remove(this.#filterView);
  };

  init = (moviesData) => {
    this.#moviesData = moviesData;
    this.#renderFilter();
  };
}

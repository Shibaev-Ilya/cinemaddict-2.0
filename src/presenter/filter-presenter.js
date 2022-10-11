import FilterView from '../view/filter-view';
import {remove, render, replace} from '../framework/render';
import {FilterType, filter} from '../filter';
import {UpdateType} from '../utils';

export default class FilterPresenter {
  #mainContainer = null;
  #moviesModel = null;
  #filterView = null;
  #filterModel = null;

  constructor(mainContainer, filterModel, moviesModel) {
    this.#mainContainer = mainContainer;
    this.#filterModel = filterModel;
    this.#moviesModel = moviesModel;
    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  get filters() {
    const movies = this.#moviesModel.movies;

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

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #renderFilter = () => {
    const prevFilterComponent = this.#filterView;
    this.#filterView = new FilterView(this.filters, this.#filterModel.filter);
    this.#filterView.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterView, this.#mainContainer);
      return;
    }

    replace(this.#filterView, prevFilterComponent);
    remove(prevFilterComponent);

  };

  clearFilter = () => {
    remove(this.#filterView);
  };

  init = () => {
    this.#renderFilter();
  };
}

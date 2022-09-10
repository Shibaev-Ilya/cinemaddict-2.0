import {remove, render} from '../framework/render';
import SortView from '../view/sort-view';

export default class SortPresenter {

  #mainContainer = null;
  #moviesData = null;
  #handleSortTypeChange = null;
  #currentSortType = null;
  #sortView = null;

  constructor (mainContainer, handleSortTypeChange) {
    this.#mainContainer = mainContainer;
    this.#handleSortTypeChange = handleSortTypeChange;
  }

  #renderSort = () => {
    this.#sortView = new SortView(this.#moviesData, this.#currentSortType);
    this.#sortView.setClickSortHandler(this.#handleSortTypeChange);

    render(this.#sortView, this.#mainContainer);
  };

  clearSort = () => {
    remove(this.#sortView);
  };

  init = (moviesData,currentSortType) => {
    this.#moviesData = moviesData;
    this.#currentSortType = currentSortType;
    this.#renderSort();
  };

}

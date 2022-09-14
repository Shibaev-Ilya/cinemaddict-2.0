import AbstractView from '../framework/view/abstract-view';
import {SortType, SortTypeNames} from '../utils';

const createSortItem = (currentSortType) => {
  let list = '';
  for (const item in SortTypeNames) {
    list += `<li><a href="#" data-sort="${item}" class="sort__button ${currentSortType === item ? 'sort__button--active' : ''}">${SortTypeNames[item]}</a></li>`;
  }
  return list;
};

const createSortTemplate = (currentSortType) => (`<ul class="sort js-sort">${ createSortItem(currentSortType) }</ul>`);

export default class SortView extends AbstractView {

  #moviesData = null;
  #currentSortType = SortType.DEFAULT;

  constructor (moviesData, currentSortType) {
    super();
    this.#moviesData = moviesData;
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setClickSortHandler = (callback) => {
    this._callback.clickSort = callback;
    this.element.addEventListener('click', this.#onSortButtonClick);
  };

  #onSortButtonClick = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName !== 'A') {
      return;
    }

    this._callback.clickSort(evt.target.dataset.sort);
  };

}

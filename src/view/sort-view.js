import AbstractView from '../framework/view/abstract-view';
import {SortType} from '../utils';

const createSortTemplate = (currentSortType) => (`<ul class="sort js-sort">
    <li><a href="#" data-sort="${SortType.DEFAULT}" class="sort__button ${currentSortType === SortType.DEFAULT ? 'sort__button--active' : ''}">Sort by default</a></li>
    <li><a href="#" data-sort="${SortType.BY_DATE}" class="sort__button ${currentSortType === SortType.BY_DATE ? 'sort__button--active' : ''}">Sort by date</a></li>
    <li><a href="#" data-sort="${SortType.BY_RATING}" class="sort__button ${currentSortType === SortType.BY_RATING ? 'sort__button--active' : ''}">Sort by rating</a></li>
  </ul>`);

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

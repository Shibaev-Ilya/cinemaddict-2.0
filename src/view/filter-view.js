import AbstractView from '../framework/view/abstract-view';

const createNewFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return (`
    <a href="#"
    class="js-filter-button main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
    data-filter-type="${type}">
    ${name}
    ${type !== 'all' ? `<span class="main-navigation__item-count">${ count }</span>` : ''}
    </a>
  `);
};

const createFilterTemplate = (filters, currentFilterType) => {
  const filterItemsTemplate = filters.reduce((accumulator, filter) => accumulator + createNewFilterItemTemplate(filter, currentFilterType), '');

  return `<nav class="main-navigation">
    ${filterItemsTemplate}
  </nav>`;
};

export default class FilterView extends AbstractView {

  #filters = null;
  #currentFilterType = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.closest('.js-filter-button') === null ) { return; }
    this._callback.filterTypeChange(evt.target.closest('.js-filter-button').dataset.filterType);
  };

}

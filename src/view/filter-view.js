import AbstractView from '../framework/view/abstract-view.js';

const createNewFilterItemTemplate = (filter) => {
  const {type, name, count} = filter;

  return (`
    <a href="#${type}"
    class="main-navigation__item ${type === 'all' ? 'main-navigation__item--active' : ''}"
    data-filter-type="${type}">
    ${name}
    ${type !== 'all' ? `<span class="main-navigation__item-count">${ count }</span>` : ''}
    </a>
  `);
};

const createFilterTemplate = (filters) => {
  const filterItemsTemplate = filters.reduce((accumulator, filter) => accumulator + createNewFilterItemTemplate(filter), '');

  return `<nav class="main-navigation">
    ${filterItemsTemplate}
  </nav>`;
};

export default class FilterView extends AbstractView {

  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }

}

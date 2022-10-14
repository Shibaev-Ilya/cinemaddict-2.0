import AbstractView from '../framework/view/abstract-view';

const createStatisticViewTemplate = (moviesAmount) => (`<p>${moviesAmount} movies inside</p>`);

export default class StatisticView extends AbstractView {

  #moviesAmount = null;

  constructor(movies) {
    super();
    this.#moviesAmount = movies.length;
  }

  get template() {
    return createStatisticViewTemplate(this.#moviesAmount);
  }

}

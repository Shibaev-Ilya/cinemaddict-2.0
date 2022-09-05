import {render} from '../render.js';
import SortView from '../view/sort-view.js';

export default class SortPresenter {

  #mainContainer = null;
  #moviesData = null;

  constructor (mainContainer) {
    this.#mainContainer = mainContainer;
  }

  #renderSort = () => {
    const sortView = new SortView(this.#moviesData);
    render(sortView, this.#mainContainer);
  };

  init = (moviesData) => {
    this.#moviesData = moviesData;
    this.#renderSort();
  };

}

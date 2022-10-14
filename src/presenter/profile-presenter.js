import {render, replace} from '../framework/render';
import ProfileView from '../view/profile-view';
import StatisticView from '../view/statistic-view';

export default class ProfilePresenter {

  #profileView = null;
  #headerContainer = null;
  #statisticView = null;
  #footerStatisticContainer = null;
  #movieModel = null;

  constructor(headerContainer, footerStatisticContainer, movieModel) {
    this.#headerContainer = headerContainer;
    this.#footerStatisticContainer = footerStatisticContainer;
    this.#movieModel = movieModel;

    this.#movieModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const prevProfileView = this.#profileView;

    this.#profileView = new ProfileView(this.#movieModel);
    this.#statisticView = new StatisticView(this.#movieModel.movies);

    if (prevProfileView) {
      replace(this.#profileView, prevProfileView);
      return;
    }

    render(this.#statisticView, this.#footerStatisticContainer);
    render(this.#profileView, this.#headerContainer);
  };

  #handleModelEvent = () => {
    this.init();
  };
}

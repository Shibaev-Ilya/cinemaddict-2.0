import FilmCardView from '../view/film-card-view.js';
import PopupPresenter from './popup-presenter.js';
import {render, remove} from '../framework/render.js';
import {replace} from '../framework/render';

export default class FilmPresenter {

  #commentsModel = null;
  #filmsListContainer = null;
  #movie = null;
  #movieComponent = null;
  #changeData = null;
  #popupPresenter = null;
  #movieComments = null;

  constructor (filmsListContainer, changeData) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
  }

  #handleWatchlistClick = () => {
    this.#changeData({ ...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist} });
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeData({ ...this.#movie, userDetails: {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched} });
  };

  #handleFavoriteWatchedClick = () => {
    this.#changeData({ ...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite} });
  };

  #handlerCardClick = () => {
    this.#movieComments = this.#commentsModel.getComments(this.#movie.id);
    this.#popupPresenter = new PopupPresenter(this.#handleWatchlistClick, this.#handleAlreadyWatchedClick, this.#handleFavoriteWatchedClick);
    this.#popupPresenter.openPopup(this.#movie, this.#movieComments);
  };


  init = (movie, commentsModel) => {
    this.#movie = movie;
    this.#commentsModel = commentsModel;

    const prevMovieComponent = this.#movieComponent;

    this.#movieComponent = new FilmCardView(this.#movie);

    this.#movieComponent.setClickWatchlistHandler(this.#handleWatchlistClick);
    this.#movieComponent.setClickAlreadyWatchedHandler(this.#handleAlreadyWatchedClick);
    this.#movieComponent.setClickFavoriteHandler(this.#handleFavoriteWatchedClick);
    this.#movieComponent.setClickCardHandler(this.#handlerCardClick);

    if (this.#popupPresenter !== null && this.#popupPresenter.isRendered) {
      this.#popupPresenter.init(this.#movie, this.#movieComments);
    }

    if (prevMovieComponent === null ) {
      render(this.#movieComponent, this.#filmsListContainer);
      return;
    }

    if (this.#filmsListContainer.contains(prevMovieComponent.element)) {
      replace(this.#movieComponent, prevMovieComponent);
    }

    remove(prevMovieComponent);

  };

  destroy = () => {
    remove(this.#movieComponent);
  };

}

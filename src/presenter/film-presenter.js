import FilmCardView from '../view/film-card-view';
import PopupPresenter from './popup-presenter';
import {render, remove} from '../framework/render';
import {replace} from '../framework/render';
import {UserAction, UpdateType} from '../utils';

export default class FilmPresenter {

  #comments = null;
  #filmsListContainer = null;
  #movie = null;
  #movieComponent = null;
  #changeData = null;
  #popupPresenter = null;

  constructor (filmsListContainer, changeData) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
  }

  #handleWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      { ...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist} }
    );
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      { ...this.#movie, userDetails: {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched} }
    );
  };

  #handleFavoriteWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      { ...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite} }
    );
  };

  #handleDeleteClick = (commentId) => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {
        movie: this.#movie,
        newComments: this.#comments.filter( (comment) => comment.id !== commentId),

      }
    );
  };

  #handlerCardClick = () => {
    this.#popupPresenter = new PopupPresenter(this.#handleWatchlistClick, this.#handleAlreadyWatchedClick, this.#handleFavoriteWatchedClick, this.#handleDeleteClick);
    this.#popupPresenter.openPopup(this.#movie, this.#comments);
  };


  init = (movie, comments) => {
    this.#movie = movie;
    this.#comments = comments;

    const prevMovieComponent = this.#movieComponent;

    this.#movieComponent = new FilmCardView(this.#movie);

    this.#movieComponent.setClickWatchlistHandler(this.#handleWatchlistClick);
    this.#movieComponent.setClickAlreadyWatchedHandler(this.#handleAlreadyWatchedClick);
    this.#movieComponent.setClickFavoriteHandler(this.#handleFavoriteWatchedClick);
    this.#movieComponent.setClickCardHandler(this.#handlerCardClick);

    if (this.#popupPresenter !== null && this.#popupPresenter.isRendered) {
      this.#popupPresenter.init(this.#movie, this.#comments);
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

import FilmCardView from '../view/film-card-view';
import {render, remove} from '../framework/render';
import {replace} from '../framework/render';
import {UserAction, UpdateType} from '../utils';
import {FilterType} from '../filter';

export default class FilmPresenter {

  #filmsListContainer = null;
  #movie = null;
  #movieComponent = null;
  #changeData = null;
  #popupPresenter = null;
  #filterModel = null;

  constructor(filmsListContainer, changeData, filterModel, popupPresenter) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
    this.#filterModel = filterModel;
    this.#popupPresenter = popupPresenter;
  }

  shakeButtons = () => {
    this.#movieComponent.shake();
  };

  #handleFilmWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      (this.#filterModel.filter !== FilterType.FILTER_ALL ? UpdateType.MINOR : UpdateType.PATCH),
      {...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist}}
    );
  };

  #handleFilmAlreadyWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      (this.#filterModel.filter !== FilterType.FILTER_ALL ? UpdateType.MINOR : UpdateType.PATCH),
      {
        ...this.#movie,
        userDetails: {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched}
      }
    );
  };

  #handleFilmFavoriteWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      (this.#filterModel.filter !== FilterType.FILTER_ALL ? UpdateType.MINOR : UpdateType.PATCH),
      {...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite}}
    );
  };

  #handlerCardClick = () => {
    this.#popupPresenter.openNewPopup(this.#movie);
  };

  init = (movie) => {
    this.#movie = movie;

    const prevMovieComponent = this.#movieComponent;

    this.#movieComponent = new FilmCardView(this.#movie);

    this.#movieComponent.setClickWatchlistHandler(this.#handleFilmWatchlistClick);
    this.#movieComponent.setClickAlreadyWatchedHandler(this.#handleFilmAlreadyWatchedClick);
    this.#movieComponent.setClickFavoriteHandler(this.#handleFilmFavoriteWatchedClick);
    this.#movieComponent.setClickCardHandler(this.#handlerCardClick);

    if (prevMovieComponent === null) {
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

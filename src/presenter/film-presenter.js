import FilmCardView from '../view/film-card-view';
import PopupPresenter from './popup-presenter';
import {render, remove} from '../framework/render';
import {replace} from '../framework/render';
import {UserAction, UpdateType} from '../utils';
import {FilterType} from '../filter';

export default class FilmPresenter {

  #comments = null;
  #filmsListContainer = null;
  #movie = null;
  #movieComponent = null;
  #changeData = null;
  #popupPresenter = null;
  #filterModel = null;

  constructor (filmsListContainer, changeData, filterModel) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
    this.#filterModel = filterModel;
  }

  #handleWatchlistClick = () => {
    if (this.#filterModel.filter !== FilterType.FILTER_ALL) {
      this.#changeData(
        UserAction.UPDATE_MOVIE,
        UpdateType.MINOR,
        { ...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist} }
      );
      return;
    }
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      { ...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist} }
    );
  };

  #handleAlreadyWatchedClick = () => {
    if (this.#filterModel.filter !== FilterType.FILTER_ALL) {
      this.#changeData(
        UserAction.UPDATE_MOVIE,
        UpdateType.MINOR,
        { ...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist} }
      );
      return;
    }
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      { ...this.#movie, userDetails: {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched} }
    );
  };

  #handleFavoriteWatchedClick = () => {
    if (this.#filterModel.filter !== FilterType.FILTER_ALL) {
      this.#changeData(
        UserAction.UPDATE_MOVIE,
        UpdateType.MINOR,
        { ...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist} }
      );
      return;
    }
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      { ...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite} }
    );
  };

  #handleDeleteClick = (commentId) => {
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      {
        newComments: this.#comments.filter( (comment) => comment.id !== commentId),
        movie: {...this.#movie, comments:this.#comments.filter( (comment) => comment.id !== commentId).map( (element) => element.id)},
      }
    );
  };

  #handleAddCommentKeydown = (newComment) => {
    this.#comments.push(newComment);
    const newCommentsData = this.#comments;

    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {
        newComments: newCommentsData,
        movie: {...this.#movie, comments: newCommentsData.map( (element) => element.id)},
      }
    );
  };

  #handlerCardClick = () => {
    this.#popupPresenter = new PopupPresenter(this.#handleWatchlistClick,
      this.#handleAlreadyWatchedClick,
      this.#handleFavoriteWatchedClick,
      this.#handleDeleteClick,
      this.#handleAddCommentKeydown);
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

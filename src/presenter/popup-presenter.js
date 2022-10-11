import {render, RenderPosition} from '../framework/render';
import PopupMainContainerView from '../view/popup-main-container-view';
import PopupTopContainerView from '../view/popup-top-container-view';
import PopupCommentsContainerView from '../view/popup-comments-container-view';
import PopupControlsView from '../view/popup-contols-view';
import {FilterType} from '../filter';
import {UpdateType, UserAction} from '../utils';

export default class PopupPresenter {
  #popupMainContainerView = null;
  #popupMainContainerInner = null;
  #footerContainer = null;
  #popupTopContainerView = null;
  #popupControlsView = null;
  #popupCommentsContainerView = null;
  #movie = null;
  #comments = null;
  #filterModel = null;
  #movieModel = null;
  #commentsModel = null;

  constructor(movieModel, commentsModel, filterModel) {
    this.#movieModel = movieModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#movieModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleCommentModelEvent);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#movieModel.updateMovie(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#movieModel.updateMovie(updateType, update.movie);
        this.#commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#movieModel.updateMovie(updateType, update.movie);
        this.#commentsModel.deleteComment(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    const popup = document.querySelector('.film-details');
    if (popup !== null) {
      this.init(data, this.#commentsModel.getComments(data.id));
    }
  };

  #handleCommentModelEvent = (updateType, data) => {
    const popup = document.querySelector('.film-details');
    if (popup !== null) {
      this.init(data.movie, this.#commentsModel.getComments(data.movie.id));
    }
  };

  #handleWatchlistClick = () => {
    if (this.#filterModel.filter !== FilterType.FILTER_ALL) {
      this.#handleViewAction(
        UserAction.UPDATE_MOVIE,
        UpdateType.MINOR,
        { ...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist} }
      );
      return;
    }
    this.#handleViewAction(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      { ...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist} }
    );
  };

  #handleAlreadyWatchedClick = () => {
    if (this.#filterModel.filter !== FilterType.FILTER_ALL) {
      this.#handleViewAction(
        UserAction.UPDATE_MOVIE,
        UpdateType.MINOR,
        { ...this.#movie, userDetails: {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched} }
      );
      return;
    }
    this.#handleViewAction(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      { ...this.#movie, userDetails: {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched} }
    );
  };

  #handleFavoriteWatchedClick = () => {
    if (this.#filterModel.filter !== FilterType.FILTER_ALL) {
      this.#handleViewAction(
        UserAction.UPDATE_MOVIE,
        UpdateType.MINOR,
        { ...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite} }
      );
      return;
    }
    this.#handleViewAction(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      { ...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite} }
    );
  };

  #handleDeleteClick = (commentId) => {
    this.#handleViewAction(
      UserAction.DELETE_COMMENT,
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

    this.#handleViewAction(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      {
        newComments: newCommentsData,
        movie: {...this.#movie, comments: newCommentsData.map( (element) => element.id)},
      }
    );
  };

  #closeOpenedPopup = () => {
    const popup = document.querySelector('.film-details');
    if(popup !== null) {
      popup.remove();
    }
  };

  #closePopup = () => {
    document.removeEventListener('keydown', this.#onDocumentKeydown);
    this.#closeOpenedPopup();
    this.#popupMainContainerView.element.remove();
    document.body.classList.remove('hide-overflow');
  };

  #onButtonCloseClick = () => {
    this.#closePopup();
  };

  #onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
    }
  };

  init = (movie, comments) => {
    this.#closeOpenedPopup();

    this.#movie = movie;
    this.#comments = comments;
    this.#popupMainContainerView = new PopupMainContainerView;
    this.#popupTopContainerView = new PopupTopContainerView(this.#movie);
    this.#popupControlsView = new PopupControlsView(this.#movie);
    this.#popupCommentsContainerView = new PopupCommentsContainerView(this.#comments);

    this.#popupMainContainerInner = this.#popupMainContainerView.element.querySelector('.film-details__inner');
    this.#footerContainer = document.querySelector('.footer');

    this.#popupTopContainerView.setClickCloseButtonHandler(this.#onButtonCloseClick);

    this.#popupControlsView.setClickWatchlistHandler(this.#handleWatchlistClick);
    this.#popupControlsView.setClickAlreadyWatchedHandler(this.#handleAlreadyWatchedClick);
    this.#popupControlsView.setClickFavoriteHandler(this.#handleFavoriteWatchedClick);

    this.#popupCommentsContainerView.setDeleteCommentHandler(this.#handleDeleteClick);
    this.#popupCommentsContainerView.setAddCommentHandlers(this.#handleAddCommentKeydown);

    document.addEventListener('keydown', this.#onDocumentKeydown);
    document.body.classList.add('hide-overflow');

    render(this.#popupMainContainerView, this.#footerContainer, RenderPosition.AFTEREND);
    render(this.#popupTopContainerView, this.#popupMainContainerInner);
    render(this.#popupCommentsContainerView, this.#popupMainContainerInner);
    render(this.#popupControlsView, this.#popupTopContainerView.element);

  };

}

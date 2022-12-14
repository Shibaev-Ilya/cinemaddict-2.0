import {render, RenderPosition, replace} from '../framework/render';
import PopupMainContainerView from '../view/popup-main-container-view';
import PopupTopContainerView from '../view/popup-top-container-view';
import PopupCommentsContainerView from '../view/popup-comments-container-view';
import PopupControlsView from '../view/popup-contols-view';
import {FilterType} from '../filter';
import {UpdateType, UserAction} from '../utils';
import LoadingView from '../view/loading-view';
import PopupCommentsListView from '../view/popup-comments-list-view';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import PopupCommentsFormView from '../view/popup-comments-form-view';

const TimeLimit = {
  LOWER_LIMIT: 0,
  UPPER_LIMIT: 0,
};

export default class PopupPresenter {
  #loadingComponent = new LoadingView();
  #popupMainContainerView = null;
  #popupMainContainerInner = null;
  #footerContainer = null;
  #popupTopContainerView = null;
  #popupControlsView = null;
  #popupCommentsContainerView = null;
  #popupCommentsListView = null;
  #popupCommentsFormView = null;
  #movie = null;
  #comments = null;
  #filterModel = null;
  #movieModel = null;
  #commentsModel = null;
  #isRendered = false;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(movieModel, commentsModel, filterModel) {
    this.#movieModel = movieModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#movieModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleCommentModelEvent);
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        try {
          await this.#movieModel.updateMovie(updateType, update);
        } catch (err) {
          this.#popupControlsView.shake();
        }
        break;
      case UserAction.ADD_COMMENT:
        try {
          this.#popupCommentsFormView.updateElement({isDisabled: true, 'comment': update.newComments.comment, 'emotion': update.newComments.emotion});
          await this.#commentsModel.addComment(updateType, update);
          await this.#movieModel.updateMovie(updateType, update.movie);
        } catch (err) {
          this.#popupCommentsFormView.updateElement({isDisabled: false, 'comment': update.newComments.comment, 'emotion': update.newComments.emotion});
          this.#popupCommentsFormView.shake();
        }
        break;
      case UserAction.DELETE_COMMENT:
        try {
          await this.#commentsModel.deleteComment(updateType, update);
          await this.#movieModel.updateMovie(updateType, update.movie);
        } catch (err) {
          this.#popupCommentsListView.shake();
          this.#popupCommentsListView.changeButtonText();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    this.#isRendered = true;
    switch (updateType) {
      case UpdateType.PATCH:
        this.init(data);
        break;
      case UpdateType.MINOR:
        this.init(data);
        break;
    }
    this.#isRendered = false;
  };

  #handleCommentModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.COMMENT_INIT:
        this.#comments = data;
        this.#popupCommentsListView = new PopupCommentsListView(this.#comments);
        this.#popupCommentsListView.setDeleteCommentHandler(this.#handleDeleteClick);
        replace(this.#popupCommentsListView, this.#loadingComponent);
        break;
      case UpdateType.PATCH:
      case UpdateType.MINOR: {
        this.#comments = data.newComments ? data.newComments : data.comments;
        const commentsListView = new PopupCommentsListView(this.#comments);
        replace(commentsListView, this.#popupCommentsListView);
        this.#popupCommentsFormView.updateElement({isDisabled: false, 'comment': null, 'emotion': null});
        this.#popupCommentsListView = commentsListView;
        this.#popupCommentsListView.setDeleteCommentHandler(this.#handleDeleteClick);
      }
        break;
    }
  };

  #handleWatchlistClick = () => {
    if (this.#filterModel.filter !== FilterType.FILTER_ALL) {
      this.#handleViewAction(
        UserAction.UPDATE_MOVIE,
        UpdateType.MINOR,
        {...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist}}
      );
      return;
    }
    this.#handleViewAction(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      {...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist}}
    );
  };

  #handleAlreadyWatchedClick = () => {
    if (this.#filterModel.filter !== FilterType.FILTER_ALL) {
      this.#handleViewAction(
        UserAction.UPDATE_MOVIE,
        UpdateType.MINOR,
        {
          ...this.#movie,
          userDetails: {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched}
        }
      );
      return;
    }
    this.#handleViewAction(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      {
        ...this.#movie,
        userDetails: {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched}
      }
    );
  };

  #handleFavoriteWatchedClick = () => {
    if (this.#filterModel.filter !== FilterType.FILTER_ALL) {
      this.#handleViewAction(
        UserAction.UPDATE_MOVIE,
        UpdateType.MINOR,
        {...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite}}
      );
      return;
    }
    this.#handleViewAction(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      {...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite}}
    );
  };

  #handleDeleteClick = (commentId) => {
    this.#handleViewAction(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {
        deletedCommentId: commentId,
        newComments: this.#comments.filter((comment) => comment.id !== commentId),
        movie: {
          ...this.#movie,
          comments: this.#comments.filter((comment) => comment.id !== commentId).map((element) => element.id)
        },
      }
    );
  };

  #handleAddCommentKeydown = (newComment) => {
    this.#handleViewAction(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      {
        newComments: newComment,
        movie: {...this.#movie},
      }
    );
  };

  #closeOpenedPopup = () => {
    const popup = document.querySelector('.film-details');
    if (popup !== null) {
      popup.remove();
      this.#isRendered = false;
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

  openNewPopup = (movie) => {
    this.#closeOpenedPopup();

    this.init(movie);
    this.#commentsModel.init(this.#movie.id);
    this.#isRendered = true;
    document.addEventListener('keydown', this.#onDocumentKeydown);
    document.body.classList.add('hide-overflow');
  };

  init = (movie) => {
    this.#movie = movie;
    const prevPopupControlsView = this.#popupControlsView;
    const prevPopupCommentsFormView = this.#popupCommentsFormView;

    this.#popupMainContainerView = new PopupMainContainerView;
    this.#popupTopContainerView = new PopupTopContainerView(this.#movie);

    this.#popupControlsView = new PopupControlsView(this.#movie);
    this.#popupCommentsContainerView = new PopupCommentsContainerView;

    this.#popupMainContainerInner = this.#popupMainContainerView.element.querySelector('.film-details__inner');
    this.#footerContainer = document.querySelector('.footer');

    this.#popupTopContainerView.setClickCloseButtonHandler(this.#onButtonCloseClick);

    this.#popupControlsView.setClickWatchlistHandler(this.#handleWatchlistClick);
    this.#popupControlsView.setClickAlreadyWatchedHandler(this.#handleAlreadyWatchedClick);
    this.#popupControlsView.setClickFavoriteHandler(this.#handleFavoriteWatchedClick);

    if (!this.#isRendered) {
      this.#popupCommentsFormView = new PopupCommentsFormView;
      this.#popupCommentsFormView.setAddCommentHandlers(this.#handleAddCommentKeydown);

      render(this.#popupMainContainerView, this.#footerContainer, RenderPosition.AFTEREND);
      render(this.#popupTopContainerView, this.#popupMainContainerInner);
      render(this.#popupCommentsContainerView, this.#popupMainContainerInner);
      render(this.#popupControlsView, this.#popupTopContainerView.element);
      render(this.#loadingComponent, this.#popupCommentsContainerView.element.querySelector('.js-comments-list-wrap'), RenderPosition.AFTERBEGIN);
      render(this.#popupCommentsFormView, this.#popupCommentsContainerView.element.querySelector('.js-comments-list-wrap'));
      return;
    }

    if (prevPopupControlsView && this.#isRendered) {
      replace(this.#popupControlsView, prevPopupControlsView);
    }
    if (prevPopupCommentsFormView && this.#isRendered) {
      this.#popupCommentsFormView.updateElement({isDisabled: false});
    }

  };

}

import {remove, replace, render, RenderPosition} from '../framework/render';
import PopupMainContainerView from '../view/popup-main-container-view';
import PopupTopContainerView from '../view/popup-top-container-view';
import PopupCommentsContainerView from '../view/popup-comments-container-view';
import PopupControlsView from '../view/popup-contols-view';

export default class PopupPresenter {
  #popupMainContainerView = null;
  #popupMainContainerInner = null;
  #footerContainer = null;
  #popupTopContainerView = null;
  #popupControlsView = null;
  #popupCommentsContainerView = null;
  #movie = null;
  #comments = null;
  #handleWatchlistClick = null;
  #handleAlreadyWatchedClick = null;
  #handleFavoriteWatchedClick = null;
  #handleDeleteClick = null;
  isRendered = false;

  constructor(handleWatchlistClick, handleAlreadyWatchedClick, handleFavoriteWatchedClick, handleDeleteClick) {
    this.#handleWatchlistClick = handleWatchlistClick;
    this.#handleAlreadyWatchedClick = handleAlreadyWatchedClick;
    this.#handleFavoriteWatchedClick = handleFavoriteWatchedClick;
    this.#handleDeleteClick = handleDeleteClick;
  }

  #renderPopup = () => {

    this.#popupMainContainerInner = this.#popupMainContainerView.element.querySelector('.film-details__inner');
    this.#footerContainer = document.querySelector('.footer');

    render(this.#popupMainContainerView, this.#footerContainer, RenderPosition.AFTEREND);
    render(this.#popupTopContainerView, this.#popupMainContainerInner);
    render(this.#popupCommentsContainerView, this.#popupMainContainerInner);
    render(this.#popupControlsView, this.#popupTopContainerView.element);
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
    this.isRendered = false;
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
    const prevPopupControlsComponent = this.#popupControlsView;
    const prevPopupCommentsComponent = this.#popupCommentsContainerView;

    this.#movie = movie;
    this.#comments = comments;
    this.#popupMainContainerView = new PopupMainContainerView;
    this.#popupTopContainerView = new PopupTopContainerView(this.#movie);
    this.#popupControlsView = new PopupControlsView(this.#movie);
    this.#popupCommentsContainerView = new PopupCommentsContainerView(this.#comments);

    this.#popupTopContainerView.setClickCloseButtonHandler(this.#onButtonCloseClick);

    this.#popupControlsView.setClickWatchlistHandler(this.#handleWatchlistClick);
    this.#popupControlsView.setClickAlreadyWatchedHandler(this.#handleAlreadyWatchedClick);
    this.#popupControlsView.setClickFavoriteHandler(this.#handleFavoriteWatchedClick);

    this.#popupCommentsContainerView.setDeleteCommentHandler(this.#handleDeleteClick);

    document.addEventListener('keydown', this.#onDocumentKeydown);
    document.body.classList.add('hide-overflow');

    if (this.isRendered) {
      replace(this.#popupControlsView, prevPopupControlsComponent);
      replace(this.#popupCommentsContainerView, prevPopupCommentsComponent);
      remove(prevPopupControlsComponent);
      remove(prevPopupCommentsComponent);
    }

  };

  openPopup = (movie, comments) => {
    this.init(movie, comments);

    this.#closeOpenedPopup();
    this.#renderPopup();
    this.isRendered = true;
  };

}

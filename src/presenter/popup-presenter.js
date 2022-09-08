import {remove, replace, render, RenderPosition} from '../framework/render.js';
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
  isRendered = false;

  constructor(handleWatchlistClick, handleAlreadyWatchedClick, handleFavoriteWatchedClick) {
    this.#handleWatchlistClick = handleWatchlistClick;
    this.#handleAlreadyWatchedClick = handleAlreadyWatchedClick;
    this.#handleFavoriteWatchedClick = handleFavoriteWatchedClick;
  }

  #renderPopup = () => {

    this.#popupMainContainerInner = this.#popupMainContainerView.element.querySelector('.film-details__inner');
    this.#footerContainer = document.querySelector('.footer');

    render(this.#popupMainContainerView, this.#footerContainer, RenderPosition.AFTEREND);
    render(this.#popupTopContainerView, this.#popupMainContainerInner);
    render(this.#popupCommentsContainerView, this.#popupMainContainerInner);
    render(this.#popupControlsView, this.#popupTopContainerView.element);
  };

  #closePopup = () => {
    document.removeEventListener('keydown', this.#onDocumentKeydown);
    console.log(this.#popupMainContainerView.element);
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

  #closeOpenedPopup = () => {
    const popup = document.querySelector('.film-details');
    if(popup !== null) {
      popup.remove();
    }
  };

  init = (movie, comments) => {

    const prevPopupControlsComponent = this.#popupControlsView;

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

    document.addEventListener('keydown', this.#onDocumentKeydown);
    document.body.classList.add('hide-overflow');

    if (prevPopupControlsComponent === null ) {
      return;
    }

    if (this.isRendered) {
      replace(this.#popupControlsView, prevPopupControlsComponent);
      remove(prevPopupControlsComponent);
    }

  };

  openPopup = (movie, comments) => {
    this.init(movie, comments);

    this.#closeOpenedPopup();
    this.#renderPopup();
    this.isRendered = true;
  }

}

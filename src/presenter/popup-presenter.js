import {render, RenderPosition} from '../render';
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

  constructor(movie, comments) {
    this.#movie = movie;
    this.#comments = comments;

    this.#popupTopContainerView = new PopupTopContainerView(this.#movie);
    this.#popupControlsView = new PopupControlsView(this.#movie.userDetails);
    this.#popupCommentsContainerView = new PopupCommentsContainerView(this.#comments);
  }

  #renderPopup = () => {
    this.#popupMainContainerView = new PopupMainContainerView;
    this.#popupMainContainerInner = this.#popupMainContainerView.element.querySelector('.film-details__inner');
    this.#footerContainer = document.querySelector('.footer');

    render(this.#popupMainContainerView, this.#footerContainer, RenderPosition.AFTEREND);
    render(this.#popupTopContainerView, this.#popupMainContainerInner);
    render(this.#popupCommentsContainerView, this.#popupMainContainerInner);
    render(this.#popupControlsView, this.#popupTopContainerView.element);
  };

  #closePopup = () => {
    document.removeEventListener('keydown', this.#onDocumentKeydown);
    this.#popupMainContainerView.element.remove();
    document.body.classList.remove('hide-overflow');
  };

  #onClickButtonClose = () => {
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

  openPopup = () => {
    const buttonClose = this.#popupTopContainerView.element.querySelector('.js-button-close');

    this.#closeOpenedPopup();
    buttonClose.addEventListener('click', this.#onClickButtonClose);
    document.addEventListener('keydown', this.#onDocumentKeydown);
    document.body.classList.add('hide-overflow');

    this.#renderPopup();
  };

}

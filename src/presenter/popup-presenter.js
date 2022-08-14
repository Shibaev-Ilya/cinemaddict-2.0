import {render, RenderPosition} from '../render';
import PopupMainContainerView from '../view/popup-main-container-view';
import PopupTopContainerView from '../view/popup-top-container-view';
import PopupCommentsContainerView from '../view/popup-comments-container-view';
import PopupControlsView from '../view/popup-contols-view';

export default class PopupPresenter {

  init = (movie, comments) => {
    this.popupTopContainerView = new PopupTopContainerView(movie);
    this.popupControlsView = new PopupControlsView(movie.userDetails);
    this.popupCommentsContainerView = new PopupCommentsContainerView(comments);

    this.renderPopup();
  };

  renderPopup = () => {
    this.popupMainContainerView = new PopupMainContainerView;
    this.popupMainContainerInner = this.popupMainContainerView.getElement().querySelector('.film-details__inner');
    this.footerContainer = document.querySelector('.footer');

    render(this.popupMainContainerView, this.footerContainer, RenderPosition.AFTEREND);
    render(this.popupTopContainerView, this.popupMainContainerInner);
    render(this.popupCommentsContainerView, this.popupMainContainerInner);
    render(this.popupControlsView, this.popupTopContainerView.getElement());
  };

}

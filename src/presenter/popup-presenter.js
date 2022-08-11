import {render, RenderPosition} from '../render';
import PopupMainContainerView from '../view/popup-main-container-view';
import PopupTopContainerView from '../view/popup-top-container-view';
import PopupCommentsContainerView from '../view/popup-comments-container-view';
import PopupControlsView from '../view/popup-contols-view';

export default class PopupPresenter {

  popupMainContainerView = new PopupMainContainerView;
  popupTopContainerView = new PopupTopContainerView;
  popupCommentsContainerView = new PopupCommentsContainerView;
  popupControlsView = new PopupControlsView;


  init = () => {
    const popupMainContainerInner = this.popupMainContainerView.getElement().querySelector('.film-details__inner');
    const footerContainer = document.querySelector('.footer');

    render(this.popupMainContainerView, footerContainer, RenderPosition.AFTEREND);
    render(this.popupTopContainerView, popupMainContainerInner);
    render(this.popupCommentsContainerView, popupMainContainerInner);
    render(this.popupControlsView, this.popupTopContainerView.getElement());
  };
}

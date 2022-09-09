import AbstractView from '../framework/view/abstract-view';


const createPopupMainContainerTemplate = () => ('<section class="film-details"><div class="film-details__inner"></div></section>');

export default class PopupMainContainerView extends AbstractView {

  get template() {
    return createPopupMainContainerTemplate();
  }

}

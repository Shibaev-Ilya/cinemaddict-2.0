import AbstractView from '../framework/view/abstract-view';

const createPopupCommentsContainerTemplate = () => (`
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap js-comments-list-wrap">
      </section>
    </div>
`);

export default class PopupCommentsContainerView extends AbstractView {

  get template() {
    return createPopupCommentsContainerTemplate();
  }

}

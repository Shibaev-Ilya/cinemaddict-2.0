import AbstractView from '../framework/view/abstract-view.js';

const createPopupControlsTemplate = (userDetails) => {
  const getActiveClass = (data) => data ? 'film-details__control-button--active' : '';
  return (`
      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${getActiveClass(userDetails.watchlist)}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${getActiveClass(userDetails.alreadyWatched)}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${getActiveClass(userDetails.favorite)}" id="favorite" name="favorite">Add to favorites</button>
      </section>
`);
};

export default class PopupControlsView extends AbstractView {
  #userDetails = null;

  constructor(userDetails) {
    super();
    this.#userDetails = userDetails;
  }

  get template() {
    return createPopupControlsTemplate(this.#userDetails);
  }

}

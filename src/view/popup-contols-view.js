import AbstractView from '../framework/view/abstract-view';

const createPopupControlsTemplate = (userDetails) => {
  const getActiveClass = (data) => data ? 'film-details__control-button--active' : '';
  return (`
<section class="film-details__controls">
  <button type="button" class="film-details__control-button film-details__control-button--watchlist 
  js-add-to-watchlist ${getActiveClass(userDetails.watchlist)}" id="watchlist" name="watchlist">Add to watchlist</button>
  
  <button type="button" class="film-details__control-button film-details__control-button--watched 
  js-mark-as-watched ${getActiveClass(userDetails.alreadyWatched)}" id="watched" name="watched">Already watched</button>
  
  <button type="button" class="film-details__control-button film-details__control-button--favorite 
  js-favorite ${getActiveClass(userDetails.favorite)}" id="favorite" name="favorite">Add to favorites</button>
</section>
`);
};

export default class PopupControlsView extends AbstractView {
  #userDetails = null;

  constructor(movie) {
    super();
    this.#userDetails = movie.userDetails;
  }

  get template() {
    return createPopupControlsTemplate(this.#userDetails);
  }

  setClickWatchlistHandler = (callback) => {
    this._callback.watchlist = callback;
    this.element.querySelector('.js-add-to-watchlist').addEventListener('click', this.#onWatchlistClick);
  };

  #onWatchlistClick = (evt) => {
    evt.preventDefault();
    this._callback.watchlist();
  };

  setClickAlreadyWatchedHandler = (callback) => {
    this._callback.alreadyWatched = callback;
    this.element.querySelector('.js-mark-as-watched').addEventListener('click', this.#onAlreadyWatchedClick);
  };

  #onAlreadyWatchedClick = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatched();
  };

  setClickFavoriteHandler = (callback) => {
    this._callback.favorite = callback;
    this.element.querySelector('.js-favorite').addEventListener('click', this.#onFavoriteClick);
  };

  #onFavoriteClick = (evt) => {
    evt.preventDefault();
    this._callback.favorite();
  };

}

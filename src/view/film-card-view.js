import {humanizeDate, minutesToHours} from '../utils';
import AbstractView from '../framework/view/abstract-view';

const MAX_TEXT_LENGTH = 140;

const cardControlsTemplate = (details) => {
  const getActiveClass = (data) => data ? 'film-card__controls-item--active' : '';

  return (`
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist js-add-to-watchlist ${getActiveClass(details.watchlist)}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched js-mark-as-watched ${getActiveClass(details.alreadyWatched)}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite js-favorite ${getActiveClass(details.favorite)}" type="button">Mark as favorite</button>
  </div>
  `);
};

const cardCommentsTemplate = (comments) => (`<span class="film-card__comments">${comments.length} comments</span>`);

const createFilmCardTemplate = (movie) => {
  const {id, filmInfo, userDetails, comments} = movie;
  const genres = filmInfo.genre;
  const getMaxDescription = (text) => {
    if (text.length < MAX_TEXT_LENGTH) {return text;}

    return `${text.substring(0, MAX_TEXT_LENGTH) }...`;
  };

  return (`<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${filmInfo.title} ${id}</h3>
    <p class="film-card__rating">${filmInfo.totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${humanizeDate(filmInfo.release.date, 'YYYY')}</span>
      <span class="film-card__duration">${minutesToHours(filmInfo.runtime)}</span>
      <span class="film-card__genre">${genres.join(', ')}</span>
    </p>
    <img src="${filmInfo.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${getMaxDescription(filmInfo.description)}</p>
    ${cardCommentsTemplate(comments)}
  </a>
  ${cardControlsTemplate(userDetails)}
</article>`);
};

export default class FilmCardView extends AbstractView {

  constructor(movie) {
    super();
    this.movie = movie;
  }

  get template() {
    return createFilmCardTemplate(this.movie);
  }

  setClickCardHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#onCardClick);
  };

  #onCardClick = (evt) => {
    evt.preventDefault();

    const buttons = evt.target.closest('.film-card__controls');

    if (buttons) {
      return;
    }

    this._callback.click();
  };

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

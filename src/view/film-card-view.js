import {createElement} from '../render.js';
import {humanizeDate} from '../utils.js';

const createFilmCardTemplate = (movie) => {
  const {id, filmInfo, userDetails, comments} = movie;
  const genres = filmInfo.genre;
  const getActiveClass = (data) => data ? 'film-card__controls-item--active' : '';
  const getMaxDescription = (text) => {
    if (text.length < 140) {return text;}

    return `${text.substring(0, 140) }...`;
  };
  const minutesToHours = (totalMinutes) => {
    if (Number(totalMinutes) < 60 ) {return `${totalMinutes}m`;}

    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    if (minutes !== 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${hours}h`;
    }

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
    <span class="film-card__comments">${comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${getActiveClass(userDetails.watchlist)}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${getActiveClass(userDetails.alreadyWatched)}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${getActiveClass(userDetails.favorite)}" type="button">Mark as favorite</button>
  </div>
</article>`);
};

export default class FilmCardView {
  constructor(movie) {
    this.movie = movie;
  }

  getTemplate() {
    return createFilmCardTemplate(this.movie);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

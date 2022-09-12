import AbstractView from '../framework/view/abstract-view';
import {humanizeDate, minutesToHours} from '../utils';

const createPopupTopContainerTemplate = (movie) => {
  const {id, filmInfo} = movie;
  const getGenresTemplate = () => filmInfo.genre.map( (genre) => `<span class="film-details__genre">${genre}</span>`).join('');

  return (`
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn js-button-close" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${filmInfo.poster}" alt="">

          <p class="film-details__age">${filmInfo.ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${filmInfo.title} ${id}</h3>
              <p class="film-details__title-original">Original: ${filmInfo.alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${filmInfo.totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${filmInfo.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${filmInfo.writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${filmInfo.actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${humanizeDate(filmInfo.release.date, 'DD MMMM YYYY')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${minutesToHours(filmInfo.runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                ${getGenresTemplate()}
              </td>
            </tr>
          </table>
          <p class="film-details__film-description">${filmInfo.description}</p>
        </div>
      </div>
    </div>
`);
};

export default class PopupTopContainerView extends AbstractView {
  #movie = null;

  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createPopupTopContainerTemplate(this.#movie);
  }

  setClickCloseButtonHandler = (callback) => {
    const buttonClose = this.element.querySelector('.js-button-close');
    this._callback.clickCloseButton = callback;
    buttonClose.addEventListener('click', this.#onButtonCloseClick);
  };

  #onButtonCloseClick = (evt) => {
    evt.preventDefault();
    this._callback.clickCloseButton();
  };

}

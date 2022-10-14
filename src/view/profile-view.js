import AbstractView from '../framework/view/abstract-view';
import {ProfileRank} from '../utils';

const checkProfileRank = (movieModel) => {
  const alreadyWatchedFilms = movieModel.movies.filter((movie) => movie.userDetails.alreadyWatched);
  if (alreadyWatchedFilms.length === ProfileRank.NO_RANK.MAX_LENGTH) {
    return ProfileRank.NO_RANK.TEXT;
  } else if (alreadyWatchedFilms.length <= ProfileRank.NOVICE.MAX_LENGTH) {
    return ProfileRank.NOVICE.TEXT;
  } else if (alreadyWatchedFilms.length <= ProfileRank.FAN.MAX_LENGTH) {
    return ProfileRank.FAN.TEXT;
  }

  return ProfileRank.MOVIE_BUFF.TEXT;
};

const createProfileViewTemplate = (filmsModel) => (`<section class="header__profile profile">
    <p class="profile__rating">${checkProfileRank(filmsModel)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`);

export default class ProfileView extends AbstractView {

  #movieModel = null;

  constructor(movieModel) {
    super();
    this.#movieModel = movieModel;
  }

  get template() {
    return createProfileViewTemplate(this.#movieModel);
  }

}

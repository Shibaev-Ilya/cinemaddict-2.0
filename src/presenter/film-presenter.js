import FilmCardView from '../view/film-card-view.js';
import PopupPresenter from './popup-presenter.js';
import {render} from '../render.js';

export default class FilmPresenter {

  #commentsModel = null;
  #filmsListContainer = null;

  constructor (commentsModel, filmsListContainer) {
    this.#commentsModel = commentsModel;
    this.#filmsListContainer = filmsListContainer;
  }

  renderMovie = (movie) => {
    const movieComments = this.#commentsModel.getComments(movie.id);
    const movieComponent = new FilmCardView(movie);
    const popupPresenter = new PopupPresenter(movie, movieComments);

    movieComponent.setClickCardHandler(popupPresenter.openPopup);

    render(movieComponent, this.#filmsListContainer.element);
  };

}

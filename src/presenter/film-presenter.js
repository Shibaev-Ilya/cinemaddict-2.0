import FilmCardView from '../view/film-card-view.js';
import PopupPresenter from './popup-presenter.js';
import {render, remove} from '../framework/render.js';
import {replace} from '../framework/render';

export default class FilmPresenter {

  #commentsModel = null;
  #filmsListContainer = null;
  #movie = null;
  #movieComponent = null;

  constructor (filmsListContainer) {
    this.#filmsListContainer = filmsListContainer;
  }

  init = (movie, commentsModel) => {
    this.#movie = movie;
    this.#commentsModel = commentsModel;

    const prevMovieComponent = this.#movieComponent;
    const movieComments = this.#commentsModel.getComments(this.#movie.id);
    this.#movieComponent = new FilmCardView(this.#movie);
    const popupPresenter = new PopupPresenter(this.#movie, movieComments);

    this.#movieComponent.setClickCardHandler(popupPresenter.openPopup);

    if (prevMovieComponent === null ) {
      render(this.#movieComponent, this.#filmsListContainer);
      return;
    }

    if (this.#filmsListContainer.contains(prevMovieComponent.element)) {
      replace(this.#movieComponent, prevMovieComponent);
    }

    remove(prevMovieComponent);

  };

  destroy = () => {
    remove(this.#movieComponent);
  };

}

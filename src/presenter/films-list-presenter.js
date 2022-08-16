import {render} from '../render';
import FilmsContainer from '../view/films-container-view';
import FilmsListContainer from '../view/films-list-container-view';
import FilmsList from '../view/films-list-view';
import FilmCardView from '../view/film-card-view';
import ShowMoreButton from '../view/show-more-button';
import PopupPresenter from './popup-presenter.js';

const MOVIES_PER_PAGE = 10;

export default class FilmsListPresenter {

  #filmsContainer = new FilmsContainer;
  #filmsListContainer = new FilmsListContainer;
  #filmsList = new FilmsList;
  #showMoreButton = new ShowMoreButton;
  #popupPresenter = new PopupPresenter;
  #movieModel = null;
  #commentsModel = null;
  #moviesData = null;
  #mainContainer = null;

  constructor (mainContainer) {
    this.#mainContainer = mainContainer;
  }

  init = (movieModel, commentsModel) => {
    this.#movieModel = movieModel;
    this.#commentsModel = commentsModel;
    this.#moviesData = [...this.#movieModel.movies];

    render(this.#filmsContainer, this.#mainContainer);
    render(this.#filmsList, this.#filmsContainer.element);
    render(this.#filmsListContainer, this.#filmsList.element);

    for (let i = 0; i < MOVIES_PER_PAGE; i++) {
      this.renderMovie(this.#moviesData[i]);
    }


    render(this.#showMoreButton, this.#filmsList.element);
  };

  renderMovie = (movie) => {
    const movieComponent = new FilmCardView(movie);
    render(movieComponent, this.#filmsListContainer.element);

    const movieComments = this.#commentsModel.getComments(movie.id);
    this.#popupPresenter.init(movie, movieComments);
  };

}

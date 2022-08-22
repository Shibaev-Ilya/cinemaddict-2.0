import {render} from '../render';
import FilmsContainer from '../view/films-container-view';
import FilmsListContainer from '../view/films-list-container-view';
import FilmsList from '../view/films-list-view';
import FilmCardView from '../view/film-card-view';
import ShowMoreButton from '../view/show-more-button';
import PopupPresenter from './popup-presenter.js';
import NoMoviesView from '../view/no-movies-view.js';

const MOVIES_PER_PAGE = 5;

export default class FilmsListPresenter {

  #filmsContainer = new FilmsContainer;
  #filmsListContainer = new FilmsListContainer;
  #filmsList = new FilmsList;
  #showMoreButton = new ShowMoreButton;
  #movieModel = null;
  #commentsModel = null;
  #moviesData = null;
  #mainContainer = null;
  #noMoviesView = new NoMoviesView;
  #renderedMoviesCount = MOVIES_PER_PAGE;

  constructor (mainContainer, movieModel, commentsModel) {
    this.#mainContainer = mainContainer;
    this.#movieModel = movieModel;
    this.#commentsModel = commentsModel;
  }

  #renderMovie = (movie) => {
    const movieComponent = new FilmCardView(movie);
    const movieComments = this.#commentsModel.getComments(movie.id);
    const popupPresenter = new PopupPresenter(movie, movieComments);

    movieComponent.element.addEventListener('click', popupPresenter.openPopup);
    render(movieComponent, this.#filmsListContainer.element);
  };

  #onShowMoreButtonClick = (evt) => {
    evt.preventDefault();
    this.#moviesData
      .slice(this.#renderedMoviesCount, this.#renderedMoviesCount + MOVIES_PER_PAGE)
      .forEach( (movie) => this.#renderMovie(movie) );

    this.#renderedMoviesCount += MOVIES_PER_PAGE;

    if (this.#renderedMoviesCount >= this.#moviesData.length) {
      this.#showMoreButton.element.remove();
      this.#showMoreButton.removeElement();
    }
  };

  #renderBoard = () => {
    render(this.#filmsContainer, this.#mainContainer);
    render(this.#filmsList, this.#filmsContainer.element);
    render(this.#filmsListContainer, this.#filmsList.element);

    if (this.#moviesData.length === 0) {
      render(this.#noMoviesView, this.#filmsListContainer.element);
      return;
    }

    for (let i = 0; i < Math.min(this.#moviesData.length, MOVIES_PER_PAGE); i++) {
      this.#renderMovie(this.#moviesData[i]);
    }

    if (this.#moviesData.length > MOVIES_PER_PAGE) {
      render(this.#showMoreButton, this.#filmsList.element);
      this.#showMoreButton.element.addEventListener('click', this.#onShowMoreButtonClick);
    }
  };

  init = () => {
    this.#moviesData = [...this.#movieModel.movies];
    this.#renderBoard();
  };

}

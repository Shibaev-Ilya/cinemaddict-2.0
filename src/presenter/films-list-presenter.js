import {render, remove} from '../framework/render';
import FilmsContainer from '../view/films-container-view';
import FilmsListContainer from '../view/films-list-container-view';
import FilmsList from '../view/films-list-view';
import ShowMoreButton from '../view/show-more-button';
import NoMoviesView from '../view/no-movies-view';
import FilterPresenter from './filter-presenter';
import SortPresenter from './sort-presenter';
import FilmPresenter from './film-presenter';
import {sortDateUp, SortType, sortRatingUp} from '../utils';

const MOVIES_PER_PAGE = 5;

export default class FilmsListPresenter {

  #filmsContainer = new FilmsContainer;
  #filmsListContainer = new FilmsListContainer;
  #filmsList = new FilmsList;
  #showMoreButton = new ShowMoreButton;
  #movieModel = null;
  #commentsModel = null;
  #mainContainer = null;
  #filterPresenter = null;
  #sortPresenter = null;
  #noMoviesView = new NoMoviesView;
  #renderedMoviesCount = MOVIES_PER_PAGE;
  #filmPresenters = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor (mainContainer, movieModel, commentsModel) {
    this.#mainContainer = mainContainer;
    this.#movieModel = movieModel;
    this.#commentsModel = commentsModel;
  }

  get movies() {
    switch ( this.#currentSortType) {
      case SortType.BY_DATE:
        return [... this.#movieModel.movies].sort(sortDateUp);
      case SortType.BY_RATING:
        return [... this.#movieModel.movies].sort(sortRatingUp);
      default:
        return [... this.#movieModel.movies];
    }
  }

  #handleFilmChange = (updatedMovie) => {
    // Здесь будем вызывать обновление модели
    this.#filmPresenters.get(updatedMovie.id).init(updatedMovie, this.#commentsModel);
  };

  #renderFilm = (movie) => {
    const filmPresenter = new FilmPresenter(this.#filmsListContainer.element, this.#handleFilmChange);
    this.#filmPresenters.set(movie.id, filmPresenter);

    filmPresenter.init(movie, this.#commentsModel);
  };

  #clearFilmsList = () => {
    this.#filmPresenters.forEach((presenter) => presenter.destroy());
    this.#filmPresenters.clear();
    this.#renderedMoviesCount = MOVIES_PER_PAGE;
    remove(this.#showMoreButton);
  };

  #renderMovies = (movies) => {
    movies.forEach( (movie) => this.#renderFilm(movie) );
  };

  #onShowMoreButtonClick = () => {

    const moviesCount = this.movies.length;
    const newRenderedMoviesCount = Math.min(moviesCount, this.#renderedMoviesCount + MOVIES_PER_PAGE);
    const movies = this.movies.slice(this.#renderedMoviesCount, newRenderedMoviesCount);

    this.#renderMovies(movies);

    this.#renderedMoviesCount = newRenderedMoviesCount;

    if (this.#renderedMoviesCount >= moviesCount) {
      this.#showMoreButton.element.remove();
      this.#showMoreButton.removeElement();
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearFilmsList();
    this.#sortPresenter.clearSort();

    this.#renderSort();
    this.#renderBoard();
  };

  #renderFilters = () => {
    this.#filterPresenter = new FilterPresenter(this.#mainContainer);
    this.#filterPresenter.init(this.movies);
  };

  #renderSort = () => {
    this.#sortPresenter = new SortPresenter(this.#mainContainer, this.#handleSortTypeChange);
    this.#sortPresenter.init(this.movies, this.#currentSortType);
  };

  #renderBoard = () => {

    const moviesCount = this.movies.length;
    const movies = this.movies.slice(0, Math.min(moviesCount, MOVIES_PER_PAGE));

    render(this.#filmsContainer, this.#mainContainer);
    render(this.#filmsList, this.#filmsContainer.element);
    render(this.#filmsListContainer, this.#filmsList.element);

    if (this.movies.length === 0) {
      render(this.#noMoviesView, this.#filmsListContainer.element);
      return;
    }

    this.#renderMovies(movies);

    if (moviesCount > MOVIES_PER_PAGE) {
      render(this.#showMoreButton, this.#filmsList.element);
      this.#showMoreButton.setClickHandler(this.#onShowMoreButtonClick);
    }
  };

  init = () => {
    this.#renderFilters();
    this.#renderSort();
    this.#renderBoard();
  };

}

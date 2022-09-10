import {render, remove} from '../framework/render';
import FilmsContainer from '../view/films-container-view';
import FilmsListContainer from '../view/films-list-container-view';
import FilmsList from '../view/films-list-view';
import ShowMoreButton from '../view/show-more-button';
import NoMoviesView from '../view/no-movies-view';
import FilterPresenter from './filter-presenter';
import SortPresenter from './sort-presenter';
import FilmPresenter from './film-presenter';
import {sortDateUp, SortType, updateItem, sortRatingUp} from '../utils';

const MOVIES_PER_PAGE = 5;

export default class FilmsListPresenter {

  #filmsContainer = new FilmsContainer;
  #filmsListContainer = new FilmsListContainer;
  #filmsList = new FilmsList;
  #showMoreButton = new ShowMoreButton;
  #movieModel = null;
  #commentsModel = null;
  #moviesData = [];
  #sourceMoviesData = [];
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

  #handleFilmChange = (updatedMovie) => {
    this.#moviesData = updateItem(this.#moviesData, updatedMovie);
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

  #onShowMoreButtonClick = () => {

    this.#moviesData
      .slice(this.#renderedMoviesCount, this.#renderedMoviesCount + MOVIES_PER_PAGE)
      .forEach( (movie) => this.#renderFilm(movie) );

    this.#renderedMoviesCount += MOVIES_PER_PAGE;

    if (this.#renderedMoviesCount >= this.#moviesData.length) {
      this.#showMoreButton.element.remove();
      this.#showMoreButton.removeElement();
    }
  };

  #sortMovies = (sortType) => {

    switch (sortType) {
      case SortType.BY_DATE:
        this.#moviesData.sort(sortDateUp);
        break;
      case SortType.BY_RATING:
        this.#moviesData.sort(sortRatingUp);
        break;
      default:
        this.#moviesData = [... this.#sourceMoviesData];
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    this.#sortMovies(sortType);

    this.#clearFilmsList();
    this.#sortPresenter.clearSort();

    this.#renderSort();
    this.#renderBoard();
  };

  #renderFilters = () => {
    this.#filterPresenter = new FilterPresenter(this.#mainContainer);
    this.#filterPresenter.init(this.#moviesData);
  };

  #renderSort = () => {
    this.#sortPresenter = new SortPresenter(this.#mainContainer, this.#handleSortTypeChange);
    this.#sortPresenter.init(this.#moviesData, this.#currentSortType);
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
      this.#renderFilm(this.#moviesData[i]);
    }

    if (this.#moviesData.length > MOVIES_PER_PAGE) {
      render(this.#showMoreButton, this.#filmsList.element);
      this.#showMoreButton.setClickHandler(this.#onShowMoreButtonClick);
    }
  };

  init = () => {
    this.#moviesData = [...this.#movieModel.movies];
    this.#sourceMoviesData = [...this.#movieModel.movies];
    this.#renderFilters();
    this.#renderSort();
    this.#renderBoard();
  };

}

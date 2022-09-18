import {render, remove} from '../framework/render';
import FilmsContainer from '../view/films-container-view';
import FilmsListContainer from '../view/films-list-container-view';
import FilmsList from '../view/films-list-view';
import ShowMoreButton from '../view/show-more-button';
import NoMoviesView from '../view/no-movies-view';
import FilterPresenter from './filter-presenter';
import SortPresenter from './sort-presenter';
import FilmPresenter from './film-presenter';
import {sortDateUp, SortType, sortRatingUp, UpdateType, UserAction} from '../utils';
import {filter} from '../filter';

const MOVIES_PER_PAGE = 5;

export default class FilmsListPresenter {

  #filmsContainer = new FilmsContainer;
  #filmsListContainer = new FilmsListContainer;
  #filmsList = new FilmsList;
  #showMoreButton = new ShowMoreButton;
  #movieModel = null;
  #commentsModel = null;
  #filterModel = null;
  #mainContainer = null;
  #filterPresenter = null;
  #sortPresenter = null;
  #noMoviesView = new NoMoviesView;
  #renderedMoviesCount = MOVIES_PER_PAGE;
  #filmPresenters = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor (mainContainer, movieModel, commentsModel, filterModel) {
    this.#mainContainer = mainContainer;
    this.#movieModel = movieModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#movieModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleCommentModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get movies() {
    const filterType = this.#filterModel.filter;
    const movies = this.#movieModel.movies;
    const filteredMovies = filter[filterType](movies);

    switch ( this.#currentSortType) {
      case SortType.BY_DATE:
        return filteredMovies.sort(sortDateUp);
      case SortType.BY_RATING:
        return filteredMovies.sort(sortRatingUp);
      default:
        return filteredMovies;
    }
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#movieModel.updateMovie(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenters.get(data.id).init(data, this.#commentsModel.getComments(data.id));
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedMoviesCount: true, resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #handleCommentModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenters.get(data.movie.id).init(data.movie, data.newComments);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard();
        this.#renderBoard({resetRenderedMoviesCount: true, resetSortType: true});
        break;
    }
  };

  #renderFilm = (movie) => {
    const filmPresenter = new FilmPresenter(this.#filmsListContainer.element, this.#handleViewAction);
    this.#filmPresenters.set(movie.id, filmPresenter);

    filmPresenter.init(movie, this.#commentsModel.getComments(movie.id));
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
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort = () => {
    this.#sortPresenter = new SortPresenter(this.#mainContainer, this.#handleSortTypeChange);
    this.#sortPresenter.init(this.movies, this.#currentSortType);
  };

  #renderFilters = () => {
    this.#filterPresenter = new FilterPresenter(this.#mainContainer, this.#filterModel, this.#movieModel);
    this.#filterPresenter.init();
  };

  #renderNoMovies = () => {
    render(this.#noMoviesView, this.#filmsListContainer.element);
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButton, this.#filmsList.element);
    this.#showMoreButton.setClickHandler(this.#onShowMoreButtonClick);
  };

  #clearBoard = ({resetRenderedMoviesCount = false, resetSortType = false} = {}) => {
    const moviesCount = this.movies.length;

    this.#filmPresenters.forEach((presenter) => presenter.destroy());
    this.#filmPresenters.clear();

    this.#filterPresenter.clearFilter();
    this.#sortPresenter.clearSort();

    remove(this.#noMoviesView);
    remove(this.#showMoreButton);

    if (resetRenderedMoviesCount) {
      this.#renderedMoviesCount = MOVIES_PER_PAGE;
    } else {
      this.#renderedMoviesCount = Math.min(moviesCount, this.#renderedMoviesCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderBoard = () => {
    const moviesCount = this.movies.length;
    const movies = this.movies.slice(0, Math.min(moviesCount, this.#renderedMoviesCount));

    this.#renderFilters();
    this.#renderSort();

    render(this.#filmsContainer, this.#mainContainer);
    render(this.#filmsList, this.#filmsContainer.element);
    render(this.#filmsListContainer, this.#filmsList.element);

    if (this.movies.length === 0) {
      this.#renderNoMovies();
      return;
    }

    this.#renderMovies(movies);

    if (moviesCount > this.#renderedMoviesCount) {
      this.#renderShowMoreButton();
    }
  };

  init = () => {
    this.#renderBoard();
  };

}

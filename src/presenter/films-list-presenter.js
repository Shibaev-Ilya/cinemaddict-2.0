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
import PopupPresenter from './popup-presenter';
import LoadingView from '../view/loading-view';

const MOVIES_PER_PAGE = 5;

export default class FilmsListPresenter {

  #filmsContainer = new FilmsContainer;
  #filmsListContainer = new FilmsListContainer;
  #filmsList = new FilmsList;
  #showMoreButton = new ShowMoreButton;
  #loadingComponent = new LoadingView();
  #movieModel = null;
  #commentsModel = null;
  #filterModel = null;
  #mainContainer = null;
  #filterPresenter = null;
  #sortPresenter = null;
  #noMoviesView = null;
  #popupPresenter = null;
  #renderedMoviesCount = MOVIES_PER_PAGE;
  #filmPresenters = new Map();
  #currentSortType = SortType.DEFAULT;
  #isLoading = true;

  constructor (mainContainer, movieModel, commentsModel, filterModel) {
    this.#mainContainer = mainContainer;
    this.#movieModel = movieModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#movieModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#popupPresenter = new PopupPresenter(this.#movieModel, this.#commentsModel, this.#filterModel);
  }

  get movies() {
    const filterType = this.#filterModel.filter;
    const movies = this.#movieModel.movies;
    const filteredMovies = filter[filterType](movies);

    switch ( this.#currentSortType) {
      case SortType.BY_DATE:
        return filteredMovies.slice().sort(sortDateUp);
      case SortType.BY_RATING:
        return filteredMovies.slice().sort(sortRatingUp);
      default:
        return filteredMovies;
    }
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#movieModel.updateMovie(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    const filmPresenter = data ? this.#filmPresenters.get(data.id) : false;
    switch (updateType) {
      case UpdateType.PATCH:
        if (filmPresenter) {
          filmPresenter.init(data, this.#commentsModel.getComments(data.id));
        }
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedMoviesCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#clearBoard();
        this.#renderBoard();
        break;
    }
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#filmsListContainer.element);
  };

  #renderFilm = (movie) => {
    const filmPresenter = new FilmPresenter(this.#filmsListContainer.element, this.#handleViewAction, this.#filterModel, this.#popupPresenter);
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
    this.#noMoviesView = new NoMoviesView(this.#filterModel.filter);
    render(this.#noMoviesView, this.#filmsListContainer.element);
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButton, this.#filmsList.element);
    this.#showMoreButton.setClickHandler(this.#onShowMoreButtonClick);
  };

  #clearBoard = ({resetRenderedMoviesCount = false, resetSortType = false} = {}) => {
    remove(this.#loadingComponent);
    const moviesCount = this.movies.length;

    this.#filmPresenters.forEach((presenter) => presenter.destroy());
    this.#filmPresenters.clear();

    this.#filterPresenter.clearFilter();
    this.#sortPresenter.clearSort();

    if (this.#noMoviesView) {
      remove(this.#noMoviesView);
    }
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

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

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

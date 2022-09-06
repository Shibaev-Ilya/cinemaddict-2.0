import {render} from '../render';
import FilmsContainer from '../view/films-container-view';
import FilmsListContainer from '../view/films-list-container-view';
import FilmsList from '../view/films-list-view';
import ShowMoreButton from '../view/show-more-button';
import NoMoviesView from '../view/no-movies-view.js';
import FilterPresenter from './filter-presenter.js';
import SortPresenter from './sort-presenter.js';
import FilmPresenter from './film-presenter.js';

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
  #filterPresenter = null;
  #sortPresenter = null;
  #noMoviesView = new NoMoviesView;
  #renderedMoviesCount = MOVIES_PER_PAGE;

  constructor (mainContainer, movieModel, commentsModel) {
    this.#mainContainer = mainContainer;
    this.#movieModel = movieModel;
    this.#commentsModel = commentsModel;
    this.#filterPresenter = new FilterPresenter(this.#mainContainer);
    this.#sortPresenter = new SortPresenter(this.#mainContainer);
  }

  #onShowMoreButtonClick = () => {
    const filmPresenter = new FilmPresenter(this.#commentsModel, this.#filmsListContainer);

    this.#moviesData
      .slice(this.#renderedMoviesCount, this.#renderedMoviesCount + MOVIES_PER_PAGE)
      .forEach( (movie) => filmPresenter.renderMovie(movie) );

    this.#renderedMoviesCount += MOVIES_PER_PAGE;

    if (this.#renderedMoviesCount >= this.#moviesData.length) {
      this.#showMoreButton.element.remove();
      this.#showMoreButton.removeElement();
    }
  };

  #renderFilters = () => {
    this.#filterPresenter.init(this.#moviesData);
    this.#sortPresenter.init(this.#moviesData);
  };

  #renderBoard = () => {
    const filmPresenter = new FilmPresenter(this.#commentsModel, this.#filmsListContainer);

    render(this.#filmsContainer, this.#mainContainer);
    render(this.#filmsList, this.#filmsContainer.element);
    render(this.#filmsListContainer, this.#filmsList.element);

    if (this.#moviesData.length === 0) {
      render(this.#noMoviesView, this.#filmsListContainer.element);
      return;
    }

    for (let i = 0; i < Math.min(this.#moviesData.length, MOVIES_PER_PAGE); i++) {
      filmPresenter.renderMovie(this.#moviesData[i]);
    }

    if (this.#moviesData.length > MOVIES_PER_PAGE) {
      render(this.#showMoreButton, this.#filmsList.element);
      this.#showMoreButton.setClickHandler(this.#onShowMoreButtonClick);
    }
  };

  init = () => {
    this.#moviesData = [...this.#movieModel.movies];
    this.#renderFilters();
    this.#renderBoard();
  };

}

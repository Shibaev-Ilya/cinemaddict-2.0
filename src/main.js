import FilmsListPresenter from './presenter/films-list-presenter.js';
import MovieModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import SortPresenter from './presenter/sort-presenter.js';
import ProfilePresenter from './presenter/profile-presenter.js';

const mainContainer = document.querySelector('.main');
const headerContainer = document.querySelector('.header');

const movieModel = new MovieModel;
const commentsModel = new CommentsModel;

const profilePresenter = new ProfilePresenter(headerContainer);
const filterPresenter = new FilterPresenter(mainContainer);
const sortPresenter = new SortPresenter(mainContainer);

const filmsListPresenter = new FilmsListPresenter(mainContainer, movieModel, commentsModel, filterPresenter, sortPresenter);


profilePresenter.init();

filmsListPresenter.init();

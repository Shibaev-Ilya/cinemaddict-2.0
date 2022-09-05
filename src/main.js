import FilmsListPresenter from './presenter/films-list-presenter.js';
import MovieModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';
import ProfilePresenter from './presenter/profile-presenter.js';

const mainContainer = document.querySelector('.main');
const headerContainer = document.querySelector('.header');

const movieModel = new MovieModel;
const commentsModel = new CommentsModel;

const profilePresenter = new ProfilePresenter(headerContainer);
const filmsListPresenter = new FilmsListPresenter(mainContainer, movieModel, commentsModel);


profilePresenter.init();
filmsListPresenter.init();

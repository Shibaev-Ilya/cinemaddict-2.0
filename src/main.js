import FilmsListPresenter from './presenter/films-list-presenter';
import MovieModel from './model/movies-model';
import CommentsModel from './model/comments-model';
import ProfilePresenter from './presenter/profile-presenter';

const mainContainer = document.querySelector('.main');
const headerContainer = document.querySelector('.header');

const movieModel = new MovieModel;
const commentsModel = new CommentsModel;

const profilePresenter = new ProfilePresenter(headerContainer);
const filmsListPresenter = new FilmsListPresenter(mainContainer, movieModel, commentsModel);


profilePresenter.init();
filmsListPresenter.init();

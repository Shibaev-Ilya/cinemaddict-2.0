import FilmsListPresenter from './presenter/films-list-presenter';
import MovieModel from './model/movies-model';
import CommentsModel from './model/comments-model';
import ProfilePresenter from './presenter/profile-presenter';
import FilterModel from './model/filters-model';
import MovieApiService from './api-services/movie-api-service';
import CommentsApiService from './api-services/comments-api-service';

const mainContainer = document.querySelector('.main');
const headerContainer = document.querySelector('.header');
const footerStatistic = document.querySelector('.js-statistic');

const AUTHORIZATION = 'Basic hSdfjvukdd8dk3d0dlf';
const END_POINT = 'https://18.ecmascript.pages.academy/cinemaddict';

const movieModel = new MovieModel(new MovieApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel;
const filmsListPresenter = new FilmsListPresenter(mainContainer, movieModel, commentsModel, filterModel);

new ProfilePresenter(headerContainer, footerStatistic, movieModel);

filmsListPresenter.init();
movieModel.init();

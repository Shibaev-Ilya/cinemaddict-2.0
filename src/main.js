import {render} from './render.js';
import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import ProfileView from './view/profile-view.js';
import FilmsListPresenter from './presenter/films-list-presenter.js';
import PopupPresenter from './presenter/popup-presenter';
import MovieModel from './model/movies-model.js';

const mainContainer = document.querySelector('.main');
const headerContainer = document.querySelector('.header');

const movieModel = new MovieModel;

const filmsListPresenter = new FilmsListPresenter(mainContainer);
const popupPresenter = new PopupPresenter;

const filterView = new FilterView;
const sortView = new SortView;
const profileView = new ProfileView;


render(profileView, headerContainer);
render(filterView, mainContainer);
render(sortView, mainContainer);

filmsListPresenter.init(movieModel);

popupPresenter.init();

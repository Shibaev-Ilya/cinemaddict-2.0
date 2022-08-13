import {render} from '../render';
import FilmsContainer from '../view/films-container-view';
import FilmsListContainer from '../view/films-list-container-view';
import FilmsList from '../view/films-list-view';
import FilmCardView from '../view/film-card-view';
import ShowMoreButton from '../view/show-more-button';

export default class FilmsListPresenter {

  filmsContainer = new FilmsContainer;
  filmsListContainer = new FilmsListContainer;
  filmsList = new FilmsList;
  showMoreButton = new ShowMoreButton;

  constructor (mainContainer) {
    this.mainContainer = mainContainer;
  }

  init = (movieModel) => {
    this.movieModel = movieModel;
    this.moviesData = [...this.movieModel.getMovies()];

    render(this.filmsContainer, this.mainContainer);
    render(this.filmsList, this.filmsContainer.getElement());
    render(this.filmsListContainer, this.filmsList.getElement());

    for (let i = 0; i < 10; i++) {
      render(new FilmCardView(this.moviesData[i]), this.filmsListContainer.getElement());
    }


    render(this.showMoreButton, this.filmsList.getElement());
  };

}

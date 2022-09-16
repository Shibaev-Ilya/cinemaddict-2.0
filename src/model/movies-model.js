import {generateMovies} from '../mocks/movie-mock';
import Observable from '../framework/observable';

export default class MovieModel extends Observable {
  #movies = generateMovies;

  get movies() {
    return this.#movies;
  }
}

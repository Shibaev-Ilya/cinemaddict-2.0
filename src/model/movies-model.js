import {generateMovies} from '../mocks/movie-mock';

export default class MovieModel {
  #movies = generateMovies;

  get movies() {
    return this.#movies;
  }
}

import {generateMovies} from '../mocks/movie-mock.js';

export default class MovieModel {
  #movies = generateMovies;

  get movies() {
    return this.#movies;
  }
}

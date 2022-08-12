import {generateMovie} from '../mocks/movie-mock.js';

export default class MovieModel {
  movies = Array.from({length: 10}, generateMovie);

  getMovies = () => this.movies;
}

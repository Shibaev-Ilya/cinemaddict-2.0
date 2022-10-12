import Observable from '../framework/observable';
import {UpdateType} from '../utils';

export default class MovieModel extends Observable {

  #movieApiService = null;
  #movies = [];

  constructor(movieApiService) {
    super();
    this.#movieApiService = movieApiService;
  }

  get movies() {
    return this.#movies;
  }

  updateMovie = async (updateType, update) => {
    const commentMovie = update;
    const index = this.#movies.findIndex((movie) => movie.id === commentMovie.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    try {
      const response = await this.#movieApiService.updateMovie(commentMovie);
      const updatedMovie = this.#adaptToClient(response);
      this.#movies = [
        ...this.#movies.slice(0, index),
        updatedMovie,
        ...this.#movies.slice(index + 1),
      ];
      this._notify(updateType, updatedMovie);
    } catch(err) {
      throw new Error(err);
    }
  };

  #adaptToClient = (movie) => {
    const adaptedMovie = {...movie,
      filmInfo: { ...movie.film_info,
        alternativeTitle: movie.film_info.alternative_title,
        totalRating: movie.film_info.total_rating,
        ageRating: movie.film_info.age_rating,
        release: {...movie.film_info.release,
          releaseCountry: movie.film_info.release.release_country
        },
      },
      userDetails: { ...movie.user_details,
        alreadyWatched: movie.user_details.already_watched,
        watchingDate: movie.user_details.watching_date,
      },
    };

    // Ненужные ключи мы удаляем
    delete adaptedMovie['film_info'];
    delete adaptedMovie.filmInfo['alternative_title'];
    delete adaptedMovie.filmInfo['total_rating'];
    delete adaptedMovie.filmInfo['age_rating'];
    delete adaptedMovie.filmInfo['release']['release_country'];
    delete adaptedMovie['user_details'];
    delete adaptedMovie.userDetails['already_watched'];
    delete adaptedMovie.userDetails['watching_date'];

    return adaptedMovie;
  };

  init = async (event, payload) => {
    try {
      const movies = await this.#movieApiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
    } catch(err) {
      this.#movies = [];
    }

    this._notify(UpdateType.INIT, payload);
  };

}

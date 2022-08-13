import {FILM_AMOUNT, getId, getRandomInteger} from '../utils.js';
import {allComments} from './comment-mocks.js';

const id = getId();

const srcPosters = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg'
];

const getComments = (filmId) => allComments[Number(filmId)].map((el) => el.id);

const getStatus = () => Boolean(getRandomInteger(0, 1));

const generateMovie = () => {
  const MovieId = id();
  return ({
    id: `${MovieId}`,
    filmInfo: {
      title: 'Terminator',
      alternativeTitle: 'Country Who Stole Us',
      totalRating: 7.8,
      poster: `images/posters/${srcPosters[getRandomInteger(0, srcPosters.length - 1)]}`,
      ageRating: getRandomInteger(0, 18),
      director: 'James Cameron',
      writers: [
        'Robert Zemeckis',
        'Martin Scorsese'
      ],
      actors: [
        'Morgan Freeman ',
        'Tom Hanks',
        'Leonardo DiCaprio',
        'Cillian Murphy'
      ],
      release: {
        date: '2018-12-23T03:55:18.062Z',
        releaseCountry: 'Spain'
      },
      runtime: getRandomInteger(63, 130),
      genre: [
        'Drama',
        'Sci-Fi',
        'Thriller',
        'Horror'
      ],
      description: 'Oscar-winning film, true masterpiece where love and death are closer to heroes than their family. Oscar-winning film, true masterpiece where love and death are closer to heroes than their family.'
    },
    userDetails: {
      watchlist: getStatus(),
      alreadyWatched: getStatus(),
      watchingDate: '2022-05-04T14:44:36.135Z',
      favorite: getStatus()
    },
    comments: getComments(MovieId)
  });
};

const generateMovies = Array.from({length: FILM_AMOUNT}, generateMovie);

export {generateMovies};

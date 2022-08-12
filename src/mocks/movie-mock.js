import {getRandomInteger} from '../utils.js';

const getId = () => {
  let i = 0;
  return () => i++;
}
const id = getId();

const srcPosters = [
  'made-for-each-other',
  'popeye-meets-sinbad',
  'sagebrush-trail',
  'santa-claus-conquers-the-martians',
  'the-dance-of-life'
];

const getComments = () => {
  let randomNumbers = Array.from({ length: getRandomInteger(0, 8)}, () => String(getRandomInteger(500, 520)));
  let uniqueNumbers = new Set(randomNumbers);

  return Array.from(uniqueNumbers);
}

const getStatus = () => Boolean(getRandomInteger(0, 1));

const generateMovie = () => ({
  id: `${id()}`,
  filmInfo: {
    title: 'Terminator',
    alternative_title: 'Country Who Stole Us',
    totalRating: 7.8,
    poster: `images/posters/${srcPosters[getRandomInteger(0, srcPosters.length - 1)]}.png`,
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
      release_country: 'Spain'
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
  comments: getComments()
});

export {generateMovie}

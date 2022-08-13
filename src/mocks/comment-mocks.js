import {getRandomInteger, FILM_AMOUNT} from '../utils.js';

const smiles = ['smile', 'sleeping', 'puke', 'angry'];

const makeComment = () => ({
  id: String(getRandomInteger(500, 520)),
  author: 'Marina Walker',
  emotion: smiles[getRandomInteger(0, smiles.length - 1)],
  comment: 'love all Leo Di Caprio performances. He\'s not in the movie tho. Just telling what kinds of movies I like.',
  date: '2022-08-06T16:58:44.351Z'
});

const makeComments = () => {

  const comments = [];

  for (let i = 0; i < getRandomInteger(0, 8); i++) {
    comments.push(makeComment());
  }

  return comments;
};

const generateFilmsComments = () => {

  const tempComments = {};

  for (let i = 0; i < FILM_AMOUNT; i++) {
    tempComments[i] = makeComments();
  }

  return tempComments;
};

const allComments = generateFilmsComments();

export {allComments};

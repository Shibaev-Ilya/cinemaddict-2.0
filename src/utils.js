import dayjs from 'dayjs';

const HOUR = 60;

const UserAction = {
  UPDATE_MOVIE: 'UPDATE_MOVIE',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  COMMENT_INIT: 'COMMENT_INIT'
};

const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'byDate',
  BY_RATING: 'byRating',
};

const SortTypeNames = {
  [SortType.DEFAULT] : 'Sort by default',
  [SortType.BY_DATE] : 'Sort by date',
  [SortType.BY_RATING] : 'Sort by rating',
};

const ProfileRank = {
  NO_RANK: {
    TEXT: '',
    MAX_LENGTH: 0,
  },
  NOVICE: {
    TEXT: 'Novice',
    MAX_LENGTH: 10,
  },
  FAN: {
    TEXT: 'Fan',
    MAX_LENGTH: 20,
  },
  MOVIE_BUFF: {
    TEXT: 'Movie Buff',
    MAX_LENGTH: Infinity,
  }
};

const humanizeDate = (date, format) => dayjs(date).format(format);

const minutesToHours = (totalMinutes) => {
  if (Number(totalMinutes) < HOUR ) {return `${totalMinutes}m`;}

  const minutes = totalMinutes % HOUR;
  const hours = Math.floor(totalMinutes / HOUR);

  return minutes !== 0 ? `${hours}h ${minutes}m` : `${hours}h`;
};

const sortDateUp = (movieA, movieB) => dayjs(movieB['filmInfo']['release']['date']).diff(dayjs(movieA['filmInfo']['release']['date']));

const sortRatingUp = (movieA, movieB) => {
  if (movieA['filmInfo']['totalRating'] < movieB['filmInfo']['totalRating']) {
    return 1; }
  if (movieA['filmInfo']['totalRating'] > movieB['filmInfo']['totalRating']) {
    return -1; }
  return 0;
};

export {humanizeDate, minutesToHours, SortType, sortDateUp, sortRatingUp, SortTypeNames, UpdateType, UserAction, ProfileRank};

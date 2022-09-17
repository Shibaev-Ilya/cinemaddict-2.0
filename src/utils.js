import dayjs from 'dayjs';

const FILM_AMOUNT = 14;
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

const FilterType = {
  FILTER_ALL: 'all',
  FILTER_WATCHLIST: 'watchlist',
  FILTER_HISTORY: 'history',
  FILTER_FAVORITES: 'favorites',
};

const filter = {
  [FilterType.FILTER_ALL]: (movies) => movies,
  [FilterType.FILTER_WATCHLIST]: (movies) => movies.filter((movie) => movie.userDetails.watchlist),
  [FilterType.FILTER_HISTORY]: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched),
  [FilterType.FILTER_FAVORITES]: (movies) => movies.filter((movie) => movie.userDetails.favorite),
};

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

//счетчик id
const getId = () => {
  let i = 0;
  return () => i++;
};

const humanizeDate = (date, format) => dayjs(date).format(format);

const minutesToHours = (totalMinutes) => {
  if (Number(totalMinutes) < HOUR ) {return `${totalMinutes}m`;}

  const minutes = totalMinutes % HOUR;
  const hours = Math.floor(totalMinutes / HOUR);

  return minutes !== 0 ? `${hours}h ${minutes}m` : `${hours}h`;
};

// Функция возвращает нужный вес для колбэка sort
const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortDateUp = (movieA, movieB) => {
  const weight = getWeightForNullDate(movieA['filmInfo']['release']['date'], movieB['filmInfo']['release']['date']);
  return weight ?? dayjs(movieB['filmInfo']['release']['date']).diff(dayjs(movieA['filmInfo']['release']['date']));
};

const sortRatingUp = (movieA, movieB) => {
  if (movieA['filmInfo']['totalRating'] < movieB['filmInfo']['totalRating']) {
    return 1; }
  if (movieA['filmInfo']['totalRating'] > movieB['filmInfo']['totalRating']) {
    return -1; }
  return 0;
};

export {getRandomInteger, humanizeDate, getId, FILM_AMOUNT, minutesToHours, SortType, sortDateUp, sortRatingUp, filter, FilterType, SortTypeNames, UpdateType, UserAction};

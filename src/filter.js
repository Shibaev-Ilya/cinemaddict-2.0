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

export {FilterType, filter};

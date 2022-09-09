import dayjs from 'dayjs';

const FILM_AMOUNT = 14;
const HOUR = 60;

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

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export {getRandomInteger, humanizeDate, getId, FILM_AMOUNT, minutesToHours, updateItem};

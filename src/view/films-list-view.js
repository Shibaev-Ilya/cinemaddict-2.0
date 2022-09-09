import AbstractView from '../framework/view/abstract-view';

const createFilmsListTemplate = () => ('<section class="films-list"><h2 class="films-list__title visually-hidden">All movies. Upcoming</h2></section>');

export default class FilmsList extends AbstractView {

  get template() {
    return createFilmsListTemplate();
  }
}

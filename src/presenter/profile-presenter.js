import {render} from '../framework/render';
import ProfileView from '../view/profile-view';

export default class ProfilePresenter {

  #profileView = new ProfileView;
  #headerContainer = null;

  constructor (headerContainer) {
    this.#headerContainer = headerContainer;
  }

  #renderProfile = () => {
    render(this.#profileView, this.#headerContainer);
  };

  init = () => {
    this.#renderProfile();
  };
}

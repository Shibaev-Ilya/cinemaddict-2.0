import {allComments} from '../mocks/comment-mocks';
import Observable from '../framework/observable';

export default class CommentsModel extends Observable {

  #comments = allComments;

  getComments = (filmId) => this.#comments[filmId];

  addComment = (updateType, update) => {

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {

    this._notify(updateType, update);
  };

}

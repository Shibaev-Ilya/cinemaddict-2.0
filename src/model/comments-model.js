import {allComments} from '../mocks/comment-mocks';

export default class CommentsModel {

  #comments = allComments;

  getComments = (filmId) => this.#comments[filmId];
}

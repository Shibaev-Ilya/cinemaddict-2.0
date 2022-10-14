import Observable from '../framework/observable';
import {UpdateType} from '../utils';

export default class CommentsModel extends Observable {

  #commentsApiService = null;
  #comments = null;

  constructor(commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  addComment = async (updateType, update) => {
    try {
      this.#comments = await this.#commentsApiService.addComment(update.movie.id, update.newComments);
      this._notify(updateType, this.#comments);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };

  init = async (filmId) => {
    try {
      this.#comments = await this.#commentsApiService.getComments(filmId);
    } catch(err) {
      this.#comments = [];
    }
    this._notify(UpdateType.COMMENT_INIT, this.#comments);
  };

  deleteComment = async (updateType, update) => {
    try {
      await this.#commentsApiService.deleteComment(update.deletedCommentId);
      this._notify(updateType, update);
    } catch(err) {
      throw new Error(err);
    }
  };

}

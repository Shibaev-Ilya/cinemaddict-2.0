import {allComments} from '../mocks/comment-mocks.js';

export default class CommentsModel {

  comments = allComments;

  getComments = () => this.comments;
}

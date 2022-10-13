import {humanizeDate} from '../utils';
import AbstractView from '../framework/view/abstract-view';
import he from 'he';

const createCommentsListTemplate = (comments) => comments.reduce((accumulator, comment) => (`${accumulator} <li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.author}</span>
                <span class="film-details__comment-day">
                ${humanizeDate(comment.date, 'YYYY/MM/DD HH:mm')}
                </span>
                <button class="film-details__comment-delete js-delete-comment" data-comment-id="${comment.id}">Delete</button>
              </p>
            </div>
          </li>`), '');

const createPopupCommentsContainerTemplate = (comments) => (`
        <div>
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
            <ul class="film-details__comments-list js-comments-list">
                ${createCommentsListTemplate(comments)}
            </ul>
        </div>
`);

export default class PopupCommentsListView extends AbstractView {
  #comments = null;

  constructor(comments) {
    super();
    this.#comments = comments;
  }

  get template() {
    return createPopupCommentsContainerTemplate(this.#comments);
  }

  setDeleteCommentHandler = (callback) => {
    this._callback.deleteComment = callback;
    this.element.querySelector('.js-comments-list').addEventListener('click', this.#onDeleteClick);
  };

  #onDeleteClick = (evt) => {
    if (!evt.target.classList.contains('js-delete-comment')) {
      return;
    }
    evt.preventDefault();
    const commentId = evt.target.dataset.commentId;
    this._callback.deleteComment(commentId);
  };

}

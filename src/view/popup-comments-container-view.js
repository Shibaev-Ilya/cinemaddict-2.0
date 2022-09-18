import {humanizeDate} from '../utils';
import AbstractView from '../framework/view/abstract-view';
import { nanoid } from 'nanoid'

const createCommentsListTemplate = (comments) => comments.reduce((accumulator, comment) => (`${accumulator} <li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">${comment.comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.author}</span>
                <span class="film-details__comment-day">
                ${humanizeDate(comment.date, 'YYYY/MM/DD HH:mm')}
                </span>
                <button class="film-details__comment-delete js-delete-comment" data-comment-id="${comment.id}">Delete</button>
              </p>
            </div>
          </li>`), '');

const createFormTemplate = () => (`<form class="film-details__new-comment" action="" method="get">
          <div class="film-details__add-emoji-label js-add-emoji"></div>

          <label class="film-details__comment-label js-add-comment">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list js-emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </form>`);

const createPopupCommentsContainerTemplate = (comments) => (`
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
        <ul class="film-details__comments-list js-comments-list">
            ${createCommentsListTemplate(comments)}
        </ul>
            ${createFormTemplate()}
      </section>
    </div>
`);

export default class PopupCommentsContainerView extends AbstractView {
  #comments = null;
  #newComment = null;
  #emojiValue = 'smile';

  constructor(comments) {
    super();
    this.#comments = comments;
  }

  get template() {
    return createPopupCommentsContainerTemplate(this.#comments);
  }

  setAddCommentHandlers = (callback) => {
    this._callback.addComment = callback;
    this.element.querySelector('.js-emoji-list').addEventListener('click', this.#onEmojiClick);
    this.element.querySelector('.js-add-comment').addEventListener('keydown', this.#onCommentKeydown);
  };

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

  #onEmojiClick = (evt) => {
    if (evt.target.tagName !== 'IMG') {
      return;
    }

    const imgContainer = this.element.querySelector('.js-add-emoji');

    if (imgContainer.hasChildNodes()) {
      imgContainer.innerHTML = '';
    }

    imgContainer.append(evt.target.cloneNode(true));

    const inputId = evt.target.parentElement.getAttribute('for');
    this.#emojiValue = this.element.querySelector(`#${inputId}`).value;

  };

  #onCommentKeydown = (evt) => {
    if (evt.ctrlKey && evt.key === 'Enter') {
      evt.preventDefault();
      this.#newComment = evt.target.value;
      let newComment = {
        "id": nanoid(3),
        "comment": this.#newComment,
        "emotion": this.#emojiValue
      };
      this._callback.addComment(newComment);
    }
  };

}

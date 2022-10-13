import AbstractView from '../framework/view/abstract-view';

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

const createPopupCommentsContainerTemplate = () => (`
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap js-comments-list-wrap">
            ${createFormTemplate()}
      </section>
    </div>
`);

export default class PopupCommentsContainerView extends AbstractView {
  #newComment = null;
  #emojiValue = 'smile';

  get template() {
    return createPopupCommentsContainerTemplate();
  }

  setAddCommentHandlers = (callback) => {
    this._callback.addComment = callback;
    this.element.querySelector('.js-emoji-list').addEventListener('click', this.#onEmojiClick);
    this.element.querySelector('.js-add-comment').addEventListener('keydown', this.#onCommentKeydown);
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
      this.#newComment = evt.target.value ? evt.target.value : '...';
      const newComment = {
        'comment': this.#newComment,
        'emotion': this.#emojiValue
      };
      this._callback.addComment(newComment);

      evt.target.value = '';
      const imgContainer = this.element.querySelector('.js-add-emoji');

      if (imgContainer.hasChildNodes()) {
        imgContainer.innerHTML = '';
      }
    }
  };

}

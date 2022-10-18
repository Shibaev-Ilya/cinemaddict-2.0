import AbstractStatefulView from '../framework/view/abstract-stateful-view';

const createFormTemplate = (state) => {
  const {isDisabled, emotion, comment} = state;
  let emojiImage = '';
  if (emotion) {
    emojiImage = `<img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">`;
  }
  return (`<form class="film-details__new-comment" action="" method="get">
          <div class="film-details__add-emoji-label js-add-emoji">${emojiImage}</div>

          <label class="film-details__comment-label js-add-comment">
            <textarea class="film-details__comment-input js-textarea" placeholder="Select reaction below and write comment here" name="comment"
            ${isDisabled ? 'disabled' : ''}>${comment ? comment : ''}</textarea>
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
};

export default class PopupCommentsFormView extends AbstractStatefulView {
  _state = {
    isDisabled: false,
    'comment': null,
    'emotion': null
  };

  get template() {
    return createFormTemplate(this._state);
  }

  setAddCommentHandlers = (callback) => {
    this._callback.addComment = callback;
    this.element.querySelector('.js-emoji-list').addEventListener('click', this.#onEmojiClick);
    this.element.querySelector('.js-add-comment').addEventListener('keydown', this.#onCommentKeydown);
  };

  #onEmojiClick = (evt) => {
    if (evt.target.tagName !== 'IMG' || this._state.isDisabled) {
      return;
    }

    const imgContainer = this.element.querySelector('.js-add-emoji');
    const emoji = evt.target.cloneNode(true);

    if (imgContainer.hasChildNodes()) {
      imgContainer.innerHTML = '';
    }
    emoji.width = 55;
    emoji.height = 55;

    if (imgContainer.classList.contains('error')) {
      imgContainer.classList.remove('error');
    }

    imgContainer.append(emoji);

    const inputId = evt.target.parentElement.getAttribute('for');
    this._state.emotion = this.element.querySelector(`#${inputId}`).value;

  };

  #onCommentKeydown = (evt) => {

    if ((evt.ctrlKey && evt.key === 'Enter') || (evt.metaKey && evt.key === 'Enter')) {
      evt.preventDefault();
      if (this._state.emotion) {
        if (evt.target.value) {
          this._state.comment = evt.target.value;
        } else {
          evt.target.classList.add('error');
        }

        const newComment = {
          'comment': this._state.comment,
          'emotion': this._state.emotion
        };
        this._callback.addComment(newComment);
        return;
      }

      const imgContainer = this.element.querySelector('.js-add-emoji');
      imgContainer.classList.add('error');
    }
  };

  clearForm = () => {
    document.querySelector('.js-textarea').value = '';
    //this.#emojiValue = null;
    const imgContainer = document.querySelector('.js-add-emoji');

    if (imgContainer.hasChildNodes()) {
      imgContainer.innerHTML = '';
    }
  };

  _restoreHandlers = () => {
    this.setAddCommentHandlers(this._callback.addComment);
  };

}

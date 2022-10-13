import ApiService from '../framework/api-service';

const Method = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class CommentsApiService extends ApiService {

  getComments = async (filmId) => this._load({url: `comments/${filmId}`}).then(ApiService.parseResponse);

  addComment = async (filmId, newComment) => {
    const response = await this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(newComment)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  };

  deleteComment = async (comment) => await this._load({
    url: `comments/${comment}`,
    method: Method.DELETE,
  });

  #adaptToServer = (comment) => {

    const adaptedComment = {...comment};

    delete adaptedComment.id;

    return adaptedComment;
  };

}

class Api {
  constructor(baseUrl, authToken) {
    this._baseUrl = baseUrl;
    this._authToken = authToken;
    this._header = new Headers();
  }

  constructInitialHeader() {
    this._header.append("authorization", this._authToken);
    this._header.append("Content-Type", "application/json");
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards/`, {
      method: "GET",
      headers: this._header,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(
        `ERROR ${res.status} while fetching cards: ${res.statusText}`,
      );
    });
  }

  postCardData(data) {
    return fetch(`${this._baseUrl}/cards/`, {
      method: "POST",
      headers: this._header,
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(
        `ERROR ${res.status} while creating new resource: ${res.statusText}`,
      );
    });
  }

  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: this._header,
    }).then((res) => {
      if (res.ok) {
        return res.status;
      } else {
        return Promise.reject(
          `ERROR ${res.status} while deleting resource: ${res.statusText}`,
        );
      }
    });
  }

  toggleLikeOnCard(likeState, id) {
    const method = likeState ? "PUT" : "DELETE";
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: method,
      headers: this._header,
    }).then((res) => {
      if (res.ok) {
        return res.status;
      } else {
        return Promise.reject(
          `ERROR ${res.status} while putting/deleting resource: ${res.statusText}`,
        );
      }
    });
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: this._header,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(
          `ERROR ${res.status} while accesing user info: ${res.statusText}`,
        );
      }
    });
  }

  updateUserInfo(newInfo) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._header,
      body: JSON.stringify(newInfo),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(
          `ERROR ${res.statusText} while patching resource: ${res.statusText}`,
        );
      }
    });
  }
}

const api = new Api(
  "https://around-api.es.tripleten-services.com/v1",
  "552c118a-3c7c-4949-afd6-5f8059218ef0",
);
api.constructInitialHeader();
export default api;

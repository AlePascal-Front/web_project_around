import { DOM } from "../utils/dom.js";
const profile = DOM.profile;

class UserInfo {
  constructor({ name, about, avatar }) {
    this._name = name;
    this._about = about;
    this._avatar = avatar;
  }

  getUserInfo() {
    return {
      name: this._name,
      about: this._about,
      avatar: this._avatar,
    };
  }

  setName(name) {
    this._name = name;
  }

  setAbout(about) {
    this._about = about;
  }

  setAvatar(avatar) {
    this._avatar = avatar;
  }

  setUserInfo() {
    profile.querySelector(".profile__name").textContent = this._name;
    profile.querySelector(".profile__description").textContent = this._about;
  }

  setUserAvatar() {
    profile.querySelector(".profile__photo").src = this._avatar;
  }
}

const userInfo = new UserInfo({ name: null, about: null, avatar: null });
export default userInfo;

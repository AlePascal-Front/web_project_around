import { DOM } from "../utils/dom.js";
const { profile } = DOM;

export default class UserInfo {
  constructor({ name, about }) {
    this._name = name;
    this._about = about;
  }

  getUserInfo() {
    return {
      name: this._name,
      about: this._about,
    };
  }

  setUserInfo() {
    profile.querySelector(".profile__name").textContent = this._name;
    profile.querySelector(".profile__description").textContent = this._about;
  }
}

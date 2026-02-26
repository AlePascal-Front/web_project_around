import { DOM } from "../utils/dom.js";
const { profile } = DOM;

export default class UserInfo {
  constructor({ userName, userJob }) {
    this._userName = userName;
    this._userJob = userJob;
  }

  getUserInfo() {
    return {
      userName: this._userName,
      userJob: this._userJob,
    };
  }

  setUserInfo() {
    profile.querySelector(".profile__name").textContent = this._userName;
    profile.querySelector(".profile__description").textContent = this._userJob;
  }
}

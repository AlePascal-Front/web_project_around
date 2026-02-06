import { DOM } from "../utils/dom.js";
const { profile } = DOM;

class UserInfo {
  constructor({ userName = null, userJob = null }) {
    this._userName = userName;
    this._userJob = userJob;
  }

  getUserInfo() {
    return {
      userName: this._userName,
      userJob: this._userJob,
    };
  }

  setUserName(userName) {
    this._userName = userName;
  }

  setUserJob(userJob) {
    this._userJob = userJob;
  }

  setUserInfo() {
    profile.querySelector(".profile__name").textContent = this._userName;
    profile.querySelector(".profile__description").textContent = this._userJob;
  }
}

// singleton pattern in ES modules...
// no need to create multiple instances of UserInfo
const userInfo = new UserInfo();
export default userInfo;

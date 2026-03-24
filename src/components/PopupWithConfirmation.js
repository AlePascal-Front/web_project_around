import Popup from "./Popup.js";

export default class PopupWithConfirmation extends Popup {
  constructor(popupTemplateId) {
    super(popupTemplateId);
    //this._deleteConfirmationCallback = deleteConfirmationCallback.bind(this);
  }

  setEventListeners() {
    super.setEventListeners();
    this._popupTemplateContent
      .querySelector(".popup__confirm-delete-bttn")
      .addEventListener("click", () => {
        this._deleteConfirmationCallback();
      });
  }

  open() {
    super.open();
  }

  close() {
    super.close();
  }
}

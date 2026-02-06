import Popup from "./Popup.js";

export default class PopupWithImage extends Popup {
  constructor(popupTemplateSelector, { imageSrc, imageCaption }) {
    super(popupTemplateSelector);
    this._imageSrc = imageSrc;
    this._imageCaption = imageCaption;
  }

  open() {
    this._popupTemplateContent.querySelector(".popup__visualize-img-image").src = this._imageSrc;
    super.open();
  }

  close() {
    super.close();
  }

  setEventListeners() {
    super.setEventListeners();
  }
}

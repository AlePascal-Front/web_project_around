import Popup from "./Popup.js";

export default class PopupWithImage extends Popup {
  constructor(popupTemplateId, { imageSrc, imageCaption }) {
    super(popupTemplateId);
    this._imageSrc = imageSrc;
    this._imageCaption = imageCaption;
  }

  open() {
    this._popupTemplateContent.querySelector(
      ".popup__visualize-img-image",
    ).src = this._imageSrc;
    this._popupTemplateContent.querySelector(
      ".popup__visualize-img-name",
    ).textContent = this._imageCaption;
    this._popupTemplateContent.firstElementChild.classList.add("popup__visualize-img_opened");
    super.open();
  }

  close() {
    super.close();
  }

  setEventListeners() {
    super.setEventListeners();
  }

  getPopupTemplateContent() {
    return super.getPopupTemplateContent();
  }
}

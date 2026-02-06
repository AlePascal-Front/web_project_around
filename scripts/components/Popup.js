import { DOM } from "../utils/dom";
const { layout, popup } = DOM;

export default class Popup {
  constructor(popupTemplateSelector) {
    this._popupTemplateContent = document
      .querySelector(popupTemplateSelector)
      .content.cloneNode(true);
  }

  open() {
    layout.classList.add("page__opaque-layout_active");
    popup.add("popup_opened");
    popup.append(this._popupTemplateContent);
  }

  close() {
    layout.classList.remove("page__opaque-layout_active");
    popup.classList.remove("popup_opened");
    popup.replaceChildren();
  }

  _handleEscClose(e) {
    if (e.code === "Escape") {
      this.close();
    }
  }

  getPopupTemplateContent() {
    return this._popupTemplateContent;
  }

  setEventListeners() {
    this._popupTemplateContent
      .querySelector(".popup__close-button")
      .addEventListener("click", () => {
        this.close();
      });
    document.addEventListener("keydown", this._handleEscClose);
    layout.addEventListener("click", () => this.close());
  }
}

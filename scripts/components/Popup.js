import { DOM } from "../utils/dom.js";
const { layout, popup } = DOM;

export default class Popup {
  constructor(popupTemplateId) {
    this._popupTemplateContent = document
      .getElementById(popupTemplateId)
      .content.cloneNode(true);
  }

  open() {
    layout.classList.add("page__opaque-layout_active");
    popup.classList.add("popup_opened");
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

  _closeLayoutByClick(e) {
    const targetClasses = e.target.classList;
    const hasEitherClass =
      targetClasses.contains("popup__visualize-img-container") ||
      targetClasses.contains("page__opaque-layout_active") ||
      targetClasses.contains("popup__visualize-img_opened") ||
      targetClasses.contains("popup");

    if (hasEitherClass && popup.children.length > 0) {
      this.close();
    }
  }

  getPopupTemplateContent() {
    return this._popupTemplateContent;
  }

  setEventListeners() {
    this._popupTemplateContent
      .querySelector(".popup__close-icon")
      .addEventListener("click", () => {
        this.close();
      });

    document.addEventListener("keydown", this._handleEscClose.bind(this));
    document.addEventListener("click", this._closeLayoutByClick.bind(this));
  }
}

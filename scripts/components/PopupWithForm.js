import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(popupTemplateId, submitCallback) {
    super(popupTemplateId);
    this._submitCallback = submitCallback;
  }

  open() {
    this._popupTemplateContent.firstElementChild.classList.add(
      "popup_form-opened",
    );
    super.open();
  }

  close() {
    const formIndx = 0;
    //document.forms[formIndx].reset();
    console.log(document.forms)
    super.close();
  }

  _getUserInput() {
    const formIndx = 0;
    const form = document.forms[formIndx];
    const userInput = [];
    Array.from(form.elements).forEach((input) => {
      if (input instanceof HTMLInputElement && input.type !== "submit") {
        userInput.push(input.value);
      }
    });
    return userInput;
  }

  _closeLayoutByClick(e) {
    const targetClasses = e.target.classList;
    const hasEitherClass =
      targetClasses.contains("popup__visualize-img__container") ||
      targetClasses.contains("page__opaque-layout_active") ||
      targetClasses.contains("popup__visualize-img_opened");

    if (hasEitherClass) {
      if (popup.children.length > 0) {
      } else if (imageContainer.children.length > 0) {
        layout.classList.remove("page__opaque-layout_active");
        imageContainer.classList.remove("visualize-img_opened");
        imageContainer.replaceChildren();
      }
    }
  }

  setEventListeners() {
    const form = this._popupTemplateContent.firstElementChild;
    form.addEventListener("submit", this._submitCallback);

    const submitBttn = this._popupTemplateContent.lastElementChild;
    form.addEventListener("keypress", (e) => {
      // prevents the form from submitting when pressing
      // "enter" key
      if (e.code === "Enter") e.preventDefault();

      // allows user to 'submit' using enter key
      if (
        e.target.classList.contains("popup__form-input") &&
        e.target.type !== "submit" &&
        e.code === "Enter" &&
        !submitBttn.disabled
      ) {
        this._submitCallback;
      }
    });
    super.setEventListeners();
  }

  getPopupTemplateContent() {
    return super.getPopupTemplateContent();
  }
}

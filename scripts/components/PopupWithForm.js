import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(popupTemplateSelector, submitCallback) {
    super(popupTemplateSelector);
    this._submitCallback = submitCallback;
  }

  open() {
    super.open();
  }

  close() {
    if (document.forms["popup-form"]) {
      document.forms["popup-form"].reset();
    } else {
      // delete this line once the implementation is working
      console.error("'popup-form' not found.");
    }
    super.close();
  }

  _getUserInput() {
    if (document.forms["popup-form"]) {
      let userInput = [];
      const form = document.forms["popup-form"];
      Array.from(form.elements).forEach((input) => {
        if (input instanceof HTMLInputElement && input.type !== "submit") {
          userInput.push(input.value);
        }
      });
      return userInput;
    }
  }

  setEventListeners() {
    if (document.forms["popup-form"]) {
      document.forms["popup-form"].addEventListener(
        "submit",
        this._submitCallback,
      );
    } else {
      // delete this line once the implementation is working
      console.error("'popup-form' not found.");
    }
    let submitBttn = document.getElementById("submit-button");
    // allows user to 'submit' using enter key
    form.addEventListener("keypress", (e) => {
      // prevents the form from submitting when pressing
      // "enter" key
      if (e.code === "Enter") e.preventDefault();

      if (
        e.target.classList.contains("popup__input") &&
        e.target.type !== "submit" &&
        e.code === "Enter" &&
        !submitBttn.disabled
      ) {
        this._submitCallback;
      }
    });
    super.setEventListeners();
  }
}

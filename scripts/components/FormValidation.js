export default class FormValidation {
  constructor(config, form) {
    this._config = config;
    this._form = form;
  }

  _hideWarning(spanElementWarning) {
    spanElementWarning.classList.remove(this._config.errorClass);
    spanElementWarning.textContent = "";
  }

  _showWarning(warningTxt, spanElementWarning) {
    spanElementWarning.classList.add(this._config.errorClass);
    spanElementWarning.textContent = warningTxt;
  }

  _attachListenersToInputs() {
    const formInputs = Array.from(
      this._form.querySelectorAll(this._config.inputSelector),
    );
    const formBttn = this._form.lastElementChild;
    const formBttnClasses = formBttn.classList;

    // both of them have to be valid in order to enable button
    formInputs.forEach((input) => {
      input.addEventListener("input", () => {
        const spanElementWarning = input.nextElementSibling;
        const errorMessage = input.validationMessage;
        if (!input.validity.valid) {
          this._showWarning(errorMessage, spanElementWarning);
        } else {
          this._hideWarning(spanElementWarning);
        }

        const areAllValid = formInputs.every((inpt) => inpt.validity.valid);
        if (areAllValid) {
          formBttnClasses.remove(this._config.inactiveButtonClass);
          formBttnClasses.add(
            this._config.activeButtonClass,
            "popup__form-button_hover",
          );
          formBttn.disabled = false;
        } else {
          formBttnClasses.remove(
            this._config.activeButtonClass,
            "popup__button_hover",
          );
          formBttnClasses.add(this._config.inactiveButtonClass);
          formBttn.disabled = true;
        }
      });
    });
  }

  enableValidation() {
    this._attachListenersToInputs();
  }
}

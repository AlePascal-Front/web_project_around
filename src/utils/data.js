export const formPopupData = {
  "edit-profile": {
    title: "Editar perfil",
    input1: {
      placeholder: "Nombre",
      name: "userName",
      id: "userName",
      inputType: "text",
      lengthRange: ["2", "40"],
      isRequired: true,
    },
    input2: {
      placeholder: "Descripción",
      name: "userDescription",
      id: "userDescription",
      inputType: "text",
      lengthRange: ["2", "200"],
      isRequired: true,
    },
  },
  "add-card": {
    title: "Añadir tarjeta",
    input1: {
      placeholder: "Título",
      name: "userTitle",
      id: "userTitle",
      inputType: "text",
      lengthRange: [2, 30],
      isRequired: true,
    },
    input2: {
      placeholder: "Enlace",
      name: "userLink",
      id: "userLink",
      inputType: "url",
      lengthRange: null,
      isRequired: true,
    },
  },
  "edit-photo": {
    title: "Cambiar foto de perfil",
    input1: {
      placeholder: "Enlace",
      name: "userPicture",
      id: "userPicture",
      inputType: "url",
      lengthRange: null,
      isRequired: true,
    },
  },
};

export const validationConfig = {
  inputSelector: ".popup__form-input",
  submitButtonId: "submit-button",
  inactiveButtonClass: "popup__form-button_disabled",
  activeButtonClass: "popup__form-button",
  errorClass: "popup__form-span_error-msg",
};
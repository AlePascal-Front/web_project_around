export const cards = [
  {
    name: "Acapulco",
    link: "images/acapulco600w,450h.jpg",
    alt: "picture of Acapulco",
    origin: "initial",
  },
  {
    name: "Chichen Itza",
    link: "images/chichen-itza600w,400h.jpg",
    alt: "picture of Chichen Itza",
    origin: "initial",
  },
  {
    name: "Edinburgh",
    link: "images/edimburgo600w,400h.jpg",
    alt: "picture of Edinburgh",
    origin: "initial",
  },
  {
    name: "Louvre",
    link: "images/louvre-museum600w,400h.jpg",
    alt: "picture of Louvre",
    origin: "initial",
  },
  {
    name: "Shanghai",
    link: "images/shangai600w,400h.jpg",
    alt: "picture of Shangai",
    origin: "initial",
  },
  {
    name: "Tokyo",
    link: "images/tokyo600w,399h.jpg",
    alt: "picture of Tokyo",
    origin: "initial",
  },
];

export const popupData = {
  "edit-profile": {
    title: "Editar perfil",
    closeButton: "images/Close Icon.png",
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
    closeButton: "images/Close Icon.png",
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
};

export const validationConfig = {
  inputSelector: ".popup__input",
  submitButtonId: "submit-button",
  inactiveButtonClass: "popup__button_disabled",
  activeButtonClass: "popup__button",
  errorClass: "popup__span_error-msg",
};

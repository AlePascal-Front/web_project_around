const page = document.querySelector(".page");
const header = page.querySelector(".header");
const profile = page.querySelector(".profile");
const content = page.querySelector(".content");
const footer = page.querySelector(".footer");

const editBttn = content.querySelector(".profile__edit-button");
const editSvg = content.querySelector(".profile__edit-button-svg");
const addBttn = content.querySelector(".profile__add-button");

// const popup = content.querySelector(".popup");
// const popupContainer = popup.querySelector(".popup__container");
// const popupCloseBttn = popup.querySelector(".popup__close-button");
// const popupSaveBttn = popup.querySelector(".popup__button");

// let inputFields = Array.from(popup.querySelectorAll(".popup__input"));

const initialCards = [
  {
    name: "Acapulco",
    link: "../images/acapulco.jpg"
  },
  {
    name: "Chichen Itza",
    link: "../images/chichen-itza.jpg"
  },
  {
    name: "Edinburgh",
    link: "../images/edimburgo.jpg"
  },
  {
    name: "Louvre",
    link: "../images/louvre-museum.jpg"
  },
  {
    name: "Shanghai",
    link: "../images/shangai.jpg"
  },
  {
    name: "Tokyo",
    link: "../images/tokyo.jpg"
  }
];

const popupElements = {
  "edit-profile": {
    title: "Editar perfil",
    placeholderOne: "Escribe tu nombre",
    placeholderTwo: "Escribe tu descripción"
  },
  "add-card": {
    title: "Añadir tarjeta",
    placeholderOne: "Escribe tu título",
    placeholderTwo: "Escribe tu enlace"
  }
}

/**
 * @returns {DocumentFragment}
 */
function getCardsTemplate() {
  return document.getElementById("card-template").content.cloneNode(true);
}

function getPopUpTemplate() {
  return document.getElementById("popup-template").content.cloneNode(true);
}

function createCard(template, cardData) {
  template.querySelector(".card__title").textContent = cardData.name;
  template.querySelector(".card__image").src = cardData.link;
}

function renderInitialCards() {
  let cardContainer = document.querySelector(".cards__grid");
  initialCards.forEach((cardData) => {
    let template = getCardsTemplate();
    createCard(template, cardData);
    cardContainer.append(template);
  });
}

function renderPopUp() {

}

function getEmptyFields() {
  let empty = {};
  for (let i = 0; i < inputFields.length; i++) {
    if (inputFields[i].value === "") {
      empty[i] = inputFields[i];
    }
  }

  return Object.keys(empty).length === 0 ? null : empty;
}

function showWarning(emptyF) {
  for (const key in emptyF) {
    // conditional that prevents creating multiple instances of the same warning msg
    if (emptyF[key].nextSibling.tagName === "P") {
      continue;
    }
    warningMsg = document.createElement("p");
    warningMsg.textContent = "* Por favor, llena todos los campos";
    warningMsg.classList.add("popup__warning-msg");
    // warningMsg.style.position = "absolute";

    emptyF[key].insertAdjacentElement("afterend", warningMsg);
  }
}

function updateUserProfile(inputArr) {
  profile.querySelector(".profile__name").textContent = inputArr[0];
  profile.querySelector(".profile__description").textContent = inputArr[1];
}

function getUserInput(e) {
  // prevents page reload
  e.preventDefault();

  let userName = inputFields[0].value;
  let userAbout = inputFields[1].value;

  return [userName, userAbout];
}

function hidePopUp(e) {
  popup.classList.remove("popup_opened");
  document.querySelector(".page__opaque-layout")?.remove();

  // prevents scroll to top of the page when clicking close button
  e.preventDefault();
}

function showPopUp() {
  // debugger;
  popup.classList.add("popup_opened");
  inputFields[0].value = profile.querySelector(".profile__name").textContent;
  inputFields[1].value = profile.querySelector(".profile__description").textContent;

  if (popup.classList.contains("popup_opened")) {
    let opaqueDiv = document.createElement("div");
    opaqueDiv.classList.add("page__opaque-layout");
    page.insertAdjacentElement("afterbegin", opaqueDiv);
  }
}

function handleSubmit(e) {
  e.preventDefault();
  userInfo = getUserInput(e);
  emptyFields = getEmptyFields();

  if (emptyFields !== null) {
    showWarning(emptyFields);
    return;
  }

  updateUserProfile(userInfo);
  hidePopUp(e);
}

let warningMsg;
let userInfo;
let emptyFields;


renderInitialCards();
editBttn.addEventListener("click", showPopUp);
addBttn.addEventListener("click",)
popupCloseBttn.addEventListener("click", hidePopUp);
popupSaveBttn.addEventListener("click", (e) => {
  handleSubmit(e);
});

// give user the ability to submit with enter key
for (let i = 0; i < inputFields.length; i++) {
  inputFields[i].addEventListener("keypress", (e) => {
    if(e.code === "Enter") {
      handleSubmit(e);
    }
  });
  // remove warning message once the user starts typing
  inputFields[i].addEventListener("input", () => {
    if(inputFields[i].nextSibling.tagName === "P") {
      inputFields[i].nextSibling.remove();
    }
  });
}

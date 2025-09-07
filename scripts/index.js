const page = document.querySelector(".page");
const header = page.querySelector(".header");
const profile = page.querySelector(".profile");
const content = page.querySelector(".content");
const footer = page.querySelector(".footer");

const editBttn = content.querySelector(".profile__edit-button");
const editSvg = content.querySelector(".profile__edit-button-svg");
const addBttn = content.querySelector(".profile__add-button");

const popup = content.querySelector(".popup");

const initialCards = [
  {
    name: "Acapulco",
    link: "../images/acapulco.jpg",
  },
  {
    name: "Chichen Itza",
    link: "../images/chichen-itza.jpg",
  },
  {
    name: "Edinburgh",
    link: "../images/edimburgo.jpg",
  },
  {
    name: "Louvre",
    link: "../images/louvre-museum.jpg",
  },
  {
    name: "Shanghai",
    link: "../images/shangai.jpg",
  },
  {
    name: "Tokyo",
    link: "../images/tokyo.jpg",
  },
];

const popupElements = {
  "edit-profile": {
    title: "Editar perfil",
    placeholder1: "Nombre",
    placeholder2: "Descripción",
    nameAndId1: "userName",
    nameAndId2: "userDescription",
    closeButton: "../images/Close Icon.png",
    inputFields: [],
  },
  "add-card": {
    title: "Añadir tarjeta",
    placeholder1: "Título",
    placeholder2: "Enlace",
    closeButton: "../images/Close Icon.png",
    nameAndId1: "userTitle",
    nameAndId2: "userLink",
    inputFields: [],
  },
};

let isPopupActive = false;
let popupId;

/**
 * @returns {DocumentFragment}
 */
function getCardsTemplate() {
  return document.getElementById("card-template").content.cloneNode(true);
}

/**
 * @returns {DocumentFragment}
 */
function getPopUpTemplate() {
  return document.getElementById("popup-template").content.cloneNode(true);
}

function createCard(template, cardData) {
  template.querySelector(".card__title").textContent = cardData.name;
  template.querySelector(".card__image").src = cardData.link;
}

function createPopup(template, id) {
  debugger
  console.log(id);
  template.querySelector(".popup__close-icon").src =
    popupElements[id].closeButton;
  template.querySelector(".popup__title").textContent = popupElements[id].title;

  Array.from(template.querySelectorAll(".popup__input")).forEach(
    (input, indx) => {
      input.name = popupElements[id][`nameAndId${indx + 1}`];
      input.id = popupElements[id][`nameAndId${indx + 1}`];
      input.placeholder = popupElements[id][`placeholder${indx + 1}`];
      popupElements[id].inputFields.push(input);
    }
  );
}

function renderInitialCards() {
  let cardContainer = document.querySelector(".cards__grid");
  initialCards.forEach((cardData) => {
    let template = getCardsTemplate();
    createCard(template, cardData);
    cardContainer.append(template);
  });
}

function renderPopUp(id) {
  let template = getPopUpTemplate();

  if(!isPopupActive) createPopup(template, id);

  let appended = popup.appendChild(template);
  console.log(appended)

  Array.from(popup.querySelectorAll(".popup__input")).forEach((input) => {
    input.addEventListener("keypress", (e) => {
      if(e.code === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    });
    input.addEventListener("input", () => {
      if(input.nextSibling.tagName === "p") {
        input.nextSibling.remove();
      }
    });
  });

  popup.querySelector(".popup__container").addEventListener("submit", (e) => {
    e.preventDefault();
    handleSubmit();
  });

  popup.querySelector(".popup__close-button").addEventListener("click", hidePopUp)

  showPopUp(appended);
}

function getEmptyFields(inputFields) {
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

function getUserInput(inputs) {
  let firstUserInput = inputs[0].value;
  let secondUserInput = inputs[1].value;
  popupElements[popupId].inputFields = [];

  return [firstUserInput, secondUserInput];
}

function hidePopUp(e) {
  popup.classList.remove("popup_opened");
  document.querySelector(".page__opaque-layout")?.remove();
  isPopupActive = false;

  // prevents scroll to top of the page when clicking close button
  e.preventDefault();
}

function showPopUp(appendedPopup) {
  // debugger;
  if (appendedPopup) {
    document.querySelector(".popup").classList.add("popup_opened");
    let opaqueDiv = document.createElement("div");
    opaqueDiv.classList.add("page__opaque-layout");
    page.insertAdjacentElement("afterbegin", opaqueDiv);
  }
  isPopupActive = true;
}

function handlePopup() {
  if (popup.children.length > 0) {
    popup.children[0].remove();
  }
  renderPopUp(popupId);
}

function handleSubmit() {
  userInfo = getUserInput(popupElements[popupId].inputFields);
  emptyFields = getEmptyFields(popupElements[popupId].inputFields);

  if (emptyFields !== null) {
    showWarning(emptyFields);
    return;
  }

  if (popupId === "edit-profile") {
    updateUserProfile(userInfo);
  } else {
    // call function for rendering user card
  }
  hidePopUp(e);
}

let warningMsg;
let userInfo;
let emptyFields;

renderInitialCards();
editBttn.addEventListener("click", (e) => {
  popupId = e.target.closest(".profile__edit-button").id;
  handlePopup(popupId);
});
addBttn.addEventListener("click", (e) => {
  popupId = e.target.closest(".profile__add-button").id;
  handlePopup(popupId);
});

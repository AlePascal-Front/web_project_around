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
    links: {
      originalSize: "../images/acapulco-original.jpg",
      mediumSize: "../images/acapulco700w,525h.jpg",
      smallSize: "../images/acapulco600w,450h.jpg",
    },
    alt: "picture of Acapulco",
  },
  {
    name: "Chichen Itza",
    links: {
      originalSize: "../images/chichen-itza-original.jpg",
      mediumSize: "../images/chichen-itza700w,467h.jpg",
      smallSize: "../images/chichen-itza600w,400h.jpg",
    },
    alt: "picture of Chichen Itza",
  },
  {
    name: "Edinburgh",
    links: {
      originalSize: "../images/edimburgo-original.jpg",
      mediumSize: "../images/edimburgo700w,467h.jpg",
      smallSize: "../images/edimburgo600w,400h.jpg",
    },
    alt: "picture of Edinburgh",
  },
  {
    name: "Louvre",
    links: {
      originalSize: "../images/louvre-museum-original.jpg",
      mediumSize: "../images/louvre-museum600w,400h.jpg",
      smallSize: "../images/louvre-museum700w,467h.jpg",
    },
    alt: "picture of Louvre",
  },
  {
    name: "Shanghai",
    links: {
      originalSize: "../images/shangai-original.jpg",
      mediumSize: "../images/shangai700w,467h.jpg",
      smallSize: "../images/shangai600w,400h.jpg",
    },
    alt: "picture of Shangai",
  },
  {
    name: "Tokyo",
    links: {
      originalSize: "../images/tokyo-original.jpg",
      mediumSize: "../images/tokyo700w,466h.jpg",
      smallSize: "../images/tokyo600w,399h.jpg",
    },
    alt: "picture of Tokyo",
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
  const imageElem = template.querySelector(".card__image");
  imageElem.srcset = `${cardData.links.mediumSize}, ${cardData.links.smallSize}`;
  imageElem.alt = `${cardData.alt}`;
}

function createUserCard(temp = null, cardD) {
  debugger;
  temp = getCardsTemplate();
  const cardTitle = cardD[0];
  const cardLink = cardD[1];

  temp.querySelector(".card__title").textContent = cardTitle;
  temp.querySelector(".card__image").src = cardLink;
  let cardContainer = document.querySelector(".cards__grid");
  cardContainer.prepend(temp);
}

function createPopup(template, id) {
  debugger;
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

  if (!isPopupActive) createPopup(template, id);

  let appended = popup.appendChild(template);
  console.log(appended);

  Array.from(popup.querySelectorAll(".popup__input")).forEach((input) => {
    input.addEventListener("keypress", (e) => {
      if (e.code === "Enter") {
        e.preventDefault();
        handleSubmit(e);
      }
    });
    input.addEventListener("input", () => {
      if (input.nextSibling.tagName === "p") {
        input.nextSibling.remove();
      }
    });
  });

  popup.querySelector(".popup__container").addEventListener("submit", (e) => {
    e.preventDefault();
    handleSubmit(e);
  });

  popup
    .querySelector(".popup__close-button")
    .addEventListener("click", hidePopUp);

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
  debugger
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

function handleSubmit(e) {
  userInfo = getUserInput(popupElements[popupId].inputFields);
  emptyFields = getEmptyFields(popupElements[popupId].inputFields);

  if (emptyFields !== null) {
    showWarning(emptyFields);
    return;
  }

  if (popupId === "edit-profile") {
    updateUserProfile(userInfo);
  } else {
    createUserCard(null, userInfo);
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

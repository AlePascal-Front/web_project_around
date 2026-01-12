const page = document.querySelector(".page");
const profile = page.querySelector(".profile");
const content = page.querySelector(".content");

const editBttn = content.querySelector(".profile__edit-button");
const editSvg = content.querySelector(".profile__edit-button-svg");
const addBttn = content.querySelector(".profile__add-button");

const popup = content.querySelector(".popup");
const opaqueLayout = page.querySelector(".page__opaque-layout");
const imageContainer = page.querySelector(".visualize-img");

const cards = [
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

const popupElements = {
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

let popupId;
let userInfo;
let areThereNoCards = false;
let areInitialCardsRendered = false;

/**
 * @returns {DocumentFragment}
 */
function getTemplateContent(id) {
  return document.getElementById(id).content.cloneNode(true);
}

function createCard(cardData) {
  const cardTemplateContent = getTemplateContent("card-template");

  cardTemplateContent.querySelector(".card__title").textContent = cardData.name;
  const imageElem = cardTemplateContent.querySelector(".card__image");
  imageElem.srcset = `${cardData.link}`;
  imageElem.alt = `${cardData.alt}`;

  if (areInitialCardsRendered) {
    cards.push(cardData);
  }
  return cardTemplateContent;
}

function createPopup(popupTemplateContent, id) {
  popupTemplateContent.querySelector(".popup__close-icon").src =
    popupElements[id].closeButton;
  popupTemplateContent.querySelector(".popup__title").textContent =
    popupElements[id].title;
  popupTemplateContent.querySelector(".popup__container").id = id;
  const inputs = Array.from(
    popupTemplateContent.querySelectorAll(".popup__input")
  );

  inputs.forEach((input, indx) => {
    input.placeholder = popupElements[id][`input${indx + 1}`].placeholder;
    input.name = popupElements[id][`input${indx + 1}`].name;
    input.id = popupElements[id][`input${indx + 1}`].id;
    input.type = popupElements[id][`input${indx + 1}`].inputType;

    let lengthRang = popupElements[id][`input${indx + 1}`].lengthRange;
    if (lengthRang != null) {
      input.setAttribute("minlength", lengthRang[0]);
      input.setAttribute("maxlength", lengthRang[1]);
    }

    let required = popupElements[id][`input${indx + 1}`].isRequired;
    if (required) {
      input.setAttribute("required", "");
    }
  });
}

function renderInitialCards() {
  let cardsContainer = document.querySelector(".cards__grid");
  cards.forEach((card) => {
    const cardTemplateContent = createCard(card);
    cardsContainer.append(cardTemplateContent);
  });

  setDeleteCardEvent(cardsContainer);
  setCardsLikeButtonsEvent(cardsContainer);
  setClickCardImageEvent(cardsContainer);
  areInitialCardsRendered = true;
}

function setVisualizeImages(cardElement) {
  opaqueLayout.classList.add("page__opaque-layout_active");
  const visualizeImagetemplateContent = getTemplateContent(
    "visualize-img-template"
  );

  const image = visualizeImagetemplateContent.querySelector(
    ".visualize-img__image"
  );

  const paragraphImageName = visualizeImagetemplateContent.querySelector(
    ".visualize-img__img-name"
  );

  const closeIcon = visualizeImagetemplateContent.querySelector(
    ".visualize-img__close-icon"
  );

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");

  image.src = cardImage.srcset;
  image.alt = cardImage.alt;
  paragraphImageName.textContent = cardTitle.textContent;

  imageContainer.classList.add("visualize-img_opened");
  imageContainer.append(visualizeImagetemplateContent);

  document.addEventListener("keydown", handleKeyPressedWhilePopOpen);
  document.addEventListener("click", handleClickOnAnyOpaqueElement);
  closeIcon.addEventListener("click", hidePopUp);
}

function handleClickOnAnyOpaqueElement(e) {
  const targetClasses = e.target.classList;
  const hasEitherClass =
    targetClasses.contains("visualize-img__container") ||
    targetClasses.contains("visualize-img_opened") ||
    targetClasses.contains("page__opaque-layout_active");

  if (hasEitherClass) {
    imageContainer.classList.remove("visualize-img_opened");
    if (imageContainer.children.length !== 0) {
      imageContainer.children[0].remove();
    }
    hidePopUp();
  }
}

function renderPopUp(id) {
  const popupTemplateContent = getTemplateContent("popup-template");

  createPopup(popupTemplateContent, id);
  popup.append(popupTemplateContent);
  let form = document.getElementById(id);

  form.addEventListener("keypress", (e) => {
    if (
      e.target.classList.contains("popup__input") &&
      e.target.type !== "submit" &&
      e.code === "Enter"
    ) {
      userInfo = getUserInput(form);
      handleSubmit();
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    userInfo = getUserInput(form);
    handleSubmit(e);
  });

  const popupCloseButton = popup.querySelector(".popup__close-button");
  popupCloseButton.addEventListener("click", hidePopUp);
  showPopUp();
}

function renderNoCardsLayout(cardsContainer) {
  areThereNoCards = true;
  const noCardsTemplateContent = getTemplateContent("no-cards-icon-template");
  const svg = noCardsTemplateContent.firstElementChild;
  const noCardsParagraph = noCardsTemplateContent.querySelector(
    ".cards__no-cards-msg"
  );
  cardsContainer.classList.add("cards__flex");
  svg.classList.add("cards__no-cards-svg");

  cardsContainer.append(svg);
  cardsContainer.append(noCardsParagraph);
}

function getUserInput(form) {
  let inputs = Array.from(form.elements);
  let userInput = [];
  inputs.forEach((input) => {
    if (input instanceof HTMLInputElement && input.type !== "submit") {
      userInput.push(input.value);
    }
  });

  if (popupId === "add-card") {
    userInput = mutateUserInputIntoCardObj(userInput);
  }

  return userInput;
}

function mutateUserInputIntoCardObj(userInput) {
  const entries = new Map([
    ["name", null],
    ["link", null],
    ["alt", "user card"],
    ["origin", "user"],
  ]);
  const cardObj = Object.fromEntries(entries);

  cardObj.name = userInput[0];
  cardObj.link = userInput[1];
  return cardObj;
}

function setCardsLikeButtonsEvent(cardsContainer) {
  cardsContainer.addEventListener("click", (e) => {
    const likeBttn = e.target.closest(".card__like-button-svg");
    if (!likeBttn) return;

    likeBttn.classList.toggle("card__like-button-svg_active");
  });
}

function setDeleteCardEvent(cardsContainer) {
  cardsContainer.addEventListener("click", (e) => {
    const deleteBttn = e.target.closest(".card__delete-button-svg");
    if (!deleteBttn) return;

    deleteCard(deleteBttn.closest(".card"));
    if (cardsContainer.children.length > 0) return;
    else if (cardsContainer.children.length === 0) {
      renderNoCardsLayout(cardsContainer);
    }
  });
}

function setClickCardImageEvent(cardsContainer) {
  cardsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("card__image")) {
      const cardElement = e.target.closest(".card");
      setVisualizeImages(cardElement);
    }
  });
}

function hidePopUp(e = null) {
  opaqueLayout.classList.remove("page__opaque-layout_active");
  const popupClasses = popup.classList;
  const imageContainerClasses = imageContainer.classList;

  if (popupClasses.contains("popup_opened")) {
    popupClasses.remove("popup_opened");
    popup.replaceChildren();
  } else if (imageContainerClasses.contains("visualize-img_opened")) {
    imageContainerClasses.remove("visualize-img_opened");
    imageContainer.replaceChildren();
  }

  document.removeEventListener("keydown", handleKeyPressedWhilePopOpen);
  document.removeEventListener("click", handleClickOnAnyOpaqueElement);

  if (e !== null) {
    // prevents scroll to top of the page when clicking close button
    e.preventDefault();
  }
}

function showPopUp() {
  popup.classList.add("popup_opened");
  const formContainer = page.querySelector(".popup");
  enableValidation(formContainer);
  opaqueLayout.classList.add("page__opaque-layout_active");

  // retrieve any key pressed and handle its behavior
  document.addEventListener("keydown", handleKeyPressedWhilePopOpen);

  // enables exiting form by clicking outside of it
  document.addEventListener("click", handleClickOnAnyOpaqueElement);
}

function enableValidation() {
  const form = document.getElementById(popupId);
  const formInputs = Array.from(form.elements);
  const formBttn = document.getElementById("submit-button");

  // both of them have to be valid in order to enable button
  formInputs.forEach((input) => {
    input.addEventListener("input", () => {
      const spanElement = input.nextElementSibling;
      const errorMessage = input.validationMessage;
      if (!input.validity.valid) {
        showWarning(spanElement, errorMessage);
      } else {
        hideWarning(spanElement);
      }

      const areAllValid = formInputs.every((inpt) => inpt.validity.valid);
      if (areAllValid) {
        formBttn.classList.remove("popup__button_disabled");
        formBttn.classList.add("popup__button", "popup__button_hover");
        formBttn.disabled = false;
      } else {
        formBttn.classList.remove("popup__button", "popup__button_hover");
        formBttn.classList.add("popup__button_disabled");
        formBttn.disabled = true;
      }
    });
  });
}

function deleteCard(card) {
  card.remove();
}

function showWarning(spanElement, warningTxt) {
  spanElement.classList.add("popup__span_error-msg");
  spanElement.textContent = warningTxt;
}

function hideWarning(spanElement) {
  spanElement.classList.remove("popup__error-msg");
  spanElement.textContent = "";
}

function updateUserProfile(inputArr) {
  profile.querySelector(".profile__name").textContent = inputArr[0];
  profile.querySelector(".profile__description").textContent = inputArr[1];
}

function removeNoCardsLayout() {
  if (page.querySelector(".cards__grid") !== null) {
    const noCardsContainer = page.querySelector(".cards__grid");
    noCardsContainer.classList.remove("cards__flex");
    noCardsContainer.replaceChildren();
  }
}

function handleKeyPressedWhilePopOpen(e) {
  if (e.key === "Escape") {
    hidePopUp();
  }
}

function handlePopup() {
  renderPopUp(popupId);
}

function handleSubmit(e) {
  if (popupId === "edit-profile") {
    updateUserProfile(userInfo);
  } else if (popupId === "add-card") {
    const newCard = createCard(userInfo);
    const cardsContainer = page.querySelector(".cards__grid");

    if (areThereNoCards) {
      removeNoCardsLayout();
      cardsContainer.prepend(newCard);
    } else {
      cardsContainer.prepend(newCard);
    }
  }
  hidePopUp(e);
}

document.addEventListener("DOMContentLoaded", () => {
  renderInitialCards();

  editBttn.addEventListener("click", (e) => {
    popupId = e.target.closest(".profile__edit-button").id;
    handlePopup(popupId);
  });

  addBttn.addEventListener("click", (e) => {
    popupId = e.target.closest(".profile__add-button").id;
    handlePopup(popupId);
  });
});

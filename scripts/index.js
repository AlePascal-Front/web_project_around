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
    input_1: {
      placeholder: "Nombre",
      name: "userName",
      id: "userName",
      inputType: "text",
      lengthRange: ["2", "40"],
      isRequired: true,
    },
    input_2: {
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
    placeholder1: "Título",
    placeholder2: "Enlace",
    closeButton: "images/Close Icon.png",
    nameAndId1: "userTitle",
    nameAndId2: "userLink",
    input_1: {
      placeholder: "Título",
      name: "userTitle",
      id: "userTitle",
      inputType: "text",
      lengthRange: [2, 30],
      isRequired: true,
    },
    input_2: {
      placeholder: "Enlace",
      name: "userLink",
      id: "userLink",
      inputType: "url",
      lengthRange: null,
      isRequired: true,
    },
  },
};

let isPopupActive = false;
let popupId;
let deleteButtons;
let cardImages;

/**
 * @returns {DocumentFragment}
 */
function getTemplateContent(id) {
  return document.getElementById(id).content.cloneNode(true);
}

function createCard(cardTemplateContent, cardData) {
  cardTemplateContent.querySelector(".card__title").textContent = cardData.name;
  const imageElem = cardTemplateContent.querySelector(".card__image");
  imageElem.srcset = `${cardData.link}`;
  imageElem.alt = `${cardData.alt}`;
}

function createUserCard(cardTempContent = null, cardData) {
  cardTempContent = getTemplateContent("card-template");
  const cardTitle = cardData[0];
  const cardLink = cardData[1];
  const imageAlt = "user card";
  const origin = "user";

  cardTempContent.querySelector(".card__title").textContent = cardTitle;
  cardTempContent.querySelector(".card__image").src = cardLink;
  cardTempContent.querySelector(".card__image").alt = imageAlt;
  let cardContainer = content.querySelector(".cards__grid");

  cards.push({
    name: cardTitle,
    link: cardLink,
    alt: imageAlt,
    origin: origin,
  });

  if (
    cardContainer.firstElementChild.nextElementSibling.classList.contains(
      "cards__no-cards-msg"
    )
  ) {
    cardContainer.classList.remove("cards__flex");
    // removes all children when no argument is passed
    cardContainer.replaceChildren();
  }

  cardContainer.prepend(temp);

  cardContainer
    .querySelector(".card__delete-button-svg")
    .addEventListener("click", (e) => {
      const cardToRemove = e.target.closest(".card");
      deleteCard(cardToRemove);

      if (cardContainer.children.length > 0) return;
      else if (cardContainer.children.length === 0) {
        // render no cards layout
        const noCardsTemplateContent = getTemplateContent(
          "no-cards-icon-template"
        );
        const svg = noCardsTemplateContent.firstElementChild;
        const noCardsParagraph = noCardsTemplateContent.querySelector(
          ".cards__no-cards-msg"
        );
        cardContainer.classList.add("cards__flex");
        cardContainer.append(svg);
        cardContainer.append(noCardsParagraph);
      }
    });

  cardContainer.querySelector(".card__image").addEventListener("click", (e) => {
    const imageToRender = e.currentTarget;
    setVisualizeImages(null, imageToRender, cardTitle, origin);
  });

  setCardsLikeButtonsEvent("User Card");
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
    input.placeholder = popupElements[id][`input_${indx + 1}`].placeholder;
    input.name = popupElements[id][`input_${indx + 1}`].name;
    input.id = popupElements[id][`input_${indx + 1}`].id;
    input.type = popupElements[id][`input_${indx + 1}`].inputType;

    let lengthRang = popupElements[id][`input_${indx + 1}`].lengthRange;
    if (lengthRang != null) {
      input.setAttribute("minlength", lengthRang[0]);
      input.setAttribute("maxlength", lengthRang[1]);
    }

    let required = popupElements[id][`input_${indx + 1}`].isRequired;
    if (required) {
      input.setAttribute("required", "");
    }
  });
}

function renderInitialCards() {
  let cardContainer = document.querySelector(".cards__grid");
  cards.forEach((card) => {
    let cardtemplateContent = getTemplateContent("card-template");
    createCard(cardtemplateContent, card);
    cardContainer.append(cardtemplateContent);
  });
  deleteButtons = Array.from(
    document.querySelectorAll(".card__delete-button-svg")
  );

  cardImages = Array.from(document.querySelectorAll(".card__image"));

  deleteButtons.forEach((bttn) => {
    bttn.addEventListener("click", (e) => {
      deleteCard(e.target.closest(".card"));

      if (cardContainer.children.length > 0) return;
      else if (cardContainer.children.length === 0) {
        //const noCardsParagraph = document.createElement("p");
        //const svgContainer = document.createElement("div");
        const noCardsTemplateContent = getTemplateContent(
          "no-cards-icon-template"
        );
        const svg = noCardsTemplateContent.firstElementChild;
        const noCardsParagraph = noCardsTemplateContent.querySelector(
          ".cards__no-cards-msg"
        );
        cardContainer.classList.add("cards__flex");
        svg.classList.add("cards__no-cards-svg");
        //svgContainer.insertAdjacentHTML("afterbegin", svgCode);
        /*noCardsParagraph.textContent =
          'Sin lugares que mostrar. ¡Haz clic en el botón "+" para añadir!';
        svg.firstChild.classList.add("cards__no-cards-svg");*/

        cardContainer.append(svg);
        cardContainer.append(noCardsParagraph);
        //cardContainer.append(noCardsParagraph);
      }
    });
  });
  setCardsLikeButtonsEvent("Initial");
}

function setVisualizeImages(
  cardIndex = null,
  imageElement = null,
  imageTitle = null,
  imageOrigin
) {
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

  if (
    cardIndex === null &&
    imageElement !== null &&
    imageTitle !== null &&
    imageOrigin === "user"
  ) {
    paragraphImageName.textContent = imageTitle;
    image.src = imageElement.src;
    image.alt = imageElement.alt;
  }
  image.src = cardIndex !== null ? cards[cardIndex].link : image.src;

  imageContainer.classList.add("visualize-img_opened");
  paragraphImageName.textContent =
    paragraphImageName.textContent === ""
      ? cards[cardIndex].name
      : paragraphImageName.textContent;
  imageContainer.append(visualizeImagetemplateContent);

  document.addEventListener("keydown", (e) => {
    imageContainer.classList.remove("visualize-img_opened");
    imageContainer.children[0].remove();
    handleKeyPressedWhilePopOpen(e);
  });

  closeIcon.addEventListener("click", (e) => {
    // removes visualize img container
    imageContainer.classList.remove("visualize-img_opened");
    imageContainer.children[0].remove();
    hidePopUp();
  });

  const visualizeImageContainer = page.querySelector(".visualize-img_opened");
  visualizeImageContainer.addEventListener(
    "click",
    visualizeImageContainerClickHandler
  );

  opaqueLayout.addEventListener("click", opaqueLayoutClickHandler);
}

function visualizeImageContainerClickHandler(e) {
  const targetClasses = e.target.classList;
  const hasEitherClass =
    targetClasses.contains("visualize-img__container") ||
    targetClasses.contains("visualize-img_opened");
  if (hasEitherClass) {
    imageContainer.classList.remove("visualize-img_opened");
    if (imageContainer.children.length !== 0) {
      imageContainer.children[0].remove();
    }
    hidePopUp();
  }
}

function opaqueLayoutClickHandler(e) {
  const targetClasses = e.target.classList;
  const hasClass = targetClasses.contains("page__opaque-layout_active");
  if (hasClass) {
    imageContainer.classList.remove("visualize-img_opened");
    if (imageContainer.children.length !== 0) {
      imageContainer.children[0].remove();
    }
    hidePopUp();
  }
}

function renderPopUp(id) {
  const popupTemplateContent = getTemplateContent("popup-template");

  if (!isPopupActive) createPopup(popupTemplateContent, id);

  let appended = popup.appendChild(popupTemplateContent);
  let form = document.getElementById(id);
  const popupInputs = Array.from(popup.querySelectorAll(".popup__input"));

  popupInputs.forEach((input) => {
    input.addEventListener("keypress", (e) => {
      if (e.code === "Enter") {
        e.preventDefault();
        userInfo = getUserInput(form);
        handleSubmit(e);
      }
    });
  });

  const popupContainer = popup.querySelector(".popup__container");
  popupContainer.addEventListener("submit", (e) => {
    e.preventDefault();
    userInfo = getUserInput(form);
    handleSubmit(e);
  });

  const popupCloseButton = popup.querySelector(".popup__close-button");
  popupCloseButton.addEventListener("click", hidePopUp);
  showPopUp(appended);
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

function getUserInput(form) {
  let inputs = Array.from(form.elements);
  let userInput = [];
  inputs.forEach((input) => {
    if (input instanceof HTMLInputElement && input.type !== "submit") {
      userInput.push(input.value);
    }
  });
  return userInput;
}

function setCardsLikeButtonsEvent(renderingType) {
  if (renderingType === "Initial") {
    const likeButtons = Array.from(
      document.querySelectorAll(".card__like-button-svg")
    );
    likeButtons.forEach((likeBttn) => {
      likeBttn.addEventListener("click", () => {
        likeBttn.classList.toggle("card__like-button-svg_active");
      });
    });
  } else if (renderingType === "User Card") {
    const likeButton = document.querySelector(".card__like-button-svg");
    likeButton.addEventListener("click", () => {
      likeButton.classList.toggle("card__like-button-svg_active");
    });
  }
}

function handleKeyPressedWhilePopOpen(e) {
  if (e.key === "Escape") {
    hidePopUp();
  }
}

function hidePopUp(e = null) {
  popup.classList.remove("popup_opened");
  opaqueLayout.classList.remove("page__opaque-layout_active");
  isPopupActive = false;
  popup.replaceChildren();
  document.removeEventListener("keydown", handleKeyPressedWhilePopOpen);
  opaqueLayout.removeEventListener("click", opaqueLayoutClickHandler);
  imageContainer.removeEventListener(
    "click",
    visualizeImageContainerClickHandler
  );

  if (e !== null) {
    // prevents scroll to top of the page when clicking close button
    e.preventDefault();
  }
}

function showPopUp(appendedPopup) {
  if (appendedPopup) {
    // line that shows current popup
    popup.classList.add("popup_opened");
    const formContainer = page.querySelector(".popup");
    enableValidation(formContainer);
    opaqueLayout.classList.add("page__opaque-layout_active");

    // retrieve any key pressed and handle its behavior
    document.addEventListener("keydown", (e) => {
      handleKeyPressedWhilePopOpen(e);
    });

    // enables exiting form by clicking outside of it
    opaqueLayout.addEventListener("click", () => hidePopUp());
  }
  isPopupActive = true;
}

function enableValidation(formContainer) {
  const popupKey = formContainer.querySelector(".popup__container").id;
  const form = document.getElementById(popupKey);
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

function handlePopup() {
  // if there's another popup present
  if (popup.children.length > 0) {
    popup.children[0].remove();
  }
  renderPopUp(popupId);
}

function handleSubmit(e) {
  if (popupId === "edit-profile") {
    updateUserProfile(userInfo);
  } else if (popupId === "add-card") {
    createUserCard(null, userInfo);
  }
  hidePopUp(e);
}

let warningMsg;
let userInfo;

renderInitialCards();
editBttn.addEventListener("click", (e) => {
  popupId = e.target.closest(".profile__edit-button").id;
  handlePopup(popupId);
});
addBttn.addEventListener("click", (e) => {
  popupId = e.target.closest(".profile__add-button").id;
  handlePopup(popupId);
});
if (cardImages !== undefined) {
  cardImages.forEach((cardImage) => {
    cardImage.addEventListener("click", (e) => {
      const cardIndx = cardImages.indexOf(e.currentTarget);
      if (cardIndx !== -1) setVisualizeImages(cardIndx);
    });
  });
}

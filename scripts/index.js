const page = document.querySelector(".page");
const header = page.querySelector(".header");
const profile = page.querySelector(".profile");
const content = page.querySelector(".content");
const footer = page.querySelector(".footer");

const editBttn = content.querySelector(".profile__edit-button");
const editSvg = content.querySelector(".profile__edit-button-svg");
const addBttn = content.querySelector(".profile__add-button");

const popup = content.querySelector(".popup");

const cards = [
  {
    name: "Acapulco",
    link: "../images/acapulco600w,450h.jpg",
    alt: "picture of Acapulco",
    origin: "initial",
  },
  {
    name: "Chichen Itza",
    link: "../images/chichen-itza600w,400h.jpg",
    alt: "picture of Chichen Itza",
    origin: "initial",
  },
  {
    name: "Edinburgh",
    link: "../images/edimburgo600w,400h.jpg",
    alt: "picture of Edinburgh",
    origin: "initial",
  },
  {
    name: "Louvre",
    link: "../images/louvre-museum600w,400h.jpg",
    alt: "picture of Louvre",
    origin: "initial",
  },
  {
    name: "Shanghai",
    link: "../images/shangai600w,400h.jpg",
    alt: "picture of Shangai",
    origin: "initial",
  },
  {
    name: "Tokyo",
    link: "../images/tokyo600w,399h.jpg",
    alt: "picture of Tokyo",
    origin: "initial",
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
let deleteButtons;
let cardImages;

/**
 * @returns {DocumentFragment}
 */
function getTemplate(id) {
  return document.getElementById(id).content.cloneNode(true);
}

function createCard(template, cardData) {
  template.querySelector(".card__title").textContent = cardData.name;
  const imageElem = template.querySelector(".card__image");
  imageElem.srcset = `${cardData.link}`;
  imageElem.alt = `${cardData.alt}`;
}

function createUserCard(temp = null, cardD) {
  temp = getTemplate("card-template");
  const cardTitle = cardD[0];
  const cardLink = cardD[1];
  const imageAlt = "user card";
  const origin = "user";

  temp.querySelector(".card__title").textContent = cardTitle;
  temp.querySelector(".card__image").src = cardLink;
  temp.querySelector(".card__image").alt = imageAlt;
  let cardContainer = document.querySelector(".cards__grid");

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
    });

  cardContainer.querySelector(".card__image").addEventListener("click", (e) => {
    const imageToRender = e.currentTarget;
    setVisualizeImages(null, imageToRender, cardTitle, origin);
  });

  setCardsLikeButtonsEvent("User Card");
}

function createPopup(template, id) {
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
  cards.forEach((card) => {
    let template = getTemplate("card-template");
    createCard(template, card);
    cardContainer.append(template);
  });
  if (deleteButtons === undefined)
    deleteButtons = Array.from(
      document.querySelectorAll(".card__delete-button-svg")
    );

  if (cardImages === undefined)
    cardImages = Array.from(document.querySelectorAll(".card__image"));

  deleteButtons.forEach((bttn) => {
    bttn.addEventListener("click", (e) => {
      deleteCard(e.target.closest(".card"));

      if (cardContainer.children.length > 0) return;
      else if (cardContainer.children.length === 0) {
        const noCardsParagraph = document.createElement("p");
        const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
</svg>
`;
        const svgContainer = document.createElement("div");
        const svg = document.createElement("svg");
        svg.innerHTML = svgCode;
        cardContainer.classList.add("cards__flex");
        svgContainer.insertAdjacentHTML("afterbegin", svgCode);

        noCardsParagraph.classList.add("cards__no-cards-msg");
        noCardsParagraph.textContent =
          'Sin lugares que mostrar. ¡Haz clic en el botón "+" para añadir!';
        svg.firstChild.classList.add("cards__no-cards-svg");

        cardContainer.append(svg);
        cardContainer.append(noCardsParagraph);
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
  let opaqueDiv = document.createElement("div");
  opaqueDiv.classList.add("page__opaque-layout");
  page.insertAdjacentElement("afterbegin", opaqueDiv);
  const template = getTemplate("visualize-img-template");
  const image = template.querySelector(".visualize-img__image");
  const imageContainer = document.querySelector(".visualize-img");
  const paragraphImageName = template.querySelector(".visualize-img__img-name");
  const closeIcon = template.querySelector(".visualize-img__close-icon");

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
  imageContainer.append(template);
  closeIcon.addEventListener("click", (e) => {
    const parent = e.target.closest(".visualize-img");
    parent.classList.remove("visualize-img_opened");
    opaqueDiv.classList.remove("page__opaque-layout");
    parent.children[0].remove();
  });
}

function deleteCard(card) {
  card.remove();
}

function renderPopUp(id) {
  const template = getTemplate("popup-template");

  if (!isPopupActive) createPopup(template, id);

  let appended = popup.appendChild(template);

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

function setCardsLikeButtonsEvent(renderingType) {
  if (renderingType === "Initial") {
    const likeButtons = Array.from(
      document.querySelectorAll(".card__like-button-svg")
    );
    likeButtons.forEach((bttn) => {
      bttn.addEventListener("click", () => {
        bttn.classList.toggle("card__like-button-svg_active");
      });
    });
  } else if (renderingType === "User Card") {
    const likeButton = document.querySelector(".card__like-button-svg");
    likeButton.addEventListener("click", () => {
      likeButton.classList.toggle("card__like-button-svg_active");
    });
  }
}

function hidePopUp(e) {
  popup.classList.remove("popup_opened");
  document.querySelector(".page__opaque-layout")?.remove();
  isPopupActive = false;

  // prevents scroll to top of the page when clicking close button
  e.preventDefault();
}

function showPopUp(appendedPopup) {
  if (appendedPopup) {
    document.querySelector(".popup").classList.add("popup_opened");
    let opaqueDiv = document.createElement("div");
    opaqueDiv.classList.add("page__opaque-layout");
    page.insertAdjacentElement("afterbegin", opaqueDiv);
  }
  isPopupActive = true;
}

function handlePopup() {
  // if there's another popup present
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
  } else if (popupId === "add-card") {
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
if (cardImages !== undefined) {
  cardImages.forEach((cardImage) => {
    cardImage.addEventListener("click", (e) => {
      const cardIndx = cardImages.indexOf(e.currentTarget);
      if (cardIndx !== -1) setVisualizeImages(cardIndx);
      else console.error("ERROR: Something went wrong");
    });
  });
}

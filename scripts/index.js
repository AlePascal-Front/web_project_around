import { popupData, cards, validationConfig } from "./data.js";
import {
  showPopUp,
  hidePopUp,
  mutateUserInputIntoCardObj,
  removeNoCardsLayout,
  createPopup,
} from "./utils.js";
import { DOM, TEMPLATES } from "./dom.js";
import { Card } from "./Card.js";
import { FormValidation } from "./FormValidation.js";

const state = {
  popupId: null,
  userInfo: null,
  areInitialCardsRendered: false,
};

const createCard = (cardData) => {
  // push user data to keep congruential states
  if (state.areInitialCardsRendered) {
    cards.push(cardData);
  }

  const card = new Card(cardData);
  const filledCard = card.fillAndGetTemplate();
  return filledCard;
};

const renderInitialCards = () => {
  cards.forEach((cardData) => {
    DOM.cardsContainer.append(createCard(cardData));
  });
  state.areInitialCardsRendered = true;
};

const exitPopUpOnEsc = (e) => {
  if (e.key === "Escape") {
    handleHidePopUpCall();
  }
};

const handleHidePopUpCall = (e = null) => {
  const { popup, layout, imageContainer } = DOM;
  const handlers = {
    exitPopUpOnEsc,
  };
  hidePopUp(popup, layout, imageContainer, handlers, e);
};

const handleShowPopUpCall = () => {
  const handlers = {
    closeLayoutGlobalHelper,
    exitPopUpOnEsc,
  };
  const { popup, layout } = DOM;
  showPopUp(handlers, popup, layout);
};

const renderPopUp = (id) => {
  /*
  this conditional is here because
  without it you'd end up stacking bunch
  of popups when pressing the "enter" key.
  */
  if (DOM.popup.children.length > 0) {
    return;
  }

  const popupTemplateContent = TEMPLATES.popup.content.cloneNode(true);

  createPopup(id, popupTemplateContent, popupData);
  DOM.popup.append(popupTemplateContent);
  let form = document.getElementById(id);

  const formInst = new FormValidation(validationConfig, form);
  formInst.enableValidation();

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
      state.userInfo = getUserInput(form);
      handleSubmit();
    }
  });

  form.addEventListener("submit", (e) => {
    state.userInfo = getUserInput(form);
    handleSubmit(e);
  });

  const popupCloseButton = DOM.popup.querySelector(".popup__close-button");
  popupCloseButton.addEventListener("click", (e) => {
    handleHidePopUpCall(e);
  });
  handleShowPopUpCall();
};

const closeLayoutGlobalHelper = (e) => {
  const targetClasses = e.target.classList;
  const hasEitherClass =
    targetClasses.contains("visualize-img__container") ||
    targetClasses.contains("page__opaque-layout_active") ||
    targetClasses.contains("visualize-img_opened");

  if (hasEitherClass) {
    if (DOM.popup.children.length > 0) {
      handleHidePopUpCall();
    } else if (DOM.imageContainer.children.length > 0) {
      DOM.layout.classList.remove("page__opaque-layout_active");
      DOM.imageContainer.classList.remove("visualize-img_opened");
      DOM.imageContainer.replaceChildren();
    }
  }
};

const getUserInput = (form) => {
  let inputs = Array.from(form.elements);
  let userInput = [];
  inputs.forEach((input) => {
    if (input instanceof HTMLInputElement && input.type !== "submit") {
      userInput.push(input.value);
    }
  });

  if (state.popupId === "add-card") {
    userInput = mutateUserInputIntoCardObj(userInput);
  }

  return userInput;
};

const updateUserProfile = (inputArr) => {
  const profile = DOM.profile;
  profile.querySelector(".profile__name").textContent = inputArr[0];
  profile.querySelector(".profile__description").textContent = inputArr[1];
};

function handlePopup() {
  renderPopUp(state.popupId);
}

const handleSubmit = (e) => {
  e?.preventDefault();
  if (state.popupId === "edit-profile") {
    updateUserProfile(state.userInfo);
  } else if (state.popupId === "add-card") {
    const newCard = createCard(state.userInfo);
    const cardsContainer = DOM.cardsContainer;

    // "cards__flex" is a class added when there are no cards
    if (cardsContainer.classList.contains("cards__flex")) {
      removeNoCardsLayout(cardsContainer);
    }

    cardsContainer.prepend(newCard);
  }
  handleHidePopUpCall(e);
};

renderInitialCards();

document.addEventListener("click", closeLayoutGlobalHelper);

DOM.editBttn.addEventListener("click", (e) => {
  state.popupId = e.target.closest(".profile__edit-button").id;
  handlePopup(state.popupId);
});

DOM.addBttn.addEventListener("click", (e) => {
  state.popupId = e.target.closest(".profile__add-button").id;
  handlePopup(state.popupId);
});

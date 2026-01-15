export const createPopup = (id, popupTemplateContent, popupData) => {
  popupTemplateContent.querySelector(".popup__close-icon").src =
    popupData[id].closeButton;
  popupTemplateContent.querySelector(".popup__title").textContent =
    popupData[id].title;
  popupTemplateContent.querySelector(".popup__container").id = id;
  const inputs = Array.from(
    popupTemplateContent.querySelectorAll(".popup__input")
  );

  inputs.forEach((input, indx) => {
    input.placeholder = popupData[id][`input${indx + 1}`].placeholder;
    input.name = popupData[id][`input${indx + 1}`].name;
    input.id = popupData[id][`input${indx + 1}`].id;
    input.type = popupData[id][`input${indx + 1}`].inputType;

    let lengthRang = popupData[id][`input${indx + 1}`].lengthRange;
    if (lengthRang != null) {
      input.setAttribute("minlength", lengthRang[0]);
      input.setAttribute("maxlength", lengthRang[1]);
    }

    let required = popupData[id][`input${indx + 1}`].isRequired;
    if (required) {
      input.setAttribute("required", "");
    }
  });
};

export const renderNoCardsLayout = (cardsContainer, noCardsTemplateContent) => {
  const svg = noCardsTemplateContent.firstElementChild;
  const noCardsParagraph = noCardsTemplateContent.querySelector(
    ".cards__no-cards-msg"
  );
  cardsContainer.classList.add("cards__flex");
  svg.classList.add("cards__no-cards-svg");

  cardsContainer.append(svg);
  cardsContainer.append(noCardsParagraph);
};

export const removeNoCardsLayout = (cardsContainer) => {
  // "cards__flex" is a class that exists when there are no cards
  if (cardsContainer.classList.contains("cards__flex")) {
    cardsContainer.classList.remove("cards__flex");
    cardsContainer.replaceChildren();
  }
};

export const showPopUp = (handlers, popup, layout) => {
  popup.classList.add("popup_opened");
  layout.classList.add("page__opaque-layout_active");

  // retrieve any key pressed and handle its behavior
  document.addEventListener("keydown", handlers.exitPopUpOnEsc);
};

export const hidePopUp = (popup, layout, imgContainer, handlers, e = null) => {
  layout.classList.remove("page__opaque-layout_active");
  const popupClasses = popup.classList;
  const imageContainerClasses = imgContainer.classList;

  if (popupClasses.contains("popup_opened")) {
    popupClasses.remove("popup_opened");
    popup.replaceChildren();
  } else if (imageContainerClasses.contains("visualize-img_opened")) {
    imageContainerClasses.remove("visualize-img_opened");
    imageContainer.replaceChildren();
  }

  document.removeEventListener("keydown", handlers.exitPopUpOnEsc);
  document.removeEventListener("click", handlers.closeLayoutGlobalHelper);

  if (e !== null) {
    // prevents scroll to top of the page when clicking close button
    e.preventDefault();
  }
};

export const mutateUserInputIntoCardObj = (userInput) => {
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
};

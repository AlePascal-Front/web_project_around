import { DOM } from "./dom.js";
const { popup, layout, imageContainer } = DOM;

/**
 * Fills the popup attributes with the data
 * obtained from the popup form data object.
 *
 * @param {string} id - The id of the popup form.
 * @param {Node} popupTemplateContent - The content of the popup template.
 * @param {Object} formPopupData - The data object containing the popup form data.
 * @returns {void}
 */
export const fillPopupFormAttributes = (
  id,
  popupFormTemplateContent,
  formPopupData,
) => {
  popupFormTemplateContent.querySelector(".popup__form-title").textContent =
    formPopupData[id].title;
  popupFormTemplateContent.querySelector(".popup__form-container").id = id;
  const inputs = Array.from(
    popupFormTemplateContent.querySelectorAll(".popup__form-input"),
  );

  inputs.forEach((input, indx) => {
    input.placeholder = formPopupData[id][`input${indx + 1}`].placeholder;
    input.name = formPopupData[id][`input${indx + 1}`].name;
    input.id = formPopupData[id][`input${indx + 1}`].id;
    input.type = formPopupData[id][`input${indx + 1}`].inputType;

    let lengthRang = formPopupData[id][`input${indx + 1}`].lengthRange;
    if (lengthRang != null) {
      const [minLength, maxLength] = lengthRang;
      input.setAttribute("minlength", minLength);
      input.setAttribute("maxlength", maxLength);
    }

    let required = formPopupData[id][`input${indx + 1}`].isRequired;
    if (required) {
      input.setAttribute("required", "");
    }
  });
};

/**
 * Renders a no cards layout in the cards container
 * by appending the no cards template content to it.
 *
 * @param {Node} cardsContainer - The container where the no cards layout will be rendered.
 * @param {Node} noCardsTemplateContent - The content of the no cards template.
 * @returns {void}
 */
export const renderNoCardsLayout = (cardsContainer, noCardsTemplateContent) => {
  const svg = noCardsTemplateContent.firstElementChild;
  const noCardsParagraph = noCardsTemplateContent.querySelector(
    ".cards__no-cards-msg",
  );
  cardsContainer.classList.add("cards__flex");
  svg.classList.add("cards__no-cards-svg");

  cardsContainer.append(svg);
  cardsContainer.append(noCardsParagraph);
};

/**
 * Removes the no cards layout from the cards container by removing
 * the "cards__flex" class and replacing the container's children
 * with nothing.
 *
 * @param {Node} cardsContainer - The container where the no cards layout will be removed.
 * @returns {void}
 */
export const removeNoCardsLayout = (cardsContainer) => {
  // "cards__flex" is a class that exists when there are no cards
  if (cardsContainer.classList.contains("cards__flex")) {
    cardsContainer.classList.remove("cards__flex");
    cardsContainer.replaceChildren();
  }
};

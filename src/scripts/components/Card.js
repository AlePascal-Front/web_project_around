import { renderNoCardsLayout } from "../utils/utils.js";
import { DOM, TEMPLATE_IDS } from "../utils/dom.js";
const { cardTemplateId } = TEMPLATE_IDS;

export default class Card {
  constructor({ name, link, alt, origin }, handleCardClick) {
    this._title = name;
    this._imageUrl = link;
    this._imageAlt = alt;
    this._origin = origin;
    this._templateContent = document
      .getElementById(cardTemplateId)
      .content.cloneNode(true);
    this._handleCardClick = handleCardClick;
  }

  _deleteCardHandler(e) {
    const deleteButton = e.target.closest(".card__delete-button-svg");
    if (!deleteButton) return;

    e.target.closest(".card").remove();

    const cardsContainer = DOM.cardsContainer;
    if (cardsContainer.children.length === 0) {
      const noCardsContent = TEMPLATES.noCards.content.cloneNode(true);
      renderNoCardsLayout(cardsContainer, noCardsContent);
    }
  }

  _clickLikeHandler(e) {
    const likeButton = e.target.closest(".card__like-button-svg");
    if (!likeButton) return;

    likeButton.classList.toggle("card__like-button-svg_active");
  }

  _attachEventListeners() {
    // event delegation
    const cardsContainer = DOM.cardsContainer;

    cardsContainer.addEventListener("click", this._deleteCardHandler);
    cardsContainer.addEventListener("click", this._clickLikeHandler);
    this._templateContent.querySelector(".card__image").addEventListener("click", this._handleCardClick);
  }

  getImageUrl() {
    return this._imageUrl;
  }

  getTitle() {
    return this._title;
  }

  fillAndGetTemplate() {
    this._attachEventListeners();
    this._templateContent.querySelector(".card__title").textContent =
      this._title;
    const imageElem = this._templateContent.querySelector(".card__image");
    imageElem.src = this._imageUrl;
    imageElem.alt = this._imageAlt;

    return this._templateContent;
  }
}

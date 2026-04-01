import { DOM, TEMPLATE_IDS } from "../utils/dom.js";

export default class Card {
  constructor(
    { name, link, alt = "user card", origin = "user card", _id, isLiked },
    handleCardClick,
    handleDeleteClick,
    clickLikeHandler,
  ) {
    this._title = name;
    this._imageUrl = link;
    this._imageAlt = alt;
    this._origin = origin;
    this._id = _id;
    this._isLiked = isLiked;
    this._templateContent = document
      .getElementById(TEMPLATE_IDS.cardTemplateId)
      .content.cloneNode(true);
    this._handleCardClick = handleCardClick;
    this._handleDeleteClick = handleDeleteClick;
    this._clickLikeHandler = clickLikeHandler;
  }

  _clickLikeHandler(e) {
    const likeButton = e.target.closest(".card__like-button-svg");
    if (!likeButton) return;

    likeButton.classList.toggle("card__like-button-svg_active");
    this._isLiked = !this._isLiked;
  }

  _attachEventListeners() {
    // event delegation
    const cardsContainer = DOM.cardsContainer;
    cardsContainer.addEventListener("click", this._handleDeleteClick);
    cardsContainer.addEventListener("click", this._clickLikeHandler);
    this._templateContent
      .querySelector(".card__image")
      .addEventListener("click", this._handleCardClick);
  }

  getImageUrl() {
    return this._imageUrl;
  }

  getTitle() {
    return this._title;
  }

  getIsLiked() {
    return this._isLiked;
  }

  setIsLiked(isLiked) {
    this._isLiked = !isLiked;
  }

  fillAndGetTemplate() {
    this._attachEventListeners();
    this._templateContent.querySelector(".card__title").textContent =
      this._title;
    const imageElem = this._templateContent.querySelector(".card__image");
    imageElem.src = this._imageUrl;
    imageElem.alt = this._imageAlt;
    this._templateContent
      .querySelector(".card")
      .setAttribute("data-id", this._id);
    return this._templateContent;
  }
}

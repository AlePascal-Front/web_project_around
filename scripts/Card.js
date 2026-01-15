import { renderNoCardsLayout } from "./utils.js";
import { DOM, TEMPLATES } from "./dom.js";

export class Card {
  constructor(data) {
    //qconst { name, link, alt, origin } = data;
    this._title = data.name;
    this._imageUrl = data.link;
    this._imageAlt = data.alt;
    this._origin = data.origin;
    this._templateContent = TEMPLATES.card.content.cloneNode(true);
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

  _setImageViewer(e) {
    const imageViewerContent = TEMPLATES.visualizeImage.content.cloneNode(true);
    const image = imageViewerContent.querySelector(".visualize-img__image");
    const paragraphImageName = imageViewerContent.querySelector(
      ".visualize-img__img-name"
    );

    const renderedCard = e.target.closest(".card");
    const cardImage = renderedCard.querySelector(".card__image");
    const cardTitle = renderedCard.querySelector(".card__title");

    image.src = cardImage.src;
    paragraphImageName.textContent = cardTitle.textContent;

    const closeIcon = imageViewerContent.querySelector(
      ".visualize-img__close-icon"
    );

    const layout = DOM.layout;
    layout.classList.add("page__opaque-layout_active");

    const imageContainer = DOM.imageContainer;
    imageContainer.classList.add("visualize-img_opened");
    imageContainer.append(imageViewerContent);
    closeIcon.addEventListener("click", () => {
      imageContainer.classList.remove("visualize-img_opened");
      layout.classList.remove("page__opaque-layout_active");
      imageContainer.children[0].remove();
    });
  }

  _attachEventListeners() {
    // event delegation
    const cardsContainer = DOM.cardsContainer;

    cardsContainer.addEventListener("click", this._deleteCardHandler);
    cardsContainer.addEventListener("click", this._clickLikeHandler);
    this._templateContent
      .querySelector(".card__image")
      .addEventListener("click", this._setImageViewer);
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

export const DOM = {
  page: document.querySelector(".page"),
  profile: document.querySelector(".profile"),
  content: document.querySelector(".content"),
  cardsContainer: document.querySelector(".cards__grid"),

  editBttn: document.querySelector(".profile__edit-button"),
  editSvg: document.querySelector(".profile__edit-button-svg"),
  addBttn: document.querySelector(".profile__add-button"),

  popup: document.querySelector(".popup"),
  layout: document.querySelector(".page__opaque-layout"),
  imageContainer: document.querySelector(".visualize-img"),
};

export const TEMPLATE_IDS = {
  popupWithFormTemplateId: "popup-form-template",
  popupWithImageTemplateId: "popup-visualize-img-template",
  cardTemplateId: "card-template",
};

export const cardsContainerSelector = ".cards__grid";

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

export const TEMPLATES = {
  card: document.getElementById("card-template"),
  popup: document.getElementById("popup-template"),
  visualizeImage: document.getElementById("visualize-img-template"),
  noCards: document.getElementById("no-cards-icon-template"),
};

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
};

export const TEMPLATE_IDS = {
  popupWithFormTemplateIdOneInput: "popup-form-template-one-input",
  popupWithFormTemplateIdTwoInputs: "popup-form-template-two-inputs",
  popupWithImageTemplateId: "popup-visualize-img-template",
  cardTemplateId: "card-template",
  confirmDeleteTemplateId: "popup-confirm-delete-template",
};

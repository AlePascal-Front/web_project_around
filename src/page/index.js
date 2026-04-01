import { formPopupData, validationConfig } from "../utils/data.js";
import {
  fillPopupFormAttributes,
  removeNoCardsLayout,
  changeTextOf,
} from "../utils/utils.js";
import { DOM, TEMPLATE_IDS } from "../utils/dom.js";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForms from "../components/PopupWithForms.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";
import api from "../components/Api.js";
import userInfo from "../components/UserInfo.js";

const state = {
  popupId: null,
  areInitialCardsRendered: false,
  lastClickedCardId: null,
  currentUserInfo: null,
};

const handleDeleteClick = (e) => {
  // consider that the event is attached to the cards' container
  // to lower memory usage throughout the application instead of attaching
  // 1 event to n buttons
  const deleteButton = e.target.closest(".card__delete-button-svg");
  if (!deleteButton) return;
  const card = e.target.closest(".card");
  const cardId = card.getAttribute("data-id");
  state.lastClickedCardId = cardId;

  const popupWithConfirmation = new PopupWithConfirmation(
    TEMPLATE_IDS.confirmDeleteTemplateId,
    () => {
      changeTextOf(
        document.querySelector(".popup__confirm-delete-bttn"),
        "Cargando...",
      );
      api.deleteCard(cardId).then(() => {
        card.remove();
        popupWithConfirmation.close();
      });
    },
  );
  popupWithConfirmation.setEventListeners();
  popupWithConfirmation.open();
};

const renderCards = (
  cardData,
  permissionToCloseForm = null,
  formObj = null,
) => {
  if (!Array.isArray(cardData) && typeof cardData === "object") {
    const { name, link, isLiked, _id } = cardData;
    cardData = [{ name: name, link: link, isLiked: isLiked, _id: _id }];
  }

  const cardsSection = new Section(
    {
      items: cardData,
      renderer: (item) => {
        const card = new Card(
          item,
          () => {
            const popupWithImage = new PopupWithImage(
              TEMPLATE_IDS.popupWithImageTemplateId,
              {
                imageSrc: card.getImageUrl(),
                imageCaption: card.getTitle(),
              },
            );
            popupWithImage.setEventListeners();
            popupWithImage.open();
          },
          handleDeleteClick,
          (e) => {
            const likeButton = e.target.closest(".card__like-button-svg");
            if (!likeButton) return;

            const cardId = e.target.closest(".card").getAttribute("data-id");
            likeButton.classList.add("card__like-button-svg_disabled");
            const isLiked = card.getIsLiked();
            card.setIsLiked(isLiked);

            api
              .toggleLikeOnCard(card.getIsLiked(), cardId)
              .then(() => {
                likeButton.classList.remove("card__like-button-svg_disabled");
                likeButton.classList.toggle("card__like-button-svg_active");
              })
              .catch((err) => {
                console.error(err);
              });
          },
        );
        const renderedCard = card.fillAndGetTemplate();
        cardsSection.addItem(renderedCard);
      },
    },
    DOM.cardsContainer,
  );
  cardsSection.renderItems();
  state.areInitialCardsRendered = true;

  if (
    permissionToCloseForm !== null &&
    formObj !== null &&
    permissionToCloseForm
  ) {
    formObj.close();
  }
};

const renderInitialCards = () => {
  api
    .getInitialCards()
    .then((data) => {
      renderCards(data);
    })
    .catch((err) => console.error(err));
};

const initUserInfo = () => {
  api
    .getUserInfo()
    .then((info) => {
      if (typeof info !== "object") {
        console.error(`Unexpected data received: ${info}`);
        return;
      }
      const { name, about, avatar } = info;

      userInfo.setName(name);
      userInfo.setAbout(about);
      userInfo.setAvatar(avatar);
      userInfo.setUserInfo();
      userInfo.setUserAvatar();
      state.currentUserInfo = userInfo.getUserInfo();
    })
    .catch((err) => {
      console.error(err);
    });
};

const renderPopupWithForm = (numOfFields) => {
  if (DOM.popup.children.length > 0) {
    return;
  }

  let formTemplateId;
  if (numOfFields === 2) {
    formTemplateId = TEMPLATE_IDS.popupWithFormTemplateIdTwoInputs;
  } else if (numOfFields === 1) {
    formTemplateId = TEMPLATE_IDS.popupWithFormTemplateIdOneInput;
  }

  const { popupId } = state;
  const popupWithForm = new PopupWithForms(formTemplateId, (e, userInput) => {
    e?.preventDefault();
    changeTextOf(document.getElementById("submit-button"), "Cargando...");

    if (popupId === "edit-profile") {
      const [name, about] = userInput;

      api
        .updateUserInfo({ name: name, about: about })
        .then(() => {
          userInfo.setName(name);
          userInfo.setAbout(name);
          userInfo.setUserInfo();
          popupWithForm.close();
        })
        .catch((err) => console.error(err));
    } else if (popupId === "add-card") {
      const [title, imageUrl] = userInput;

      const items = {
        name: title,
        link: imageUrl,
      };

      api
        .postCardData(items)
        .then((data) => {
          renderCards(data, true, popupWithForm);
        })
        .catch((err) => console.error(err));
    } else if (popupId === "edit-photo") {
      const [avatar] = userInput;

      api.updateUserInfo({ avatar: avatar }).then(() => {
        userInfo.setAvatar(avatar);
        userInfo.setUserAvatar();
        popupWithForm.close();
      });
    }

    if (popupId !== "add-card") {
      state.currentUserInfo = userInfo.getUserInfo();
    }
  });

  const popupWithFormTemplateContent = popupWithForm.getPopupTemplateContent();
  fillPopupFormAttributes(popupId, popupWithFormTemplateContent, formPopupData);
  const form = popupWithFormTemplateContent.querySelector(
    ".popup__form-container",
  );
  popupWithForm.setEventListeners();
  const formValInst = new FormValidator(validationConfig, form);
  formValInst.enableValidation();
  popupWithForm.open();
};

const setEventListenersToBttns = () => {
  const photoContainer = DOM.profile.firstElementChild;
  const editPhotoBttn = photoContainer.firstElementChild;
  const profilePhoto = editPhotoBttn.nextElementSibling;

  profilePhoto.addEventListener("mouseenter", () => {
    if (!editPhotoBttn.classList.contains("profile__edit-profile-photo_show")) {
      editPhotoBttn.classList.add("profile__edit-profile-photo_show");
    }
  });

  profilePhoto.addEventListener("mouseout", () => {
    if (editPhotoBttn.classList.contains("profile__edit-profile-photo_show")) {
      editPhotoBttn.classList.remove("profile__edit-profile-photo_show");
    }
  });

  const { editBttn, addBttn } = DOM;
  [editBttn, addBttn, profilePhoto].forEach((bttn, indx) => {
    bttn.addEventListener("click", (e) => {
      state.popupId = e.target.closest(`.${bttn.classList[0]}`).id;
      let numOfFields = indx < 2 ? 2 : 1;
      renderPopupWithForm(numOfFields);
    });
  });
};

const initApp = () => {
  renderInitialCards();
  initUserInfo();
  setEventListenersToBttns();
};
initApp();

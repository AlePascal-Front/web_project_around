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
import UserInfo from "../components/UserInfo.js";
import PopupWithForms from "../components/PopupWithForms.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";
import api from "../components/Api.js";

const state = {
  popupId: null,
  areInitialCardsRendered: false,
  lastClickedCardId: null,
};

const handleDeleteClick = (e) => {
  // consider that the event is attached to the cards' container
  // to lower memory usage throughout the application instead of attaching
  // 1 event to n buttons
  const deleteButton = e.target.closest(".card__delete-button-svg");
  if (!deleteButton) return;
  const card = e.target.closest(".card");
  const cardId = card.getAttribute("data-id");

  const popupWithConfirmation = new PopupWithConfirmation(
    TEMPLATE_IDS.confirmDeleteTemplateId,
    () => {
      changeTextOf(
        document.querySelector(".popup__confirm-delete-bttn"),
        "Cargando...",
      );
      api.deleteCard(cardId).then(() => card.remove());
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

const renderPopupWithForm = (numOfFields) => {
  /*
  this conditional is here because
  without it you'd end up stacking bunch
  of popups when pressing the "enter" key.
  */
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
      const userInfo = new UserInfo({ name: name, about: about });

      api
        .updateUserInfo(userInfo.getUserInfo())
        .then(() => {
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

renderInitialCards();

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

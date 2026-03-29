import { formPopupData, cards, validationConfig } from "..//utils/data.js";
import {
  fillPopupFormAttributes,
  removeNoCardsLayout,
} from "../utils/utils.js";
import { DOM, TEMPLATE_IDS } from "../utils/dom.js";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import UserInfo from "../components/UserInfo.js";
import PopupWithForms from "../components/PopupWithForms.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";

const state = {
  popupId: null,
  areInitialCardsRendered: false,
};

const handleDeleteClick = (e) => {
  // consider that the event is attached to the cards' container
  // to lower memory usage throughout the application instead of attaching
  // 1 event to n buttons
  const deleteButton = e.target.closest(".card__delete-button-svg");
  if (!deleteButton) return;

  const popupWithConfirmation = new PopupWithConfirmation(
    TEMPLATE_IDS.confirmDeleteTemplateId,
  );
  popupWithConfirmation.setEventListeners();
  popupWithConfirmation.open();
};

const createCard = (cardData) => {
  // push user data to keep congruential states
  if (state.areInitialCardsRendered) {
    cards.push(cardData);
  }

  const card = new Card(
    cardData,
    (e) => {
      if (e.target.classList.contains("card__image")) {
        const popupWithImage = new PopupWithImage(
          TEMPLATE_IDS.popupWithImageTemplateId,
          {
            imageSrc: card.getImageUrl(),
            imageCaption: card.getTitle(),
          },
        );
        popupWithImage.setEventListeners();
        popupWithImage.open();
      }
    },
    handleDeleteClick,
  );
  const filledCard = card.fillAndGetTemplate();
  return filledCard;
};

const renderInitialCards = () => {
  const cardsSection = new Section(
    {
      items: cards,
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
    if (popupId === "edit-profile") {
      const [userName, userJob] = userInput;
      const userInfo = new UserInfo({ userName: userName, userJob: userJob });
      userInfo.setUserInfo();
      popupWithForm.close();
    } else if (popupId === "add-card") {
      const [title, imageUrl, imageAlt = "user card", origin = "user"] =
        userInput;
      const { cardsContainer } = DOM;

      const items = [
        {
          name: title,
          link: imageUrl,
          alt: imageAlt,
          origin: origin,
        },
      ];
      const cardsSection = new Section(
        {
          items: items,
          renderer: (item) => {
            const newCard = createCard(item);

            // "cards__flex" is a class added when there are no cards
            if (cardsContainer.classList.contains("cards__flex")) {
              removeNoCardsLayout(cardsContainer);
            }

            cardsSection.prependItem(newCard);
          },
        },
        cardsContainer,
      );

      cardsSection.renderItems();
      popupWithForm.close();
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

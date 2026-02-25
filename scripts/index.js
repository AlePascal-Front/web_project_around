import { formPopupData, cards, validationConfig } from "./utils/data.js";
import { fillPopupFormAttributes, removeNoCardsLayout } from "./utils/utils.js";
import { DOM, TEMPLATE_IDS, cardsContainerSelector } from "./utils/dom.js";
import Card from "./components/Card.js";
import FormValidation from "./components/FormValidation.js";
import Section from "./components/Section.js";
import PopupWithImage from "./components/PopupWithImage.js";
import PopupWithForm from "./components/PopupWithForm.js";
import userInfo from "./components/UserInfo.js";

const state = {
  popupId: null,
  areInitialCardsRendered: false,
};

const createCard = (cardData) => {
  // push user data to keep congruential states
  if (state.areInitialCardsRendered) {
    cards.push(cardData);
  }

  const card = new Card(cardData, (e) => {
    if (e.target.classList.contains("card__image")) {
      const { popupWithImageTemplateId } = TEMPLATE_IDS;
      new PopupWithImage(popupWithImageTemplateId, {
        imageSrc: card.getImageUrl(),
        imageCaption: card.getTitle(),
      }).open();
    }
  });
  const filledCard = card.fillAndGetTemplate();
  return filledCard;
};

const renderInitialCards = () => {
  const cardsSection = new Section(
    {
      items: cards,
      renderer: (item) => {
        const card = new Card(item, () => {
          const popupWithImage = new PopupWithImage(
            TEMPLATE_IDS.popupWithImageTemplateId,
            {
              imageSrc: card.getImageUrl(),
              imageCaption: card.getTitle(),
            },
          );
          popupWithImage.setEventListeners();
          popupWithImage.open();
        });

        const renderedCard = card.fillAndGetTemplate();
        cardsSection.addItem(renderedCard);
      },
    },
    cardsContainerSelector,
  );
  cardsSection.renderItems();
  state.areInitialCardsRendered = true;
};

const renderPopupWithForm = () => {
  /*
  this conditional is here because
  without it you'd end up stacking bunch
  of popups when pressing the "enter" key.
  */
  if (DOM.popup.children.length > 0) {
    return;
  }

  const { popupId } = state;
  const { popupWithFormTemplateId } = TEMPLATE_IDS;

  const popupWithForm = new PopupWithForm(popupWithFormTemplateId, (e) => {
    e?.preventDefault();
    if (popupId === "edit-profile") {
      const [userName, userJob] = popupWithForm._getUserInput();
      userInfo.setUserName(userName);
      userInfo.setUserJob(userJob);
      userInfo.setUserInfo();
      popupWithForm.close();
    } else if (popupId === "add-card") {
      const [title, imageUrl, imageAlt = "user card", origin = "user"] =
        popupWithForm._getUserInput();
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
        cardsContainerSelector,
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
  const formValInst = new FormValidation(validationConfig, form);
  formValInst.enableValidation();
  popupWithForm.open();
};

renderInitialCards();

const { editBttn, addBttn } = DOM;
[editBttn, addBttn].forEach((bttn) => {
  bttn.addEventListener("click", () => {
    state.popupId = bttn.closest(`.${bttn.classList[0]}`).id;
    renderPopupWithForm();
  });
});

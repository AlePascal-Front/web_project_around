const page = document.querySelector(".page");
const header = page.querySelector(".header");
const profile = page.querySelector(".profile");
const content = page.querySelector(".content");
const footer = page.querySelector(".footer");

const editBttn = content.querySelector(".profile__edit-button");
const editSvg = content.querySelector(".profile__edit-button-svg");

const popup = content.querySelector(".popup");
const popupContainer = popup.querySelector(".popup__container");
const popupCloseBttn = popup.querySelector(".popup__close-button");
const popupSaveBttn = popup.querySelector(".popup__button");

let inputFields = Array.from(popup.querySelectorAll(".popup__input"));
let isPopupOpen = false;

function getEmptyFields() {
  let empty = {};
  for (let i = 0; i < inputFields.length; i++) {
    if (inputFields[i].value === "") {
      empty[i] = inputFields[i];
    }
  }

  return Object.keys(empty).length === 0 ? undefined : empty;
}

function showWarning(emptyF) {
  for (const key in emptyF) {
    if (emptyF[key].nextSibling.tagName === "P") {
      continue;
    }
    warningMsg = document.createElement("p");
    warningMsg.textContent = "* Por favor, llena todos los campos";
    warningMsg.style.color = "red";
    warningMsg.style.padding = "0";
    warningMsg.style.margin = "0";
    warningMsg.style.transform = "translateY(-16px)";
    // warningMsg.style.position = "absolute";

    emptyF[key].insertAdjacentElement("afterend", warningMsg);
  }
}

function updateUserProfile(inputArr) {
  profile.querySelector(".profile__name").textContent = inputArr[0];
  profile.querySelector(".profile__description").textContent = inputArr[1];
}

function getUserInput(e) {
  // prevents page reload
  e.preventDefault();

  let inputFields = popup.querySelectorAll(".popup__input");
  let userName = inputFields[0].value;
  let userAbout = inputFields[1].value;

  return [userName, userAbout];
}

function hidePopUp(e) {
  popup.classList.remove("popup_opened");
  document.querySelector(".page__opaque-layout")?.remove();

  // prevents scroll to top of the page when clicking close button
  e.preventDefault();
  isPopupOpen = false;
}

function showPopUp() {
  // debugger;
  popup.classList.add("popup_opened");

  if (popup.classList.contains("popup_opened")) {
    let opaqueDiv = document.createElement("div");
    opaqueDiv.classList.add("page__opaque-layout");
    page.insertAdjacentElement("afterbegin", opaqueDiv);
  }

  isPopupOpen = true;
}

let warningMsg;
let userInfo;
let emptyFields;

function handleSubmit(e) {
  e.preventDefault();
  userInfo = getUserInput(e);
  emptyFields = getEmptyFields(userInfo);

  if (emptyFields !== undefined) {
    showWarning(emptyFields);
    return;
  }

  updateUserProfile(userInfo);
  hidePopUp(e);
}

editBttn.addEventListener("click", showPopUp);
popupCloseBttn.addEventListener("click", hidePopUp);
popupSaveBttn.addEventListener("click", (e) => {
  handleSubmit(e);
});

// give user the ability to submit with enter key
for (let i = 0; i < inputFields.length; i++) {
  inputFields[i].addEventListener("keypress", (e) => {
    if(e.code === "Enter") {
      handleSubmit(e);
    }
  });
  // remove warning message once the user starts typing
  inputFields[i].addEventListener("input", () => {
    if (inputFields[i].nextSibling.tagName === "P") {
      inputFields[i].nextSibling.remove();
    }
  });
}

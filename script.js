import * as selfModule from "./script.js";
import Storage from "./Storage.js";
import UI from "./UI.js";

export const itemForm = document.getElementById("item-form");
export const itemInput = document.getElementById("item-input");
export const clearBtn = document.getElementById("clear");
export const itemFilter = document.getElementById("filter");
export const formBtn = itemForm.querySelector("button");
export const itemList = document.getElementById("item-list");

//====================== Event Handlers ======================
export function handleDisplayItems() {
  const itemsFromStorage = Storage.getItems();
  itemsFromStorage.forEach((item) => UI.addItemToDOM(item));
  UI.checkUI();
}

export function handleAddItemSubmit(event) {
  event.preventDefault();
  const item = getNewItem();

  // Validate Input
  //[10-3] Gaurd Clause
  if (isItemEmpty(item)) {
    alert("Please add an item");
    return;
  }
  // Check for edit mode
  if (UI.isEditMode) {
    removeEditItem(itemList.querySelector(".edit-mode"));
  }

  //Validate if item already exists
  //[10-3] Gaurd Clause
  if (selfModule.isItemExists(item)) {
    alert(`The item "${item}" already exists!`);
    return;
  }

  createNewItem(item);
}
export function handleClickItem(event) {
  //[10-3] 참과 거짓 경로 모두 정상 동작
  if (containRemoveItem(event)) {
    selfModule.removeItem(event.target.parentElement.parentElement);
  } else if (UI.isListItem(event)) {
    UI.setItemToEdit(event.target);
  }
}
export function handleClearItems() {
  UI.clearAllItemsFromDOM();
  localStorage.removeItem("items");

  UI.checkUI();
}
export function handleFilterItems(event) {
  const items = itemList.querySelectorAll("li");
  const text = event.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    const shouldDisplay = isItemMatch(itemName, text);
    item.style.display = shouldDisplay ? "flex" : "none";
  });
}

//===================== Item ======================
function getNewItem() {
  return itemInput.value.trim();
}
export function confirmRemoveItem(item) {
  return confirm(
    `Are you sure you want to remove the item "${item.textContent}"?`,
  );
}
function isItemEmpty(item) {
  return item === "";
}
function isItemMatch(item, text) {
  return item.indexOf(text) != -1;
}
function createNewItem(item) {
  UI.addItemToDOM(item);
  Storage.addItem(item);
  UI.checkUI();
  itemInput.value = "";
}
function removeEditItem(item) {
  Storage.removeItem(item.textContent);
  removeItemUI(item);
}
function containRemoveItem(event) {
  return event.target.parentElement.classList.contains("remove-item");
}
export function isItemExists(item) {
  const itemsFromStorage = Storage.getItems();
  return itemsFromStorage.includes(item);
}
export function removeItem(item) {
  //[10-3] Gaurd Clause
  if (!selfModule.confirmRemoveItem(item)) {
    return;
  }
  // Remove item from DOM
  item.remove();
  // Remove item from storage
  Storage.removeItem(item.textContent);
  UI.checkUI();
}
function removeItemUI(item) {
  item.classList.remove("edit-mode");
  item.remove();
}

//====================== Initialization ======================
export function init() {
  // Event Listeners
  itemForm.addEventListener("submit", handleAddItemSubmit);
  itemList.addEventListener("click", handleClickItem);
  clearBtn.addEventListener("click", handleClearItems);
  itemFilter.addEventListener("input", handleFilterItems);
  document.addEventListener("DOMContentLoaded", handleDisplayItems);

  UI.checkUI();
}

init();

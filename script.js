import * as selfModule from "./script.js";
import Storage from "./Storage.js";
import UI from "./UI.js";
import Item from "./Item.js";

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
  const item = Item.getNewItem();

  // Validate Input
  //[10-3] Gaurd Clause
  if (Item.isItemEmpty(item)) {
    alert("Please add an item");
    return;
  }
  // Check for edit mode
  if (UI.isEditMode) {
    Item.removeEditItem(itemList.querySelector(".edit-mode"));
  }

  //Validate if item already exists
  //[10-3] Gaurd Clause
  if (Item.isItemExists(item)) {
    alert(`The item "${item}" already exists!`);
    return;
  }

  Item.createNewItem(item);
}
export function handleClickItem(event) {
  //[10-3] 참과 거짓 경로 모두 정상 동작
  if (Item.containRemoveItem(event)) {
    Item.removeItem(event.target.parentElement.parentElement);
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
    const shouldDisplay = Item.isItemMatch(itemName, text);
    item.style.display = shouldDisplay ? "flex" : "none";
  });
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

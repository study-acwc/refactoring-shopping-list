import * as selfModule from "./script.js";
import Storage from "./Storage.js";

export const itemForm = document.getElementById("item-form");
export const itemInput = document.getElementById("item-input");
export const itemList = document.getElementById("item-list");
export const clearBtn = document.getElementById("clear");
export const itemFilter = document.getElementById("filter");
export const formBtn = itemForm.querySelector("button");
export let isEditMode = false;

//====================== Event Handlers ======================
export function handleDisplayItems() {
  const itemsFromStorage = Storage.getItems();
  itemsFromStorage.forEach((item) => selfModule.addItemToDOM(item));
  selfModule.checkUI();
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
  if (isEditMode) {
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
  } else if (isListItem(event)) {
    selfModule.setItemToEdit(event.target);
  }
}
export function handleClearItems() {
  clearAllItemsFromDOM();
  localStorage.removeItem("items");

  selfModule.checkUI();
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
function clearInput() {
  itemInput.value = "";
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
  addItemToDOM(item);
  Storage.addItem(item);
  selfModule.checkUI();
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
  selfModule.checkUI();
}

//====================== UI ======================
function removeItemUI(item) {
  item.classList.remove("edit-mode");
  item.remove();
}
export function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = selfModule.createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

export function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}
export function setItemToEdit(item) {
  isEditMode = true;
  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));

  item.classList.add("edit-mode");
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item';
  formBtn.style.backgroundColor = "#228B22";
  itemInput.value = item.textContent;
}
export function addItemToDOM(item) {
  // Create list item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  // Add li to the DOM
  itemList.appendChild(li);
}
export function checkUI() {
  clearInput();
  toggleVisibility(clearBtn);
  toggleVisibility(itemFilter);
  resetFormButton();
  isEditMode = false;
}
function isListItem(event) {
  return event.target.closest("li");
}
function toggleVisibility(element) {
  const hasItems = itemList.querySelectorAll("li").length > 0;
  element.style.display = hasItems ? "block" : "none";
}

function resetFormButton() {
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = "#333";
}
function clearAllItemsFromDOM() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
}

//====================== Initialization ======================
export function init() {
  // Event Listeners
  itemForm.addEventListener("submit", handleAddItemSubmit);
  itemList.addEventListener("click", handleClickItem);
  clearBtn.addEventListener("click", handleClearItems);
  itemFilter.addEventListener("input", handleFilterItems);
  document.addEventListener("DOMContentLoaded", handleDisplayItems);

  selfModule.checkUI();
}

init();

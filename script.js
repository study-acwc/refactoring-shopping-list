import LocalStorageController from "./LocalStorageController";

export const itemForm = document.getElementById("item-form");
export const itemInput = document.getElementById("item-input");
export const itemList = document.getElementById("item-list");
export const clearBtn = document.getElementById("clear");
export const itemFilter = document.getElementById("filter");
export const formBtn = itemForm.querySelector("button");
export let isEditMode = false;

export function onAddItemSubmit(e) {
  e.preventDefault();

  // trim the input value to remove whitespace - disallowing duplicate items due to white space in the process
  const newItem = itemInput.value.trim();

  // Validate Input
  if (newItem === "") {
    alert("Please add an item");
    return;
  }

  if (!isEditMode) {
    const isExistItem = getItemsFromStorage().includes(newItem);
    if (isExistItem) {
      alert(`The item "${newItem}" already exists!`);
      return;
    }
  } else {
    const itemToEdit = itemList.querySelector(".edit-mode");
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.remove();
  }

  addItemToDOM(newItem);
  addItemToStorage(newItem);

  styleDisplayItems();
  initInputEditMode();
}

function onClickListItem(e) {
  const targetItem = e.target;

  isEditMode = true;

  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));

  targetItem.classList.add("edit-mode");
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item';
  formBtn.style.backgroundColor = "#228B22";
  itemInput.value = targetItem.textContent;
}

function onClickRemoveItem(e) {
  e.stopPropagation();

  const targetItem = e.target.parentElement.parentElement;
  const targetContent = targetItem.textContent;
  if (confirm(`Are you sure you want to remove the item "${targetContent}"?`)) {
    targetItem.remove();
    removeItemFromStorage(targetContent);

    styleDisplayItems();
    initInputEditMode();
  }
}

export function addItemToDOM(item) {
  // Create list item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createElement("button", "remove-item btn-link text-red");
  const icon = createElement("i", "fa-solid fa-xmark");

  li.addEventListener("click", onClickListItem);
  button.addEventListener("click", onClickRemoveItem);

  button.appendChild(icon);
  li.appendChild(button);

  // Add li to the DOM
  itemList.appendChild(li);
}

export function createElement(tagName, className) {
  let element = null;

  element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  return element;
}

export function addItemToStorage(item) {
  const itemsFromStorage = JSON.stringify([...getItemsFromStorage(), item]);
  LocalStorageController.setItem(itemsFromStorage);
}

export function getItemsFromStorage() {
  const itemsFromStorage = LocalStorageController.getItem();
  return itemsFromStorage ? JSON.parse(itemsFromStorage) : [];
}

export function removeItemFromStorage(item) {
  const itemsFromStorage = getItemsFromStorage().filter((i) => i !== item);
  LocalStorageController.setItem(JSON.stringify(itemsFromStorage));
}

export function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  // Clear from localStorage
  localStorage.removeItem("items");

  styleDisplayItems();
  initInputEditMode();
}

export function filterItems(e) {
  const elementList = itemList.querySelectorAll("li");
  const text = e.target.value.toLowerCase();

  elementList.forEach((element) => {
    const isIncludeText =
      element.firstChild.textContent.toLowerCase().indexOf(text) != -1;

    setStyleDisplay(element, isIncludeText ? "flex" : "none");
  });
}

export function styleDisplayItems() {
  const items = itemList.querySelectorAll("li");

  [clearBtn, itemFilter].forEach((element) =>
    setStyleDisplay(element, items.length === 0 ? "none" : "block")
  );

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = "#333";
}

function setStyleDisplay(element, display) {
  element.style.display = display;
}

export function initInputEditMode() {
  itemInput.value = "";
  isEditMode = false;
}

// Initialize app
export function init() {
  // Event Listeners
  itemForm.addEventListener("submit", onAddItemSubmit);
  clearBtn.addEventListener("click", () => {
    clearItems();
    styleDisplayItems();
    initInputEditMode();
  });
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", () => {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(addItemToDOM);
    styleDisplayItems();
    initInputEditMode();
  });
}

init();

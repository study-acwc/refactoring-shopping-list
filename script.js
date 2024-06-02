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
  const itemsFromStorage = getItemsFromStorage();

  // Add new item to array
  itemsFromStorage.push(item);

  // Convert to JSON string and set to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

export function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemsFromStorage;
}

export function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Re-set to localstorage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
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
  const items = itemList.querySelectorAll("li");
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

export function styleDisplayItems() {
  const items = itemList.querySelectorAll("li");

  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = "#333";
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

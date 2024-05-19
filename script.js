import * as thisModule from './script.js';

export const itemForm = document.getElementById('item-form');
export const itemInput = document.getElementById('item-input');
export const itemList = document.getElementById('item-list');
export const clearBtn = document.getElementById('clear');
export const itemFilter = document.getElementById('filter');
export const formBtn = itemForm.querySelector('button');
export let isEditMode = false;

export function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}

export function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = uniqueInput();

  if (false == validateInput(newItem)) {
    alert('Please add an item');
    return;
  }

  // Check for edit mode
  if (isEditingItem()) {
    removeEditingItem()
  } else {
    if (checkIfItemExists(newItem)) {
      alertIfItemExists();
      return;
  }

  // Create item DOM element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);

  checkUI();

  itemInput.value = '';
}

export function addItemToDOM(item) {
  // Create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  // Add li to the DOM
  itemList.appendChild(li);
}

export function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

export function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

export function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  // Add new item to array
  itemsFromStorage.push(item);

  // Convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

export function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

export function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    thisModule.removeItem(e.target.parentElement.parentElement);
  } else if (e.target.closest('li')) {
    thisModule.setItemToEdit(e.target);
  }
}

export function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

export function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item';
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = item.textContent;
}

export function removeItem(item) {
  if (
    confirm(`Are you sure you want to remove the item "${item.textContent}"?`)
  ) {
    // Remove item from DOM
    item.remove();

    // Remove item from storage
    removeItemFromStorage(item.textContent);

    checkUI();
  }
}

export function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Re-set to localstorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

export function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  // Clear from localStorage
  localStorage.removeItem('items');

  checkUI();
}

export function filterItems(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

export function checkUI() {
  itemInput.value = '';

  const items = itemList.querySelectorAll('li');

  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;
}

function validateInput(input) {
  return input != ''
}

function uniqueInput() {
  return itemInput.value.trim()
}

function alertIfItemExists (newItem) {
  alert(`The item "${newItem}" already exists!`);
}

function isEditingItem() {
  return isEditMode
}

function removeEditingItem() {
  const itemToEdit = itemList.querySelector('.edit-mode');

  removeItemFromStorage(itemToEdit.textContent);
  itemToEdit.classList.remove('edit-mode');
  itemToEdit.remove();

  turnOffEditMode();
}

function turnOffEditMode() {
  isEditMode = false;
}

// Initialize app
export function init() {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();
}

init();
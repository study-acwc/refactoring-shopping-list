import * as thisModule from './script.js';

export const itemForm = document.getElementById('item-form');
export const itemInput = document.getElementById('item-input');
export const itemList = document.getElementById('item-list');
export const clearBtn = document.getElementById('clear');
export const itemFilter = document.getElementById('filter');
export const formBtn = itemForm.querySelector('button');
export let isEditMode = false;

export function displayItems() {
  allItemsFromStorage()
    .forEach((item) => addItemToDOM(item));
  updateUIBasedOnListState();
}

export function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = uniqueInput();
  if (false == validateInput(newItem)) {
    alertAddAnItem();
    return;
  }
  if (isEditingItem()) {
    removeEditingItem()
  } else if (checkIfItemExists(newItem)) {
    alertIfItemExists();
    return;
  }
  addItemToDOM(newItem);
  addItemToStorage(newItem);
  updateUIBasedOnListState();
  clearInput();
}

export function addItemToDOM(item) {
  const li = createListItem(item)
  // Add li to the DOM
  itemList.appendChild(li);
}

function createListItem(item) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
  
    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    return li;
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
  const itemsFromStorage = allItemsFromStorage();

  // Add new item to array
  itemsFromStorage.push(item);

  // Convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

export function allItemsFromStorage() {
  const itemsJsonString = localStorage.getItem('items');
  return itemsJsonString === null ? [] : JSON.parse(itemsJsonString);
}

export function onClickItem(e) {
  if (isRemoveButtonClicked(e)) {
    thisModule.removeItem(e.target.parentElement.parentElement);
  } else if (isItemClicked(e)) {
    thisModule.setItemToEdit(e.target);
  }
}

function isRemoveButtonClicked(e) {
  return e.target.parentElement.classList.contains('remove-item');
}

function isItemClicked(e) {
  return e.target.closest('li');
}

export function checkIfItemExists(item) {
  const itemsFromStorage = allItemsFromStorage();
  return itemsFromStorage.includes(item);
}

export function setItemToEdit(item) {
  turnOnEditMode();
  toggleEditModeForSingleItem(item);
  styleFormButtonToEditMode();
  updateInput(item.textContent);
}

function styleFormButtonToEditMode() {
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item';
  formBtn.style.backgroundColor = '#228B22';
}

function toggleEditModeForSingleItem(item) {
  allItemsFromDOM()
    .forEach((i) => i.classList.remove('edit-mode'));
  item.classList.add('edit-mode');
}

function disableEditModeClassFor(item) {
  item.classList.remove('edit-mode');
}

export function removeItem(item) {
  if (false == confirmItemRemoval(item.textContent)) {
    return;
  }
  removeItemFromDOM(item);
  removeItemFromStorage(item.textContent);
  updateUIBasedOnListState();
}

function removeItemFromDOM(item) {
  item.remove();
}

function confirmItemRemoval(textContent) {
  return confirm(`Are you sure you want to remove the item "${textContent}"?`)
}

export function removeItemFromStorage(item) {
  let itemsFromStorage = allItemsFromStorage();

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Re-set to localstorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

export function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  clearItemsFromLocalStorage();
  updateUIBasedOnListState();
}

function clearItemsFromLocalStorage() {
  localStorage.removeItem('items');
}

export function filterItems(e) {
  const items = allItemsFromDOM();
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    item.style.display = itemName.indexOf(text) != -1 ? 'flex' : 'none';
  });
}

export function updateUIBasedOnListState() {
  clearInput();

  if (isItemListEmptyInDOM()) {
    hideListControls()
  } else {
    showListControls()
  }
  setAddItemButtonStyle();
  turnOffEditMode();
}

function isItemListEmptyInDOM () {
  const items = allItemsFromDOM();
  return items.length === 0
}

function setAddItemButtonStyle() {
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';
}

function hideListControls() {
  clearBtn.style.display = 'none';
  itemFilter.style.display = 'none'; 
}

function showListControls() {
  clearBtn.style.display = 'block';
  itemFilter.style.display = 'block';
}

function allItemsFromDOM() {
  return itemList.querySelectorAll('li');
}

function validateInput(input) {
  return input != ''
}

function clearInput () {
  itemInput.value = '';
}

function updateInput(newValue) {
  itemInput.value = newValue;
}

function uniqueInput() {
  return itemInput.value.trim()
}

function alertIfItemExists (newItem) {
  alert(`The item "${newItem}" already exists!`);
}

function alertAddAnItem() {
  alert('Please add an item');
}

function isEditingItem() {
  return isEditMode
}

function editingItem() {
  return itemList.querySelector('.edit-mode');
}

function removeEditingItem() {
  const item = editingItem();
  removeItemFromStorage(item.textContent);
  disableEditModeClassFor(item);
  removeItemFromDOM(item);
  turnOffEditMode();
}

function turnOffEditMode() {
  isEditMode = false;
}

function turnOnEditMode() {
  isEditMode = true;
}

function registerEventListeners() {
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);
}

// Initialize app
export function init() {
  registerEventListeners();
  updateUIBasedOnListState();
}

init();
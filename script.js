import * as thisModule from './script.js';

export const itemForm = document.getElementById('item-form');
export const itemInput = document.getElementById('item-input');
export const itemList = document.getElementById('item-list');
export const clearBtn = document.getElementById('clear');
export const itemFilter = document.getElementById('filter');
export const formBtn = itemForm.querySelector('button');
export let isEditMode = false;

function displayItems() {
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
    const listItemElement = e.target.parentElement.parentElement;
    thisModule.removeItem(listItemElement);
  } else if (isItemClicked(e)) {
    const listItemElement = e.target;
    thisModule.setItemToEdit(listItemElement);
  }
}

function isRemoveButtonClicked(e) {
  const buttonElement = e.target.parentElement
  return buttonElement.classList.contains('remove-item');
}

function isItemClicked(e) {
  return e.target.closest('li');
}

export function checkIfItemExists(item) {
  return allItemsFromStorage().includes(item);
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
    .forEach((i) => disableEditModeClassFor(i));
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
  const filteredOutItems = allItemsFromStorage().filter((i) => i !== item);
  // Re-set to localstorage
  localStorage.setItem('items', JSON.stringify(filteredOutItems));
}

export function clearItems() {
  clearItemsFromDOM();
  clearItemsFromLocalStorage();
  updateUIBasedOnListState();
}

function clearItemsFromDOM() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
}

function clearItemsFromLocalStorage() {
  localStorage.removeItem('items');
}

function filterItems(e) {
  const inputText = e.target.value.toLowerCase();

  allItemsFromDOM().forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    item.style.display = itemName.indexOf(inputText) != -1 ? 'flex' : 'none';
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
  return allItemsFromDOM().length === 0
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

function clearInput() {
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

export function onClickClearAll() {
  clearItems();
}

export function onEditingInput(e) {
  filterItems(e);
}

export function onDOMContentLoad() {
  displayItems();
}

function registerEventListeners() {
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', onClickClearAll);
  itemFilter.addEventListener('input', onEditingInput);
  document.addEventListener('DOMContentLoaded', onDOMContentLoad);
}

// Initialize app
export function init() {
  registerEventListeners();
  updateUIBasedOnListState();
}

init();
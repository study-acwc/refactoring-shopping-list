import * as thisModule from './script.js';

const BUTTON_ELEMENT = 'button';
const LI_ELEMENT = 'li';
const ITEMS_STORAGE_KEY = 'items';
const EDITMODE_ELEMENT_CLASS = 'edit-mode';

const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector(BUTTON_ELEMENT);
let isEditMode = false;

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
    const li = document.createElement(LI_ELEMENT);
    li.appendChild(document.createTextNode(item));
  
    const button = createButtonWithClasses('remove-item btn-link text-red');
    li.appendChild(button);

    return li;
}

export function createButtonWithClasses(classes) {
  const button = document.createElement(BUTTON_ELEMENT);
  button.className = classes;
  const icon = createIconWithClasses('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

export function createIconWithClasses(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

export function addItemToStorage(item) {
  const itemsFromStorage = allItemsFromStorage();

  // Add new item to array
  itemsFromStorage.push(item);

  // Convert to JSON string and set to local storage
  localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(itemsFromStorage));
}

export function allItemsFromStorage() {
  const itemsJsonString = localStorage.getItem(ITEMS_STORAGE_KEY);
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
  return e.target.closest(LI_ELEMENT);
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
  item.classList.add(EDITMODE_ELEMENT_CLASS);
}

function disableEditModeClassFor(item) {
  item.classList.remove(EDITMODE_ELEMENT_CLASS);
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
  localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(filteredOutItems));
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
  localStorage.removeItem(ITEMS_STORAGE_KEY);
}

export function isClearButtonHidden() {
  return clearBtn.style.display == CSSDisplay.NONE;
}

export function isClearButtonDisplayed() {
  return clearBtn.style.display == CSSDisplay.BLOCK;
}

function filterItems(inputText) {
  allItemsFromDOM().forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    item.style.display = itemName.indexOf(inputText) != -1 ? CSSDisplay.FLEX : CSSDisplay.NONE;
  });
}

export function isFilterHidden() {
  return itemFilter.style.display == CSSDisplay.NONE;
}

export function isFilterDisplayed() {
  return itemFilter.style.display == CSSDisplay.BLOCK;
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

export const CSSDisplay = {
  NONE: 'none',
  BLOCK: 'block',
  FLEX: 'flex'
}

function hideListControls() {
  clearBtn.style.display = CSSDisplay.NONE;
  itemFilter.style.display = CSSDisplay.NONE; 
}

function showListControls() {
  clearBtn.style.display = CSSDisplay.BLOCK;
  itemFilter.style.display = CSSDisplay.BLOCK;
}

export function allItemsFromDOM() {
  return itemList.querySelectorAll(LI_ELEMENT);
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

export function uniqueInput() {
  return itemInput.value.trim()
}

function alertIfItemExists (newItem) {
  alert(`The item "${newItem}" already exists!`);
}

function alertAddAnItem() {
  alert('Please add an item');
}

export function isEditingItem() {
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
  filterItems(e.target.value.toLowerCase());
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

function initializeApp() {
  registerEventListeners();
  updateUIBasedOnListState();
}

initializeApp();
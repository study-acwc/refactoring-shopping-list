import * as thisModule from './script.js';
import * as storage from './storage.js';

// MARK: - 변수 선언

const BUTTON_ELEMENT = 'button';
const LI_ELEMENT = 'li';
const ITEMS_STORAGE_KEY = 'items';
export const EDITMODE_ELEMENT_CLASS = 'edit-mode';
export const ITEM_INPUT_ID = 'item-input';

const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector(BUTTON_ELEMENT);
let isEditMode = false;

export const CSSDisplay = {
  NONE: 'none',
  BLOCK: 'block',
  FLEX: 'flex'
}

// MARK: - 함수 실행문

initializeApp();

// MARK: - initializeApp()

function initializeApp() {
  registerEventListeners();
  updateUIBasedOnListState();
}

function registerEventListeners() {
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', onClickClearAll);
  itemFilter.addEventListener('input', onEditingInput);
  document.addEventListener('DOMContentLoaded', onDOMContentLoad);
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

export function onClickItem(e) {
  if (isRemoveButtonClicked(e)) {
    const listItemElement = e.target.parentElement.parentElement;
    thisModule.removeItem(listItemElement);
  } else if (isItemClicked(e)) {
    const listItemElement = e.target;
    thisModule.setItemToEdit(listItemElement);
  }
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

// MARK: - for onAddItemSubmit()

export function uniqueInput() {
  return itemInput.value.trim()
}

function validateInput(input) {
  return input != ''
}

function alertAddAnItem() {
  alert('Please add an item');
}

export function isEditingItem() {
  return isEditMode
}

// ---->

function removeEditingItem() {
  const item = editingItem();
  removeItemFromStorage(item.textContent);
  disableEditModeClassFor(item);
  removeItemFromDOM(item);
  turnOffEditMode();
}

function editingItem() {
  return itemList.querySelector('.edit-mode');
}

// <-----

export function checkIfItemExists(item) {
  return allItemsFromStorage().includes(item);
}

function alertIfItemExists(newItem) {
  alert(`The item "${newItem}" already exists!`);
}

// ------>
export function addItemToDOM(item) {
  const li = listItem(item)
  // Add li to the DOM
  itemList.appendChild(li);
}

function listItem(item) {
  const li = document.createElement(LI_ELEMENT);
  li.appendChild(document.createTextNode(item));

  const button = buttonWithClasses('remove-item btn-link text-red');
  li.appendChild(button);

  return li;
}

export function buttonWithClasses(classes) {
  const button = document.createElement(BUTTON_ELEMENT);
  button.className = classes;
  const icon = iconWithClasses('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

export function iconWithClasses(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}
// <------

export function addItemToStorage(item) {
  const itemsFromStorage = allItemsFromStorage();

  // Add new item to array
  itemsFromStorage.push(item);

  storage.storage().saveAllItems(itemsFromStorage);
}

// MARK: - for onClickItem()

function isRemoveButtonClicked(e) {
  const buttonElement = e.target.parentElement
  return buttonElement.classList.contains('remove-item');
}

//----->
export function removeItem(item) {
  if (false == confirmItemRemoval(item.textContent)) {
    return;
  }
  removeItemFromDOM(item);
  removeItemFromStorage(item.textContent);
  updateUIBasedOnListState();
}

function confirmItemRemoval(textContent) {
  return confirm(`Are you sure you want to remove the item "${textContent}"?`)
}
// <------

function isItemClicked(e) {
  return e.target.closest(LI_ELEMENT);
}

// ------->
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

function updateInput(newValue) {
  itemInput.value = newValue;
}

function turnOnEditMode() {
  isEditMode = true;
}

// <-------

// MARK: - for onClickClearAll()

// ------>
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
  storage.storage().clearItems();
}

// <------

// MARK: - for onEditingInput()

function filterItems(inputText) {
  allItemsFromDOM().forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    item.style.display = itemName.indexOf(inputText) != -1 ? CSSDisplay.FLEX : CSSDisplay.NONE;
  });
}

// MARK: - for onDOMContentLoad()


// MARK: - common

// ----->
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

function clearInput() {
  itemInput.value = '';
}

function isItemListEmptyInDOM () {
  return allItemsFromDOM().length === 0
}

function setAddItemButtonStyle() {
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';
}

function hideListControls() {
  clearBtn.style.display = CSSDisplay.NONE;
  itemFilter.style.display = CSSDisplay.NONE; 
}

function showListControls() {
  clearBtn.style.display = CSSDisplay.BLOCK;
  itemFilter.style.display = CSSDisplay.BLOCK;
}

function turnOffEditMode() {
  isEditMode = false;
}

// <-------

function displayItems() {
  allItemsFromStorage()
    .forEach((item) => addItemToDOM(item));
  updateUIBasedOnListState();
}

export function removeItemFromStorage(item) {
  const filteredOutItems = allItemsFromStorage().filter((i) => i !== item);
  storage.storage().saveAllItems(filteredOutItems);
}

export function allItemsFromStorage() {
  const itemsJsonString = storage.storage().allItems;
  return itemsJsonString === null ? [] : JSON.parse(itemsJsonString);
}

function disableEditModeClassFor(item) {
  item.classList.remove(EDITMODE_ELEMENT_CLASS);
}

function removeItemFromDOM(item) {
  item.remove();
}

export function allItemsFromDOM() {
  return itemList.querySelectorAll(LI_ELEMENT);
}

// MARK: - only for Unit Testing

export function isClearButtonHidden() {
  return clearBtn.style.display == CSSDisplay.NONE;
}

export function isClearButtonDisplayed() {
  return clearBtn.style.display == CSSDisplay.BLOCK;
}

export function isFilterHidden() {
  return itemFilter.style.display == CSSDisplay.NONE;
}

export function isFilterDisplayed() {
  return itemFilter.style.display == CSSDisplay.BLOCK;
}
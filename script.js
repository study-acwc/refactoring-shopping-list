import * as thisModule from './script.js';
import * as storage from './storage.js';
import * as itemElements from './itemElementList.js';

// MARK: - 변수 선언

const BUTTON_ELEMENT = 'button';
const LI_ELEMENT = 'li';
const ITEMS_STORAGE_KEY = 'items';
export const ITEM_INPUT_ID = 'item-input';

const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector(BUTTON_ELEMENT);
let isEditMode = false;

export const aStorage = new storage.Storage('items');
export const anItemList = new itemElements.ItemElementList(document.getElementById('item-list'));

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
  anItemList._list.addEventListener('click', onClickItem);
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
  } else if (aStorage.hasItem(newItem)) {
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
  anItemList.filterItems(e.target.value.toLowerCase());
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
  const item = anItemList.editingItem;
  removeItemFromStorage(item.textContent);
  anItemList.disableEditModeClassFor(item);
  removeItemFromDOM(item);
  turnOffEditMode();
}
// <-----

function alertIfItemExists(newItem) {
  alert(`The item "${newItem}" already exists!`);
}

// ------>
export function addItemToDOM(item) {
  const li = listItem(item)
  anItemList.appendItem(li);
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
  const itemsFromStorage = aStorage.allItems;

  // Add new item to array
  itemsFromStorage.push(item);

  aStorage.saveAllItems(itemsFromStorage);
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
  anItemList.toggleEditModeForSingleItem(item);
  styleFormButtonToEditMode();
  updateInput(item.textContent);
}

function styleFormButtonToEditMode() {
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item';
  formBtn.style.backgroundColor = '#228B22';
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
  anItemList.clearItems();
  aStorage.clearItems();
  updateUIBasedOnListState();
}

// <------

// MARK: - for onDOMContentLoad()


// MARK: - common

// ----->
export function updateUIBasedOnListState() {
  clearInput();

  if (anItemList.isItemListEmptyInDOM()) {
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
  aStorage.allItems
    .forEach((item) => addItemToDOM(item));
  updateUIBasedOnListState();
}

export function removeItemFromStorage(item) {
  const filteredOutItems = aStorage.allItems.filter((i) => i !== item);
  aStorage.saveAllItems(filteredOutItems);
}

function removeItemFromDOM(item) {
  item.remove();
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
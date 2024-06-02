import * as thisModule from './script.js';
import * as storage from './storage.js';
import * as elements from './elements.js';

// MARK: - 변수 선언

export const aStorage = new storage.Storage('items');
export const anItemList = new elements.ItemElementList(document.getElementById('item-list'));
const anItemForm = new elements.ItemForm(document.getElementById('item-form'));
export const aClearButton = new elements.ClearButton(document.getElementById('clear'));
export const anItemFilter = new elements.ItemFilter(document.getElementById('filter'));
export const anItemInput = new elements.ItemInput(document.getElementById('item-input'));
export const aFormButton = new elements.FormButton(anItemForm.formButton);

let isEditMode = false;

// MARK: - 함수 실행문

initializeApp();

// MARK: - initializeApp()

function initializeApp() {
  registerEventListeners();
  updateUIBasedOnListState();
}

function registerEventListeners() {
  anItemForm._element.addEventListener('submit', onAddItemSubmit);
  anItemList._list.addEventListener('click', onClickItem);
  aClearButton._element.addEventListener('click', onClickClearAll);
  anItemFilter._element.addEventListener('input', onEditingInput);
  document.addEventListener('DOMContentLoaded', onDOMContentLoad);
}

export function onAddItemSubmit(e) {
  e.preventDefault();
  if (false == anItemInput.hasValidValue) {
    alertAddAnItem();
    return;
  }
  const newItem = anItemInput.uniqueValue;
  if (isEditingItem()) {
    removeEditingItem()
  } else if (aStorage.hasItem(newItem)) {
    alertIfItemExists();
    return;
  }
  anItemList.appendItemWith(newItem);
  aStorage.addItem(newItem);
  updateUIBasedOnListState();
  anItemInput.clearValue();
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
function alertAddAnItem() {
  alert('Please add an item');
}

export function isEditingItem() {
  return isEditMode
}

// ---->

function removeEditingItem() {
  const item = anItemList.editingItem;
  aStorage.removeItem(item.textContent);
  anItemList.disableEditModeClassFor(item);
  anItemList.removeItem(item);
  turnOffEditMode();
}
// <-----

function alertIfItemExists(newItem) {
  alert(`The item "${newItem}" already exists!`);
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
  anItemList.removeItem(item);
  aStorage.removeItem(item.textContent);
  updateUIBasedOnListState();
}

function confirmItemRemoval(textContent) {
  return confirm(`Are you sure you want to remove the item "${textContent}"?`)
}
// <------

function isItemClicked(e) {
  return e.target.closest(anItemList.LI_ELEMENT);
}

// ------->
export function setItemToEdit(item) {
  turnOnEditMode();
  anItemList.toggleEditModeForSingleItem(item);
  aFormButton.applyEditModeStyle();
  anItemInput.updateValue(item.textContent);
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
  anItemInput.clearValue();

  if (anItemList.isItemListEmptyInDOM()) {
    hideListControls()
  } else {
    showListControls()
  }
  aFormButton.applyAddModeStyle();
  turnOffEditMode();
}

function hideListControls() {
  aClearButton.hide();
  anItemFilter.hide();
}

function showListControls() {
  aClearButton.show();
  anItemFilter.show();
}

function turnOffEditMode() {
  isEditMode = false;
}

// <-------

function displayItems() {
  aStorage.allItems
    .forEach((item) => anItemList.appendItemWith(item));
  updateUIBasedOnListState();
}
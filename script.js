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
const aFormButton = new elements.FormButton(anItemForm.formButton);

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

// MARK: - onAddItemSubmit

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
  addItemWith(newItem);
}

function alertAddAnItem() {
  alert('Please add an item');
}

export function isEditingItem() {
  return isEditMode
}

function removeEditingItem() {
  const item = anItemList.editingItem;
  aStorage.removeItem(item.textContent);
  anItemList.disableEditModeClassFor(item);
  anItemList.removeItem(item);
  turnOffEditMode();
}

function alertIfItemExists(newItem) {
  alert(`The item "${newItem}" already exists!`);
}

function addItemWith(newItem) {
  anItemList.appendItemWith(newItem);
  aStorage.addItem(newItem);
  updateUIBasedOnListState();
  anItemInput.clearValue();
}

// MARK: - onClickItem

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

//----->
export function removeItem(item) {
  if (false == confirmItemRemoval(item.textContent)) {
    return;
  }
  anItemList.removeItem(item);
  aStorage.removeItem(item.textContent);
  updateUIBasedOnListState();
}

function isItemClicked(e) {
  return e.target.closest(anItemList.LI_ELEMENT);
}

function confirmItemRemoval(textContent) {
  return confirm(`Are you sure you want to remove the item "${textContent}"?`)
}

// -----> setItemToEdit
export function setItemToEdit(item) {
  turnOnEditMode();
  anItemList.toggleEditModeForSingleItem(item);
  aFormButton.applyEditModeStyle();
  anItemInput.updateValue(item.textContent);
}

function turnOnEditMode() {
  isEditMode = true;
}

// <------ setItemToEdit

// MARK: - onClickClearAll

export function onClickClearAll() {
  clearItems();
}

export function clearItems() {
  anItemList.clearItems();
  aStorage.clearItems();
  updateUIBasedOnListState();
}

// MARK: - onEditingInput

export function onEditingInput(e) {
  anItemList.filterItemsWith(e.target.value.toLowerCase());
}

// MARK: - onDOMContentLoad

export function onDOMContentLoad() {
  displayItems();
}

function displayItems() {
  aStorage.allItems
    .forEach((item) => anItemList.appendItemWith(item));
  updateUIBasedOnListState();
}

// MARK: - common

// -----> updateUIBasedOnListState

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

// <------- updateUIBasedOnListState

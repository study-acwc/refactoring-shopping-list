import * as thisModule from './script.js';
import * as storage from './storage.js';
import * as elements from './elements.js';
import * as commands from './commands.js';

// MARK: - 변수 선언

export const aStorage = new storage.Storage('items');
export const anItemList = new elements.ItemElementList(document.getElementById('item-list'));
const anItemForm = new elements.ItemForm(document.getElementById('item-form'));
export const aClearButton = new elements.ClearButton(document.getElementById('clear'));
export const anItemFilter = new elements.ItemFilter(document.getElementById('filter'));
export const anItemInput = new elements.ItemInput(document.getElementById('item-input'));
export const aFormButton = new elements.FormButton(anItemForm.formButton);

const clearAllCommand = new commands.ClearAllCommand(anItemList, aStorage);
const filterItemsCommand = new commands.FilterItemsCommand(anItemList);
const displayAllItemsCommand = new commands.DisplayAllItemsCommand(anItemList, aStorage);
const refreshUICommand = new commands.refreshUICommand(anItemInput, anItemList, aFormButton, aClearButton, anItemFilter);
const removeItemCommand = new commands.RemoveItemCommand(anItemList, aStorage);
const setItemToEditCommand = new commands.SetItemToEditCommand(anItemList, aFormButton, anItemInput);
const AddItemCommand = new commands.AddItemCommand(anItemList, aStorage);

// MARK: - 함수 실행문

initializeApp();

// MARK: - initializeApp()

function initializeApp() {
  registerEventListeners();
  refreshUICommand.execute();
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
  if (aFormButton.isEditMode) {
    removeEditingItem();
    addItemWith(newItem);
    refreshUICommand.execute();
  } else {
    if (aStorage.hasItem(newItem)) {
      alertIfItemExists();
      return;
    }
    addItemWith(newItem);
    refreshUICommand.execute();
  }
}

function alertAddAnItem() {
  alert('Please add an item');
}

function removeEditingItem() {
  const item = anItemList.editingItem;
  aStorage.removeItem(item.textContent);
  anItemList.disableEditModeClassFor(item);
  anItemList.removeItem(item);
}

function alertIfItemExists(newItem) {
  alert(`The item "${newItem}" already exists!`);
}

function addItemWith(newItem) {
  anItemList.appendItemWith(newItem);
  aStorage.addItem(newItem);
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

export function removeItem(item) {
  removeItemCommand.execute(item);
  refreshUICommand.execute();
}

function isItemClicked(e) {
  return e.target.closest(anItemList.LI_ELEMENT);
}

export function setItemToEdit(item) {
  setItemToEditCommand.execute(item);
}

// MARK: - onClickClearAll

export function onClickClearAll() {
  clearItems();
}

export function clearItems() {
  clearAllCommand.execute();
  refreshUICommand.execute();
}

// MARK: - onEditingInput

export function onEditingInput(e) {
  filterItemsCommand.execute(e.target.value);
}

// MARK: - onDOMContentLoad

export function onDOMContentLoad() {
  displayAllItemsCommand.execute();
  refreshUICommand.execute();
}
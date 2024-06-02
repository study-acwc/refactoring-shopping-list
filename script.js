import * as thisModule from './script.js';
import * as storage from './storage.js';
import * as elements from './elements.js';
import * as commands from './commands.js';

// MARK: - 변수 선언

class ShoppingListPage {
  constructor() {
    this.aStorage = new storage.Storage('items');
    this.anItemList = new elements.ItemElementList(document.getElementById('item-list'));
    this.anItemForm = new elements.ItemForm(document.getElementById('item-form'));
    this.aClearButton = new elements.ClearButton(document.getElementById('clear'));
    this.anItemFilter = new elements.ItemFilter(document.getElementById('filter'));
    this.anItemInput = new elements.ItemInput(document.getElementById('item-input'));
    this.aFormButton = new elements.FormButton(this.anItemForm.formButton);
    
    this.clearAllCommand = new commands.ClearAllCommand(this.anItemList, this.aStorage);
    this.filterItemsCommand = new commands.FilterItemsCommand(this.anItemList);
    this.displayAllItemsCommand = new commands.DisplayAllItemsCommand(this.anItemList, this.aStorage);
    this.refreshUICommand = new commands.refreshUICommand(this.anItemInput, this.anItemList, this.aFormButton, this.aClearButton, this.anItemFilter);
    this.removeItemCommand = new commands.RemoveItemCommand(this.anItemList, this.aStorage);
    this.setItemToEditCommand = new commands.SetItemToEditCommand(this.anItemList, this.aFormButton, this.anItemInput);
    this.addItemCommand = new commands.AddItemCommand(this.anItemList, this.aStorage);
    this.removeEditingItemCommand = new commands.RemoveEditingItemCommand(this.anItemList, this.aStorage);
  }

  initiallize() {
    this.registerEventListeners();
    this.refreshUICommand.execute();
  }

  registerEventListeners() {
    this.anItemForm._element.addEventListener('submit', this.onAddItemSubmit);
    this.anItemList._list.addEventListener('click', this.onClickItem);
    this.aClearButton._element.addEventListener('click', this.onClickClearAll);
    this.anItemFilter._element.addEventListener('input', this.onEditingInput);
    document.addEventListener('DOMContentLoaded', this.onDOMContentLoad);
  }

  // MARK: - onAddItemSubmit

  onAddItemSubmit(e) {
    e.preventDefault();
    if (false == this.anItemInput.hasValidValue) {
      this.alertAddAnItem();
      return;
    }
    const newItem = this.anItemInput.uniqueValue;
    if (this.aFormButton.isEditMode) {
      this.removeEditingItemCommand.execute();
      this.addItemCommand.execute(newItem);
      this.refreshUICommand.execute();
    } else {
      if (this.aStorage.hasItem(newItem)) {
        this.alertIfItemExists();
        return;
      }
      this.addItemCommand.execute(newItem);
      this.refreshUICommand.execute();
    }
  }

  alertAddAnItem() {
    alert('Please add an item');
  }

  alertIfItemExists(newItem) {
    alert(`The item "${newItem}" already exists!`);
  }

  // MARK: - onClickItem

  onClickItem(e) {
    if (this.isRemoveButtonClicked(e)) {
      const listItemElement = e.target.parentElement.parentElement;
      this.removeItem(listItemElement);
    } else if (this.isItemClicked(e)) {
      const listItemElement = e.target;
      this.setItemToEdit(listItemElement);
    }
  }

  isRemoveButtonClicked(e) {
    const buttonElement = e.target.parentElement
    return buttonElement.classList.contains('remove-item');
  }

  removeItem(item) {
    this.removeItemCommand.execute(item);
    this.refreshUICommand.execute();
  }

  isItemClicked(e) {
    return e.target.closest(this.anItemList.LI_ELEMENT);
  }

  setItemToEdit(item) {
    this.setItemToEditCommand.execute(item);
  }

  // MARK: - onClickClearAll

  onClickClearAll() {
    this.clearAllCommand.execute();
    this.refreshUICommand.execute();
  }

  // MARK: - onEditingInput

  onEditingInput(e) {
    this.filterItemsCommand.execute(e.target.value);
  }

  // MARK: - onDOMContentLoad

  onDOMContentLoad() {
    this.displayAllItemsCommand.execute();
    this.refreshUICommand.execute();
  }
}

export const page = new ShoppingListPage();

// MARK: - 함수 실행문

initializeApp();

// MARK: - initializeApp()

function initializeApp() {
  page.initiallize();
}
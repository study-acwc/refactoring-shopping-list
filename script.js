import * as storage from './storage.js';
import * as elements from './elements.js';
import * as commands from './commands.js';

// MARK: - 변수 선언

export class ShoppingListPage {
  #presenter;

  #anItemForm;
  #aClearButton;
  #anItemFilter;

  constructor() {
    this.anItemList = new elements.ItemElementList(document.getElementById('item-list'));
    this.#anItemForm = new elements.ItemForm(document.getElementById('item-form'));
    this.#aClearButton = new elements.ClearButton(document.getElementById('clear'));
    this.#anItemFilter = new elements.ItemFilter(document.getElementById('filter'));
    
    this.#registerEventListeners();
  }

  setPresenter(presenter) {
    this.#presenter = presenter;
  }

  #registerEventListeners() {
    this.#anItemForm.addListener(this.onAddItemSubmit.bind(this));
    this.anItemList.addListener(this.onClickItem.bind(this));
    this.#aClearButton.addListener(this.onClickClearAll.bind(this));
    this.#anItemFilter.addListener(this.onEditingInput.bind(this));
    document.addEventListener('DOMContentLoaded', this.onDOMContentLoad.bind(this));
  }

  onAddItemSubmit(e) {
    this.#presenter.onAddItemSubmit(e);
  }

  onClickItem(e) {
    this.#presenter.onClickItem(e);
  }

  onClickClearAll() {
    this.#presenter.onClickClearAll();
  }

  onEditingInput(e) {
    this.#presenter.onEditingInput(e);
  }

  onDOMContentLoad() {
    this.#presenter.onDOMContentLoad();
  }
}

export class ShoppingListPageController {
  #refreshUICommand;
  #anItemForm;
  #aClearButton;
  #anItemFilter;
  #aFormButton;
  #view;

  constructor(view) {
    this.#view = view;
    this.aStorage = new storage.Storage('items');
    this.anItemList = new elements.ItemElementList(document.getElementById('item-list'));
    this.#anItemForm = new elements.ItemForm(document.getElementById('item-form'));
    this.#aClearButton = new elements.ClearButton(document.getElementById('clear'));
    this.#anItemFilter = new elements.ItemFilter(document.getElementById('filter'));
    this.anItemInput = new elements.ItemInput(document.getElementById('item-input'));
    this.#aFormButton = new elements.FormButton(this.#anItemForm.formButton);
    
    this.#refreshUICommand = new commands.refreshUICommand(this.anItemInput, this.anItemList, this.#aFormButton, this.#aClearButton, this.#anItemFilter);
  }

  launchUI() {
    this.#refreshUICommand.execute();
  }

  // MARK: - onAddItemSubmit

  onAddItemSubmit(e) {
    e.preventDefault();
    if (false == this.anItemInput.hasValidValue) {
      this.#alertAddAnItem();
      return;
    }
    const newItem = this.anItemInput.uniqueValue;
    if (this.#aFormButton.isEditMode) {
      new commands.RemoveEditingItemCommand(this.anItemList, this.aStorage).execute();
      new commands.AddItemCommand(this.anItemList, this.aStorage).execute(newItem);
      this.#refreshUICommand.execute();
    } else {
      if (this.aStorage.hasItem(newItem)) {
        this.#alertIfItemExists();
        return;
      }
      new commands.AddItemCommand(this.anItemList, this.aStorage).execute(newItem);
      this.#refreshUICommand.execute();
    }
  }

  #alertAddAnItem() {
    alert('Please add an item');
  }

  #alertIfItemExists(newItem) {
    alert(`The item "${newItem}" already exists!`);
  }

  // MARK: - onClickItem

  onClickItem(e) {
    if (this.#isRemoveButtonClicked(e)) {
      const listItemElement = e.target.parentElement.parentElement;
      this.removeItem(listItemElement);
    } else if (this.#isItemClicked(e)) {
      const listItemElement = e.target;
      this.setItemToEdit(listItemElement);
    }
  }

  #isRemoveButtonClicked(e) {
    const buttonElement = e.target.parentElement
    return buttonElement.classList.contains('remove-item');
  }

  removeItem(item) {
    new commands.RemoveItemCommand(this.anItemList, this.aStorage).execute(item);
    this.#refreshUICommand.execute();
  }

  #isItemClicked(e) {
    return e.target.closest(this.anItemList.LI_ELEMENT);
  }

  setItemToEdit(item) {
    new commands.SetItemToEditCommand(this.anItemList, this.#aFormButton, this.anItemInput).execute(item);
  }

  // MARK: - onClickClearAll

  onClickClearAll() {
    new commands.ClearAllCommand(this.anItemList, this.aStorage).execute();
    this.#refreshUICommand.execute();
  }

  // MARK: - onEditingInput

  onEditingInput(e) {
    new commands.FilterItemsCommand(this.anItemList).execute(e.target.value);
  }

  // MARK: - onDOMContentLoad

  onDOMContentLoad() {
    this.#displayAllItems();
    this.#refreshUICommand.execute();
  }

  #displayAllItems() {
    this.aStorage.allItems
            .forEach((item) => this.anItemList.appendItemWith(item));
  }
}

const view = new ShoppingListPage();
export const page = new ShoppingListPageController(view);

// MARK: - 함수 실행문
view.setPresenter(page);
page.launchUI()
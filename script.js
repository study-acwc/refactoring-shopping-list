import * as storage from './storage.js';
import * as elements from './elements.js';
import * as commands from './commands.js';

// MARK: - 변수 선언

export class ShoppingListPage {
  #presenter;

  #anItemForm;
  #aClearButton;
  #anItemFilter;
  #aFormButton;

  #refreshUICommand;

  constructor() {
    this.anItemList = new elements.ItemElementList(document.getElementById('item-list'));
    this.#anItemForm = new elements.ItemForm(document.getElementById('item-form'));
    this.#aClearButton = new elements.ClearButton(document.getElementById('clear'));
    this.#anItemFilter = new elements.ItemFilter(document.getElementById('filter'));
    this.#aFormButton = new elements.FormButton(this.#anItemForm.formButton);
    this.anItemInput = new elements.ItemInput(document.getElementById('item-input'));

    this.#refreshUICommand = new commands.refreshUICommand(this.anItemInput, this.anItemList, this.#aFormButton, this.#aClearButton, this.#anItemFilter);

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

  // MARK: - calling by preseneter

  displayAllItems(itemTitles) {
    itemTitles.forEach((item) => this.anItemList.appendItemWith(item));
    this.#refreshUICommand.execute();
  }

  filterItems(itemTitle) {
    this.anItemList.filterItemsWith(itemTitle.toLowerCase());
  }

  clearAll() {
    this.anItemList.clearItems();
    this.#refreshUICommand.execute();
  }

  setItemToEdit(item) {
    this.anItemList.toggleEditModeForSingleItem(item);
    this.#aFormButton.applyEditModeStyle();
    this.anItemInput.updateValue(item.textContent);
  }

  // MARK: - 임시

  get isEditMode() {
    return this.#aFormButton.isEditMode
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
    if (this.#view.isEditMode) {
      this.#removeEditingItem();
      this.#addItem(newItem);
      this.#refreshUICommand.execute();
    } else {
      if (this.aStorage.hasItem(newItem)) {
        this.#alertIfItemExists();
        return;
      }
      this.#addItem(newItem);
      this.#refreshUICommand.execute();
    }
  }

  #addItem(newItem) {
    this.anItemList.appendItemWith(newItem);
    this.aStorage.addItem(newItem);
  }
 
  #removeEditingItem() {
    const item = this.anItemList.editingItem;
    this.aStorage.removeItem(item.textContent);
    this.anItemList.disableEditModeClassFor(item);
    this.anItemList.removeItem(item);
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
      this.#view.setItemToEdit(listItemElement);
    }
  }

  #isRemoveButtonClicked(e) {
    const buttonElement = e.target.parentElement
    return buttonElement.classList.contains('remove-item');
  }

  removeItem(item) {
    if (false == this.#confirmItemRemoval(item.textContent)) {
      return;
    }
    this.anItemList.removeItem(item);
    this.aStorage.removeItem(item.textContent);
    this.#refreshUICommand.execute();
  }

  #confirmItemRemoval(textContent) {
    return confirm(`Are you sure you want to remove the item "${textContent}"?`)
  }

  #isItemClicked(e) {
    return e.target.closest(this.anItemList.LI_ELEMENT);
  }

  // MARK: - onClickClearAll

  onClickClearAll() {
    this.#view.clearAll();
    this.aStorage.clearItems();
  }

  // MARK: - onEditingInput

  onEditingInput(e) {
    let itemTitle = e.target.value;
    this.#view.filterItems(itemTitle);
  }

  // MARK: - onDOMContentLoad

  onDOMContentLoad() {
    let itemTitles = this.aStorage.allItems;
    this.#view.displayAllItems(itemTitles);
  }
}

const view = new ShoppingListPage();
export const page = new ShoppingListPageController(view);

// MARK: - 함수 실행문
view.setPresenter(page);
page.launchUI()
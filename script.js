import * as storage from './storage.js';
import * as elements from './elements.js';
import * as commands from './commands.js';

// MARK: - ShoppingListPage

export class ShoppingListPage {
  #presenter;

  #anItemForm;
  #aClearButton;
  #anItemFilter;
  #aFormButton;
  #anItemInput;

  #refreshUICommand;

  constructor() {
    this.anItemList = new elements.ItemElementList(document.getElementById('item-list'));
    this.#anItemForm = new elements.ItemForm(document.getElementById('item-form'));
    this.#aClearButton = new elements.ClearButton(document.getElementById('clear'));
    this.#anItemFilter = new elements.ItemFilter(document.getElementById('filter'));
    this.#aFormButton = new elements.FormButton(this.#anItemForm.formButton);
    this.#anItemInput = new elements.ItemInput(document.getElementById('item-input'));

    this.#refreshUICommand = new commands.refreshUICommand(this.#anItemInput, this.anItemList, this.#aFormButton, this.#aClearButton, this.#anItemFilter);

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
    e.preventDefault();
    const newItem = this.#anItemInput.uniqueValue;
    if (this.#aFormButton.isEditMode) {
      this.#presenter.onClickUpdateItemSubmit(newItem);
    } else {
      this.#presenter.onClickAddItemSubmit(newItem);
    }
  }

  onClickItem(e) {
    if (this.#isRemoveButtonClicked(e)) {
      const listItemElement = e.target.parentElement.parentElement;
      this.#presenter.onItemRemovalConfirmed(listItemElement);
    } else if (this.#isItemClicked(e)) {
      const listItemElement = e.target;
      this.#presenter.onClickItem(listItemElement);
    }
  }

  #isRemoveButtonClicked(e) {
    const buttonElement = e.target.parentElement
    return buttonElement.classList.contains('remove-item');
  }

  #isItemClicked(e) {
    return e.target.closest(this.anItemList.LI_ELEMENT);
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
    this.#anItemInput.updateValue(item.textContent);
  }

  removeItem(item) {
    this.anItemList.removeItem(item);
    this.#refreshUICommand.execute();
  }

  removeEditingItem() {
    const item = this.anItemList.editingItem;
    this.anItemList.disableEditModeClassFor(item);
    this.anItemList.removeItem(item);
    this.#refreshUICommand.execute();
  }

  addItem(newItemTitle) {
    this.anItemList.appendItemWith(newItemTitle);
    this.#refreshUICommand.execute();
  }

  refreshUI() {
    this.#refreshUICommand.execute();
  }
}

// MARK: - ShoppingListPagePresenter

export class ShoppingListPagePresenter {
  #view;
  #model;

  constructor(view, model) {
    this.#view = view;
    this.#model = new storage.Storage('items');
  }

  launchUI() {
    this.#view.refreshUI();
  }

  // MARK: - onClickUpdateItemSubmit

  onClickUpdateItemSubmit(newItemTitle) {
    if (false == this.#isValidInput(newItemTitle)) {
      this.#alertAddAnItem();
      return;
    }

    this.#model.removeItem(newItemTitle.textContent);
    this.#view.removeEditingItem();
    this.#model.addItem(newItemTitle);
    this.#view.addItem(newItemTitle);
  }

  #isValidInput(value) {
    return value != ''
  }

  #alertAddAnItem() {
    alert('Please add an item');
  }

  // MARK: - onClickAddItemSubmit

  onClickAddItemSubmit(newItemTitle) {
    if (false == this.#isValidInput(newItemTitle)) {
      this.#alertAddAnItem();
      return;
    }
    if (this.#model.hasItem(newItemTitle)) {
      this.#alertIfItemExists(newItemTitle);
      return;
    }

    this.#model.addItem(newItemTitle);
    this.#view.addItem(newItemTitle);
  }

  #alertIfItemExists(newItem) {
    alert(`The item "${newItem}" already exists!`);
  }

  // MARK: - onClickItem

  onClickItem(listItemElement) {
    this.#view.setItemToEdit(listItemElement);
  }

  // MARK: - onItemRemovalConfirmed

  onItemRemovalConfirmed(item) {
    if (false == this.#confirmItemRemoval(item.textContent)) {
      return;
    }
    this.#model.removeItem(item.textContent);
    this.#view.removeItem(item);
  }

  #confirmItemRemoval(textContent) {
    return confirm(`Are you sure you want to remove the item "${textContent}"?`)
  }

  // MARK: - onClickClearAll

  onClickClearAll() {
    this.#view.clearAll();
    this.#model.clearItems();
  }

  // MARK: - onEditingInput

  onEditingInput(e) {
    let itemTitle = e.target.value;
    this.#view.filterItems(itemTitle);
  }

  // MARK: - onDOMContentLoad

  onDOMContentLoad() {
    let itemTitles = this.#model.allItems;
    this.#view.displayAllItems(itemTitles);
  }
}

const view = new ShoppingListPage();
export const presenter = new ShoppingListPagePresenter(
  view,
  new storage.Storage('items')
);

// MARK: - 함수 실행문
view.setPresenter(presenter);
presenter.launchUI()
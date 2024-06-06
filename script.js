import * as storage from './storage.js';
import * as elements from './elements.js';
import * as commands from './commands.js';

class ShoppingListPageController {
    #view;
    aStorage;

    constructor(view, aStorage) {
        this.#view = view;
        this.aStorage = aStorage;
    }

    launchUI() {
        this.#registerEventListeners();
        this.#view.launchUI();
    }

    #registerEventListeners() {
      this.#view.bindAddItemSubmitHandler(this.onAddItemSubmit.bind(this));
      this.#view.bindUpdateItemSubmitHandler(this.onUpdateItemSubmit.bind(this));
      this.#view.bindClearAll(this.onClickClearAll.bind(this));
      this.#view.bindClickItemContents(this.onClickItemContents.bind(this));
      this.#view.bindClickItemDeleteButton(this.onClickItemDeleteButton.bind(this));
      this.#view.bindEditingInput(this.onEditingInput.bind(this));
      this.#view.bindDOMContentLoaded(this.onDOMContentLoad.bind(this));
      this.#view.bindItemRemovalConfirmed(this.onItemRemovalConfirmed.bind(this));
    }  

    // MARK: - onAddItemSubmit

    onUpdateItemSubmit(editedItemTitle, newItemTitle) {
      if (false == this.#isValid(newItemTitle)) {
        this.#view.alertAddAnItem();
        return;
      }
      this.aStorage.removeItem(editedItemTitle);
      this.aStorage.addItem(newItemTitle);
      this.#view.replaceEditingItemWith(newItemTitle);
    }

    onAddItemSubmit(newItemTitle) {
      if (false == this.#isValid(newItemTitle)) {
        this.#view.alertAddAnItem();
        return;
      }
      if (this.aStorage.hasItem(newItemTitle)) {
        this.#view.alertIfItemExists(newItemTitle);
        return;
      }
      this.aStorage.addItem(newItemTitle);
      this.#view.addItemWith(newItemTitle);
    }

    #isValid(itemTitle) {
      return itemTitle != ''
    }

    // MARK: - onClickItem

    onClickItemContents(itemTitle) {
      this.#view.setItemToEdit(itemTitle);
    }

    onClickItemDeleteButton(itemTitle) {
      this.#view.showRemoveItemConfirmation(itemTitle);
    }

    onItemRemovalConfirmed(itemTitle) {
      this.aStorage.removeItem(itemTitle);
      this.#view.removeItem(itemTitle);
    }

    // MARK: - onClickClearAll

    onClickClearAll() {
      this.aStorage.clearItems();
      this.#view.onClickClearAll();
    }

    // MARK: - onEditingInput

    onEditingInput(e) {
      this.#view.onEditingInput(e);
    }

    // MARK: - onDOMContentLoad

    onDOMContentLoad() {
      const itemTitleList = this.aStorage.allItems;
      this.#view.onDOMContentLoad(itemTitleList);
    }
}

export class ShoppingListPage {
  #anItemForm;
  #aClearButton;
  #anItemFilter;
  #aFormButton;

  #refreshUICommand;

  #itemRemovalConfirmedHandler;
  #clickItemContentsHandler;
  #clickItemDeleteButtonHandler;
  #addItemSubmitHandler;
  #updateItemSubmitHandler;

  constructor() {
    this.anItemList = new elements.ItemElementList(document.getElementById('item-list'));
    this.#anItemForm = new elements.ItemForm(document.getElementById('item-form'));
    this.#aClearButton = new elements.ClearButton(document.getElementById('clear'));
    this.#anItemFilter = new elements.ItemFilter(document.getElementById('filter'));
    this.anItemInput = new elements.ItemInput(document.getElementById('item-input'));
    this.#aFormButton = new elements.FormButton(this.#anItemForm.formButton);
    
    this.#refreshUICommand = new commands.refreshUICommand(this.anItemInput, this.anItemList, this.#aFormButton, this.#aClearButton, this.#anItemFilter);
  }

  launchUI() {
    this.#anItemForm.addListener(this.#onAddOrUpdateItemSubmit.bind(this));
    this.anItemList.addListener(this.#onClickItem.bind(this));

    this.#refreshUICommand.execute();
  }

  bindAddItemSubmitHandler(handler) {
    this.#addItemSubmitHandler = handler;
  }

  bindUpdateItemSubmitHandler(handler) {
    this.#updateItemSubmitHandler = handler;
  }

  bindClearAll(handler) {
    this.#aClearButton.addListener(handler);
  }

  bindClickItemContents(handler) {
    this.#clickItemContentsHandler = handler;
  }

  bindClickItemDeleteButton(handler) {
    this.#clickItemDeleteButtonHandler = handler;
  }

  bindEditingInput(handler) {
    this.#anItemFilter.addListener(handler);
  }

  bindDOMContentLoaded(handler) {
    document.addEventListener('DOMContentLoaded', handler);
  }

  bindItemRemovalConfirmed(handler) {
    this.#itemRemovalConfirmedHandler = handler;
  }
  
  // MARK: - onAddOrUpdateItemSubmit

  #onAddOrUpdateItemSubmit(e) {
    e.preventDefault();
    const newItem = this.anItemInput.uniqueValue;
    if (this.#aFormButton.isEditMode) {
      const editingItem = this.anItemList.editingItem;
      this.#updateItemSubmitHandler(editingItem.textContent, newItem);
    } else {
      this.#addItemSubmitHandler(newItem);
    }
  }

  replaceEditingItemWith(newItemTitle) {
    new commands.RemoveEditingItemCommand(this.anItemList).execute();
    new commands.AddItemCommand(this.anItemList).execute(newItemTitle);
    this.#refreshUICommand.execute();
  }

  addItemWith(newItemTitle) {
    new commands.AddItemCommand(this.anItemList).execute(newItemTitle);
    this.#refreshUICommand.execute();
  }

  alertAddAnItem() {
    alert('Please add an item');
  }

  alertIfItemExists(newItem) {
    alert(`The item "${newItem}" already exists!`);
  }

  // MARK: - onClickItem

  #onClickItem(itemClickSpot, itemElement) {
    if (itemClickSpot == elements.ITEM_CLICK_SPOT.DELETE_BUTTON) {
        this.#clickItemDeleteButtonHandler(itemElement.textContent);
    } else if (itemClickSpot == elements.ITEM_CLICK_SPOT.CONTENTS) {
        this.#clickItemContentsHandler(itemElement.textContent);
    }
  }

  removeItem(itemTitle) {
    console.log("removeItem");
    console.log(itemTitle);
    const item = this.anItemList.itemWith(itemTitle);
    new commands.RemoveItemCommand(this.anItemList).execute(item);
    this.#refreshUICommand.execute();
  }

  showRemoveItemConfirmation(itemTitle) {
    if(this.#confirmItemRemoval(itemTitle)) {
      this.#itemRemovalConfirmedHandler(itemTitle);
    }
  }

  #confirmItemRemoval(textContent) {
    return confirm(`Are you sure you want to remove the item "${textContent}"?`)
  }

  setItemToEdit(itemTitle) {
    const item = this.anItemList.itemWith(itemTitle);
    new commands.SetItemToEditCommand(this.anItemList, this.#aFormButton, this.anItemInput).execute(item);
  }

  // MARK: - onClickClearAll

  onClickClearAll() {
    new commands.ClearAllCommand(this.anItemList).execute();
    this.#refreshUICommand.execute();
  }

  // MARK: - onEditingInput

  onEditingInput(e) {
    new commands.FilterItemsCommand(this.anItemList).execute(e.target.value);
  }

  // MARK: - onDOMContentLoad

  onDOMContentLoad(itemTitleList) {
    new commands.DisplayAllItemsCommand(this.anItemList).execute(itemTitleList);
    this.#refreshUICommand.execute();
  }
}

export const controller = new ShoppingListPageController(
  new ShoppingListPage(),
  new storage.Storage('items')
);

// MARK: - 함수 실행문

controller.launchUI();
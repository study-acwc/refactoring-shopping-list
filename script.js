import * as storage from './storage.js';
import * as elements from './elements.js';
import * as commands from './commands.js';

export class ShoppingListPagePresenter {
    #view;
    #aStorage;

    constructor(view, aStorage) {
        this.#view = view;
        this.#aStorage = aStorage;
    }

    launchUI() {
        this.#view.launchUI();
    }

    // MARK: - onAddItemSubmit

    onUpdateItemSubmit(editedItemTitle, newItemTitle) {
      if (false == this.#isValid(newItemTitle)) {
        this.#view.alertAddAnItem();
        return;
      }
      this.#aStorage.removeItem(editedItemTitle);
      this.#aStorage.addItem(newItemTitle);
      this.#view.replaceEditingItemWith(newItemTitle);
    }

    onAddItemSubmit(newItemTitle) {
      if (false == this.#isValid(newItemTitle)) {
        this.#view.alertAddAnItem();
        return;
      }
      if (this.#aStorage.hasItem(newItemTitle)) {
        this.#view.alertIfItemExists(newItemTitle);
        return;
      }
      this.#aStorage.addItem(newItemTitle);
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
      this.#aStorage.removeItem(itemTitle);
      this.#view.removeItem(itemTitle);
    }

    // MARK: - onClickClearAll

    onClickClearAll() {
      this.#aStorage.clearItems();
      this.#view.onClickClearAll();
    }

    // MARK: - onEditingInput

    onEditingInput(e) {
      this.#view.onEditingInput(e);
    }

    // MARK: - onDOMContentLoad

    onDOMContentLoad() {
      const itemTitleList = this.#aStorage.allItems;
      this.#view.onDOMContentLoad(itemTitleList);
    }
}

export class ShoppingListPage {
  #controller;

  #anItemForm;
  #aClearButton;
  #anItemFilter;
  #anItemInput;
  #aFormButton;

  #refreshUICommand;

  constructor(controller) {
    this.#controller = controller;

    this.anItemList = new elements.ItemElementList(document.getElementById('item-list'));
    this.#anItemForm = new elements.ItemForm(document.getElementById('item-form'));
    this.#aClearButton = new elements.ClearButton(document.getElementById('clear'));
    this.#anItemFilter = new elements.ItemFilter(document.getElementById('filter'));
    this.#anItemInput = new elements.ItemInput(document.getElementById('item-input'));
    this.#aFormButton = new elements.FormButton(this.#anItemForm.formButton);
    
    this.#refreshUICommand = new commands.refreshUICommand(this.#anItemInput, this.anItemList, this.#aFormButton, this.#aClearButton, this.#anItemFilter);
  }

  setController(controller) {
    this.#controller = controller;
  }

  launchUI() {
    this.#registerEventListeners();
    this.#refreshUICommand.execute();
  }

  #registerEventListeners() {
    this.#anItemForm.addListener(this.#onAddOrUpdateItemSubmit.bind(this));
    this.anItemList.addListener(this.#onClickItem.bind(this));
    this.#aClearButton.addListener(this.#controller.onClickClearAll.bind(this.#controller));
    this.#anItemFilter.addListener(this.#controller.onEditingInput.bind(this.#controller));
    document.addEventListener('DOMContentLoaded', this.#controller.onDOMContentLoad.bind(this.#controller));
  }  
  
  // MARK: - onAddOrUpdateItemSubmit

  #onAddOrUpdateItemSubmit(e) {
    e.preventDefault();
    const newItem = this.#anItemInput.uniqueValue;
    if (this.#aFormButton.isEditMode) {
      const editingItem = this.anItemList.editingItem;
      this.#controller.onUpdateItemSubmit(editingItem.textContent, newItem);
    } else {
      this.#controller.onAddItemSubmit(newItem);
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
        this.#controller.onClickItemDeleteButton(itemElement.textContent);
    } else if (itemClickSpot == elements.ITEM_CLICK_SPOT.CONTENTS) {
        this.#controller.onClickItemContents(itemElement.textContent);
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
      this.#controller.onItemRemovalConfirmed(itemTitle);
    }
  }

  #confirmItemRemoval(textContent) {
    return confirm(`Are you sure you want to remove the item "${textContent}"?`)
  }

  setItemToEdit(itemTitle) {
    const item = this.anItemList.itemWith(itemTitle);
    new commands.SetItemToEditCommand(this.anItemList, this.#aFormButton, this.#anItemInput).execute(item);
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


let presenter;

function launchApp() {
  const view = new ShoppingListPage();
  presenter = new ShoppingListPagePresenter(
    view,
    new storage.Storage('items')
  );
  view.setController(presenter);
  presenter.launchUI();
}


// MARK: - 함수 실행문

launchApp();

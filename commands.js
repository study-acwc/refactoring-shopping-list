export class ClearAllCommand {
    #anItemList;
    #aStorage;

    constructor(anItemList, aStorage) {
        this.#anItemList = anItemList;
        this.#aStorage = aStorage;
    }

    execute() {
        this.#anItemList.clearItems();
        this.#aStorage.clearItems();
    }
}

export class FilterItemsCommand {
    #anItemList;

    constructor(anItemList) {
        this.#anItemList = anItemList;
    }

    execute(itemTitle) {
        this.#anItemList.filterItemsWith(itemTitle.toLowerCase());
    }
}

export class refreshUICommand {
    #anItemInput;
    #anItemList;
    #aFormButton;
    #aClearButton;
    #anItemFilter;

    constructor(anItemInput, anItemList, aFormButton, aClearButton, anItemFilter) {
        this.#anItemList = anItemList;
        this._anItemInput = anItemInput;
        this._aFormButton = aFormButton;
        this._aClearButton = aClearButton;
        this._anItemFilter = anItemFilter;
    }

    execute() {
        this._anItemInput.clearValue();

        if (this.#anItemList.isItemListEmptyInDOM()) {
          this.#hideListControls()
        } else {
          this.#showListControls()
        }
        this._aFormButton.applyAddModeStyle();
    }

    #hideListControls() {
        this._aClearButton.hide();
        this._anItemFilter.hide();
    }
      
    #showListControls() {
        this._aClearButton.show();
        this._anItemFilter.show();
    }
}

export class RemoveItemCommand {
    #anItemList;
    #aStorage;
    
    constructor(anItemList, aStorage) {
        this.#anItemList = anItemList;
        this.#aStorage = aStorage;
    }

    execute(item) {
        if (false == this.#confirmItemRemoval(item.textContent)) {
            return;
        }
        this.#anItemList.removeItem(item);
        this.#aStorage.removeItem(item.textContent);
    }

    #confirmItemRemoval(textContent) {
        return confirm(`Are you sure you want to remove the item "${textContent}"?`)
    }
}

export class SetItemToEditCommand {
    #anItemList;
    #aFormButton;
    #anItemInput;

    constructor(anItemList, aFormButton, anItemInput) {
        this.#anItemList = anItemList;
        this._anItemInput = anItemInput;
        this._aFormButton = aFormButton;
    }

    execute(item) {
        this.#anItemList.toggleEditModeForSingleItem(item);
        this._aFormButton.applyEditModeStyle();
        this._anItemInput.updateValue(item.textContent);
    }
}

export class AddItemCommand {
    #anItemList;
    #aStorage;

    constructor(anItemList, aStorage) {
        this.#anItemList = anItemList;
        this.#aStorage = aStorage;
    }

    execute(newItem) {
        this.#anItemList.appendItemWith(newItem);
        this.#aStorage.addItem(newItem);
    }
}

export class RemoveEditingItemCommand {
    #anItemList;
    #aStorage;

    constructor(anItemList, aStorage) {
        this.#anItemList = anItemList;
        this.#aStorage = aStorage;
    }

    execute() {
        const item = this.#anItemList.editingItem;
        this.#aStorage.removeItem(item.textContent);
        this.#anItemList.disableEditModeClassFor(item);
        this.#anItemList.removeItem(item);
    }
}
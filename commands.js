export class ClearAllCommand {
    constructor(anItemList, aStorage) {
        this._anItemList = anItemList;
        this._aStorage = aStorage;
    }

    execute() {
        this._anItemList.clearItems();
        this._aStorage.clearItems();
    }
}

export class FilterItemsCommand {
    constructor(anItemList) {
        this._anItemList = anItemList;
    }

    execute(itemTitle) {
        this._anItemList.filterItemsWith(itemTitle.toLowerCase());
    }
}

export class DisplayAllItemsCommand {
    constructor(anItemList, aStorage) {
        this._anItemList = anItemList;
        this._aStorage = aStorage;
    }
    
    execute() {
        this._aStorage.allItems
            .forEach((item) => this._anItemList.appendItemWith(item));
    }
}

export class refreshUICommand {
    constructor(anItemInput, anItemList, aFormButton, aClearButton, anItemFilter) {
        this._anItemList = anItemList;
        this._anItemInput = anItemInput;
        this._aFormButton = aFormButton;
        this._aClearButton = aClearButton;
        this._anItemFilter = anItemFilter;
    }

    execute() {
        this._anItemInput.clearValue();

        if (this._anItemList.isItemListEmptyInDOM()) {
          this.hideListControls()
        } else {
          this.showListControls()
        }
        this._aFormButton.applyAddModeStyle();
    }

    hideListControls() {
        this._aClearButton.hide();
        this._anItemFilter.hide();
    }
      
    showListControls() {
        this._aClearButton.show();
        this._anItemFilter.show();
    }
}

export class RemoveItemCommand {
    constructor(anItemList, aStorage) {
        this._anItemList = anItemList;
        this._aStorage = aStorage;
    }

    execute(item) {
        if (false == this.confirmItemRemoval(item.textContent)) {
            return;
        }
        this._anItemList.removeItem(item);
        this._aStorage.removeItem(item.textContent);
    }

    confirmItemRemoval(textContent) {
        return confirm(`Are you sure you want to remove the item "${textContent}"?`)
    }
}

export class SetItemToEditCommand {
    constructor(anItemList, aFormButton, anItemInput) {
        this._anItemList = anItemList;
        this._anItemInput = anItemInput;
        this._aFormButton = aFormButton;
    }

    execute(item) {
        this._anItemList.toggleEditModeForSingleItem(item);
        this._aFormButton.applyEditModeStyle();
        this._anItemInput.updateValue(item.textContent);
    }
}

export class AddItemCommand {
    constructor(anItemList, aStorage) {
        this._anItemList = anItemList;
        this._aStorage = aStorage;
    }

    execute(newItem) {
        this._anItemList.appendItemWith(newItem);
        this._aStorage.addItem(newItem);
    }
}

export class RemoveEditingItemCommand {
    constructor(anItemList, aStorage) {
        this._anItemList = anItemList;
        this._aStorage = aStorage;
    }

    execute() {
        const item = this._anItemList.editingItem;
        this._aStorage.removeItem(item.textContent);
        this._anItemList.disableEditModeClassFor(item);
        this._anItemList.removeItem(item);
    }
}
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
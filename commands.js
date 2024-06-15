
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
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
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
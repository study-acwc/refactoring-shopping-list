export class Storage {
    constructor(key) {
        this._storage = localStorage;
        this._key = key;
    }

    clearItems() {
        this._storage.removeItem(this._key);
    }

    get allItems() {
        const itemsJsonString = this._storage.getItem(this._key);
        return itemsJsonString === null ? [] : JSON.parse(itemsJsonString);
    }
    
    saveAllItems(newItems) {
        this._storage.setItem(this._key, JSON.stringify(newItems));
    }

    hasItem(item) {
        return this.allItems.includes(item);
    }
 }
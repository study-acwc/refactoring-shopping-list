export class Storage {
    constructor(key) {
        this._storage = localStorage;
        this._key = key;
    }

    clearItems() {
        this._storage.removeItem(this._key);
    }

    get allItems() {
        return this._storage.getItem(this._key);
    }
    
    saveAllItems(newItems) {
        this._storage.setItem(this._key, JSON.stringify(newItems));
    }
 }
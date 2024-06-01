export class Storage {
    constructor(key) {
        this._storage = localStorage;
        this._key = key;
    }
    
    get allItems() {
        const itemsJsonString = this._storage.getItem(this._key);
        return itemsJsonString === null ? [] : JSON.parse(itemsJsonString);
    }

    clearItems() {
        this._storage.removeItem(this._key);
    }
    
    saveAllItems(newItems) {
        this._storage.setItem(this._key, JSON.stringify(newItems));
    }

    addItem(item) {
        const itemsFromStorage = this.allItems;
        itemsFromStorage.push(item);
        this.saveAllItems(itemsFromStorage);
    }

    removeItem(item) {
        const filteredOutItems = this.allItems.filter((i) => i !== item);
        this.saveAllItems(filteredOutItems);
    }

    hasItem(item) {
        return this.allItems.includes(item);
    }
 }
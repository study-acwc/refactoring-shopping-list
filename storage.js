export class Storage {
    #storage;
    #key;

    constructor(key) {
        this.#storage = localStorage;
        this.#key = key;
    }

    get allItems() {
        const itemsJsonString = this.#storage.getItem(this.#key);
        return itemsJsonString === null ? [] : JSON.parse(itemsJsonString);
    }

    clearItems() {
        this.#storage.removeItem(this.#key);
    }
    
    saveAllItems(newItems) {
        this.#storage.setItem(this.#key, JSON.stringify(newItems));
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
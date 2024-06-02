import Storage from "./storage.js";
import UI from "./ui.js";

export default class Item {
  static getNewItem() {
    const itemInput = document.getElementById("item-input");
    return itemInput.value.trim();
  }
  static confirmRemoveItem(item) {
    return confirm(
      `Are you sure you want to remove the item "${item.textContent}"?`,
    );
  }
  static isItemEmpty(item) {
    return item === "";
  }
  static isItemMatch(item, text) {
    return item.indexOf(text) != -1;
  }
  static createNewItem(item) {
    const itemInput = document.getElementById("item-input");
    UI.addItemToDOM(item);
    Storage.addItem(item);
    UI.checkUI();
    itemInput.value = "";
  }
  static removeEditItem(item) {
    Storage.removeItem(item.textContent);
    UI.removeItemUI(item);
  }
  static containRemoveItem(event) {
    return event.target.parentElement.classList.contains("remove-item");
  }
  static isItemExists(item) {
    const itemsFromStorage = Storage.getItems();
    return itemsFromStorage.includes(item);
  }
  static removeItem(item) {
    //[10-3] Gaurd Clause
    if (!this.confirmRemoveItem(item)) {
      return;
    }
    // Remove item from DOM
    UI.removeItemFromDom(item);
    // Remove item from storage
    Storage.removeItem(item.textContent);
    UI.checkUI();
  }
}

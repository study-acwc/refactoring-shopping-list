import Storage from "../Storage/Storage.js";
import UI from "../UI/UI.js";

export default class Item {
  constructor(name) {
    this.name = name;
  }

  static add(item) {
    UI.addItemToDOM(item);
    Storage.addItem(item);
    UI.checkUI();
  }

  static remove(itemElement) {
    Storage.removeItem(itemElement.textContent);
    itemElement.remove();
    UI.checkUI();
  }
  static edit(itemElement) {
    UI.setItemToEdit(itemElement);
  }
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
    UI.addItemToDOM(item);
    Storage.addItem(item);
    UI.checkUI();
    const itemInput = document.getElementById("item-input");
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

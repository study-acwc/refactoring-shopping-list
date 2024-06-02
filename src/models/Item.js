import Storage from "../storage/Storage.js";
import UI from "../ui/UI.js";

export default class Item {
  static getInput() {
    return UI.itemInput.value.trim();
  }

  static add(item) {
    UI.addItemToDOM(item);
    Storage.addItem(item);
    UI.checkUI();
  }

  static remove(item) {
    if (!this.confirmRemoveItem(item)) {
      return;
    }
    UI.removeItemFromDom(item);
    Storage.removeItem(item.textContent);
    UI.checkUI();
  }
  static removeEditItem(item) {
    UI.removeItemUI(item);
    Storage.removeItem(item.textContent);
  }

  static edit(itemElement) {
    UI.setItemToEdit(itemElement);
  }

  static create(item) {
    this.add(item);
    const itemInput = document.getElementById("item-input");
    itemInput.value = "";
  }

  static isEmpty(item) {
    return item === "";
  }

  static isExists(item) {
    const itemsFromStorage = Storage.getItems();
    return itemsFromStorage.includes(item);
  }

  static isMatch(item, text) {
    return item.indexOf(text) != -1;
  }

  static confirmRemoveItem(item) {
    return confirm(
      `Are you sure you want to remove the item "${item.textContent}"?`,
    );
  }

  static containRemoveItem(event) {
    return event.target.parentElement.classList.contains("remove-item");
  }
}

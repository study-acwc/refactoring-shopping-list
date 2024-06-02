import Item from "../models/Item.js";
import UI from "../ui/UI.js";
import Storage from "../storage/Storage.js";

export default class EventHandler {
  static handleDisplayItems() {
    const itemsFromStorage = Storage.getItems();
    itemsFromStorage.forEach((item) => UI.addItemToDOM(item));
    UI.checkUI();
  }

  static handleAddItemSubmit(event) {
    event.preventDefault();
    const item = Item.getInput();
    const itemList = document.querySelector("#item-list");

    if (Item.isEmpty(item)) {
      alert("Please add an item");
      return;
    }
    if (UI.isEditMode) {
      Item.removeEditItem(itemList.querySelector(".edit-mode"));
    }

    if (Item.isExists(item)) {
      alert(`The item "${item}" already exists!`);
      return;
    }

    Item.create(item);
  }
  static handleClickItem(event) {
    if (Item.containRemoveItem(event)) {
      Item.remove(event.target.parentElement.parentElement);
    } else if (UI.isListItem(event)) {
      Item.edit(event.target);
    }
  }
  static handleClearItems() {
    UI.clearAllItemsFromDOM();
    Storage.clearItems();
    UI.checkUI();
  }
  static handleFilterItems(event) {
    const itemList = document.querySelector("#item-list");
    const items = itemList.querySelectorAll("li");
    const text = event.target.value.toLowerCase();

    items.forEach((item) => {
      const itemName = item.firstChild.textContent.toLowerCase();
      const shouldDisplay = Item.isMatch(itemName, text);
      item.style.display = shouldDisplay ? "flex" : "none";
    });
  }
}

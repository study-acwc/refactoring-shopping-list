import Item from "../Item/Item.js";
import UI from "../UI/UI.js";
import Storage from "../Storage/Storage.js";

export default class EventHandler {
  static handleDisplayItems() {
    const itemsFromStorage = Storage.getItems();
    itemsFromStorage.forEach((item) => UI.addItemToDOM(item));
    UI.checkUI();
  }

  static handleAddItemSubmit(event) {
    event.preventDefault();
    const item = Item.getNewItem();
    const itemList = document.querySelector("#item-list");

    // Validate Input
    //[10-3] Gaurd Clause
    if (Item.isItemEmpty(item)) {
      alert("Please add an item");
      return;
    }
    // Check for edit mode
    if (UI.isEditMode) {
      Item.removeEditItem(itemList.querySelector(".edit-mode"));
    }

    //Validate if item already exists
    //[10-3] Gaurd Clause
    if (Item.isItemExists(item)) {
      alert(`The item "${item}" already exists!`);
      return;
    }

    Item.createNewItem(item);
  }
  static handleClickItem(event) {
    //[10-3] 참과 거짓 경로 모두 정상 동작
    if (Item.containRemoveItem(event)) {
      Item.removeItem(event.target.parentElement.parentElement);
    } else if (UI.isListItem(event)) {
      UI.setItemToEdit(event.target);
    }
  }
  static handleClearItems() {
    UI.clearAllItemsFromDOM();
    localStorage.removeItem("items");

    UI.checkUI();
  }
  static handleFilterItems(event) {
    const itemList = document.querySelector("#item-list");
    const items = itemList.querySelectorAll("li");
    const text = event.target.value.toLowerCase();

    items.forEach((item) => {
      const itemName = item.firstChild.textContent.toLowerCase();
      const shouldDisplay = Item.isItemMatch(itemName, text);
      item.style.display = shouldDisplay ? "flex" : "none";
    });
  }
}

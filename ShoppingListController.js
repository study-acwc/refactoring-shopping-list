import LocalStorageController from "./LocalStorageController.js";
import { createElement, removeAllChildren } from "./UtilElement.js";
import { updateStyles } from "./UtilStyle.js";

export default class ShoppingListController {
  constructor() {
    this.itemForm = document.getElementById("item-form");
    this.itemInput = document.getElementById("item-input");
    this.itemList = document.getElementById("item-list");
    this.clearBtn = document.getElementById("clear");
    this.itemFilter = document.getElementById("filter");
    this.formBtn = this.itemForm.querySelector("button");
    this.isEditMode = false;
    this.storage = new LocalStorageController("items");
    this.init();
  }

  init() {
    this.itemForm.addEventListener("submit", this.onAddItemSubmit.bind(this));
    this.clearBtn.addEventListener("click", this.clearItems.bind(this));
    this.itemFilter.addEventListener("input", this.filterItems.bind(this));
    document.addEventListener("DOMContentLoaded", () => {
      const itemsFromStorage = this.getItemsFromStorage();
      itemsFromStorage.forEach(this.addDom.bind(this));
      this.initInputEditMode();
    });
  }

  onAddItemSubmit(e) {
    e.preventDefault();

    const content = this.itemInput.value.trim();
    const invalidMessage = this.hasInValidMessage(content);

    if (invalidMessage) {
      alert(invalidMessage);
      return;
    }

    this.isEditMode ? this.updateItem(content) : this.addItem(content);
  }

  addItem(content) {
    this.addDom(content);
    this.addStorage(content);
    this.initInputEditMode();
  }

  updateItem(content) {
    const itemToEdit = this.itemList.querySelector(".edit-mode");
    this.removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.remove();
    this.addItem(content);
  }

  hasInValidMessage(content) {
    if (!content) {
      return "Please add an item";
    }

    const isExistItem = this.getItemsFromStorage().includes(content);

    if (!this.isEditMode && isExistItem) {
      return `The item "${content}" already exists!`;
    }
  }

  onClickListItem(e) {
    const targetItem = e.target;
    this.isEditMode = true;

    [...this.itemList.children].forEach((i) => i.classList.remove("edit-mode"));
    targetItem.classList.add("edit-mode");
    this.styleSubmitButton();
    this.itemInput.value = targetItem.textContent;
  }

  onClickRemoveItem(e) {
    e.stopPropagation();

    const targetItem = e.target.parentElement.parentElement;
    const targetContent = targetItem.textContent;
    if (
      confirm(`Are you sure you want to remove the item "${targetContent}"?`)
    ) {
      targetItem.remove();
      this.removeItemFromStorage(targetContent);
      this.initInputEditMode();
    }
  }

  addDom(item) {
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(item));

    const button = createElement("button", "remove-item btn-link text-red");
    const icon = createElement("i", "fa-solid fa-xmark");

    li.addEventListener("click", this.onClickListItem.bind(this));
    button.addEventListener("click", this.onClickRemoveItem.bind(this));

    button.appendChild(icon);
    li.appendChild(button);

    this.itemList.appendChild(li);
  }

  addStorage(item) {
    const itemsFromStorage = JSON.stringify([
      ...this.getItemsFromStorage(),
      item,
    ]);
    this.storage.setItem(itemsFromStorage);
  }

  getItemsFromStorage() {
    const itemsFromStorage = this.storage.getItem();
    return itemsFromStorage ? JSON.parse(itemsFromStorage) : [];
  }

  removeItemFromStorage(item) {
    const itemsFromStorage = this.getItemsFromStorage().filter(
      (i) => i !== item
    );
    this.storage.setItem(JSON.stringify(itemsFromStorage));
  }

  clearItems() {
    removeAllChildren(this.itemList);
    this.storage.removeItem();
    this.initInputEditMode();
  }

  filterItems(e) {
    const text = e.target.value.toLowerCase();

    [...this.itemList.children].forEach((element) => {
      const isIncludeText =
        element.firstChild.textContent.toLowerCase().indexOf(text) != -1;

      updateStyles(element, { display: isIncludeText ? "flex" : "none" });
    });
  }

  styleDisplayItems() {
    [this.clearBtn, this.itemFilter].forEach((element) =>
      updateStyles(element, {
        display: this.itemList.children.length === 0 ? "none" : "block",
      })
    );
  }

  styleSubmitButton() {
    this.formBtn.innerHTML = this.isEditMode
      ? '<i class="fa-solid fa-pen"></i>   Update Item'
      : '<i class="fa-solid fa-plus"></i> Add Item';

    updateStyles(this.formBtn, {
      backgroundColor: this.isEditMode ? "#228B22" : "#333",
    });
  }

  initInputEditMode() {
    this.itemInput.value = "";
    this.isEditMode = false;
    this.styleDisplayItems();
    this.styleSubmitButton();
  }
}

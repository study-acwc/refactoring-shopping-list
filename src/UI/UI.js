import EventHandler from "../event/EventHandler.js";

export default class UI {
  static init() {
    this.cacheDOM();
    this.addEventListeners();
    this.checkUI();
  }
  static cacheDOM() {
    this.isEditMode = false;
    this.itemList = document.querySelector("#item-list");
    this.form = document.querySelector("#item-form");
    this.clearBtn = document.querySelector("#clear");
    this.itemFilter = document.querySelector("#filter");
    this.itemInput = document.querySelector("#item-input");
  }
  static addEventListeners() {
    this.form.addEventListener("submit", EventHandler.handleAddItemSubmit);
    this.itemList.addEventListener("click", EventHandler.handleItemClick);
    this.clearBtn.addEventListener("click", EventHandler.handleClearItems);
    this.itemFilter.addEventListener("input", EventHandler.handleFilterItems);
  }

  static createButton(classes) {
    const button = document.createElement("button");
    button.className = classes;
    const icon = this.createIcon("fa-solid fa-xmark");
    button.appendChild(icon);
    return button;
  }
  static createIcon(classes) {
    const icon = document.createElement("i");
    icon.className = classes;
    return icon;
  }
  static addItemToDOM(item) {
    const li = document.createElement("li");

    li.appendChild(document.createTextNode(item));

    const button = this.createButton("remove-item btn-link text-red");
    li.appendChild(button);

    document.querySelector("#item-list").appendChild(li);
  }
  static setItemToEdit(item) {
    this.isEditMode = true;
    this.itemList
      .querySelectorAll("li")
      .forEach((i) => i.classList.remove("edit-mode"));

    item.classList.add("edit-mode");
    const itemForm = document.getElementById("item-form");
    const formBtn = itemForm.querySelector("button");
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item';
    formBtn.style.backgroundColor = "#228B22";
    document.getElementById("item-input").value = item.textContent;
  }
  static toggleVisibility(element) {
    const hasItems = this.itemList.querySelectorAll("li").length > 0;
    element.style.display = hasItems ? "block" : "none";
  }
  static resetFormButton() {
    const itemForm = document.getElementById("item-form");
    const formBtn = itemForm.querySelector("button");
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = "#333";
  }
  static clearInput() {
    this.itemInput.value = "";
  }
  static checkUI() {
    const clearBtn = document.getElementById("clear");
    const itemFilter = document.getElementById("filter");
    this.clearInput();
    this.toggleVisibility(clearBtn);
    this.toggleVisibility(itemFilter);
    this.resetFormButton();
    this.isEditMode = false;
  }
  static isListItem(event) {
    return event.target.closest("li");
  }
  static clearAllItemsFromDOM() {
    while (this.itemList.firstChild) {
      this.itemList.removeChild(this.itemList.firstChild);
    }
  }
  static removeItemFromDom(item) {
    item.remove();
  }
  static removeItemUI(item) {
    item.classList.remove("edit-mode");
    item.remove();
  }
}

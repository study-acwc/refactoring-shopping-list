export default class UI {
  constructor() {
    this.isEditMode = false;
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
    const itemList = document.querySelector("#item-list");

    li.appendChild(document.createTextNode(item));

    const button = this.createButton("remove-item btn-link text-red");
    li.appendChild(button);

    itemList.appendChild(li);
  }
  static setItemToEdit(item) {
    this.isEditMode = true;
    const itemList = document.querySelector("#item-list");
    itemList
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
    const itemList = document.querySelector("#item-list");
    const hasItems = itemList.querySelectorAll("li").length > 0;
    element.style.display = hasItems ? "block" : "none";
  }
  static resetFormButton() {
    const itemForm = document.getElementById("item-form");
    const formBtn = itemForm.querySelector("button");
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = "#333";
  }
  static clearInput() {
    const itemInput = document.getElementById("item-input");
    itemInput.value = "";
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
    const itemList = document.querySelector("#item-list");
    while (itemList.firstChild) {
      itemList.removeChild(itemList.firstChild);
    }
  }
}

export default class Storage {
  static getItems() {
    return this.itemExist() ? [] : JSON.parse(localStorage.getItem("items"));
  }
  static itemExist() {
    return localStorage.getItem("items") === null;
  }
  static removeItem(item) {
    let items = this.getItems().filter((i) => i !== item);
    localStorage.setItem("items", JSON.stringify(items));
  }
  static addItem(item) {
    let items = this.getItems();
    items.push(item);
    localStorage.setItem("items", JSON.stringify(items));
  }
}

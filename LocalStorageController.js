export default class LocalStorageController {
  constructor(key) {
    this.key = key;
  }
  setItem(storageValue) {
    localStorage.setItem(this.key, storageValue);
  }

  getItem() {
    return localStorage.getItem(this.key) ?? null;
  }

  removeItem() {
    localStorage.removeItem(this.key);
  }
}

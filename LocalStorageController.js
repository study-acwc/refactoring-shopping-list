const LOCAL_STORAGE_KEY = "items";

export default class LocalStorageController {
  static setItem(storageValue) {
    localStorage.setItem(LOCAL_STORAGE_KEY, storageValue);
  }

  static getItem() {
    return localStorage.getItem(LOCAL_STORAGE_KEY) ?? null;
  }
}

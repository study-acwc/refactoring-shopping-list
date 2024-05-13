import { removeItem, checkUI, setItemToEdit } from "./script";

export function onClickItem(e) {
    if (e.target.parentElement.classList.contains("remove-item")) {
      removeItem(e.target.parentElement.parentElement);
      checkUI();
    } else if (e.target.closest("li")) {
      setItemToEdit(e.target);
    }
  }
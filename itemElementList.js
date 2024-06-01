export class ItemElementList {
    constructor(list) {
        this._list = list;
        this.LI_ELEMENT = 'li';
        this.CSSDisplay = {
            NONE: 'none',
            BLOCK: 'block',
            FLEX: 'flex'
        }
        this.EDITMODE_ELEMENT_CLASS = 'edit-mode';
    }

    get editingItem() {
        return this._list.querySelector('.edit-mode');
    }

    get allItems() {
        return this._list.querySelectorAll(this.LI_ELEMENT);
    }

    appendItem(element) {
        this._list.appendChild(element)
    }

    clearItems() {
        while (this._list.firstChild) {
          this._list.removeChild(this._list.firstChild);
        }
    }

    isItemListEmptyInDOM () {
        return this.allItems.length === 0
    }

    filterItems(keyword) {
        this.allItems.forEach((item) => {
            const itemName = item.firstChild.textContent.toLowerCase();
            item.style.display = itemName.indexOf(keyword) != -1 ? this.CSSDisplay.FLEX : this.CSSDisplay.NONE;
        });
    }

    toggleEditModeForSingleItem(item) {
        this.allItems
            .forEach((i) => this.disableEditModeClassFor(i));
        item.classList.add(this.EDITMODE_ELEMENT_CLASS);
    }

    disableEditModeClassFor(item) {
        item.classList.remove(this.EDITMODE_ELEMENT_CLASS);
    }
}
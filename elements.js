const CSSDisplay = {
    NONE: 'none',
    BLOCK: 'block',
    FLEX: 'flex'
};

export class ItemElementList {
    constructor(list) {
        this._list = list;
        this.LI_ELEMENT = 'li';
        this.CSSDisplay = {
            NONE: 'none',
            BLOCK: 'block',
            FLEX: 'flex'
        };
        this.EDITMODE_ELEMENT_CLASS = 'edit-mode';
        this.LI_ELEMENT = 'li';
        this.BUTTON_ELEMENT = 'button';
    }

    get editingItem() {
        return this._list.querySelector('.edit-mode');
    }

    get allItems() {
        return this._list.querySelectorAll(this.LI_ELEMENT);
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

    removeItem(item) {
        item.remove();
    }

    appendItemWith(itemTitle) {
        const li = this.listItem(itemTitle)
        this.appendItem(li);
    }

    appendItem(element) {
        this._list.appendChild(element)
    }
      
    listItem(item) {
        const li = document.createElement(this.LI_ELEMENT);
        li.appendChild(document.createTextNode(item));
        
        const button = this.buttonWithClasses('remove-item btn-link text-red');
        li.appendChild(button);
        
        return li;
    }
      
    buttonWithClasses(classes) {
        const button = document.createElement(this.BUTTON_ELEMENT);
        button.className = classes;
        const icon = this.iconWithClasses('fa-solid fa-xmark');
        button.appendChild(icon);
        return button;
    }
      
    iconWithClasses(classes) {
        const icon = document.createElement('i');
        icon.className = classes;
        return icon;
    }
}

export class ClearButton {
  constructor(element) {
      this._element = element;
  }

  // only for unit tesing
  get isHidden() {
    return this._element.style.display == CSSDisplay.NONE;
  }

  // only for unit tesing
  get isDisplayed() {
    return this._element.style.display == CSSDisplay.BLOCK;
  }

  hide() {
    this._element.style.display = CSSDisplay.NONE;
  }

  show() {
    this._element.style.display = CSSDisplay.BLOCK;
  }
}
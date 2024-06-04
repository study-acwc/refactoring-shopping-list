export const CSSDisplay = {
    NONE: 'none',
    BLOCK: 'block',
    FLEX: 'flex'
};

const BUTTON_ELEMENT = 'button';

export class ItemElementList {
    #list;

    constructor(list) {
        this.#list = list;
        this.LI_ELEMENT = 'li';
        this.EDITMODE_ELEMENT_CLASS = 'edit-mode';
        this.LI_ELEMENT = 'li';
        this.BUTTON_ELEMENT = 'button';
    }

    get editingItem() {
        return this.#list.querySelector('.edit-mode');
    }

    get allItems() {
        return this.#list.querySelectorAll(this.LI_ELEMENT);
    }

    clearItems() {
        while (this.#list.firstChild) {
          this.#list.removeChild(this.#list.firstChild);
        }
    }

    isItemListEmptyInDOM() {
        return this.allItems.length === 0
    }

    filterItemsWith(keyword) {
        this.allItems.forEach((item) => {
            const itemName = item.firstChild.textContent.toLowerCase();
            item.style.display = itemName.indexOf(keyword) != -1 ? CSSDisplay.FLEX : CSSDisplay.NONE;
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
        const li = this.#listItem(itemTitle)
        this.#appendItem(li);
    }

    #appendItem(element) {
        this.#list.appendChild(element)
    }
      
    #listItem(item) {
        const li = document.createElement(this.LI_ELEMENT);
        li.appendChild(document.createTextNode(item));
        
        const button = this.#buttonWithClasses('remove-item btn-link text-red');
        li.appendChild(button);
        
        return li;
    }
      
    #buttonWithClasses(classes) {
        const button = document.createElement(this.BUTTON_ELEMENT);
        button.className = classes;
        const icon = this.#iconWithClasses('fa-solid fa-xmark');
        button.appendChild(icon);
        return button;
    }
      
    #iconWithClasses(classes) {
        const icon = document.createElement('i');
        icon.className = classes;
        return icon;
    }

    addListener(listener) {
        this.#list.addEventListener('click', listener);
    }
}

export class ClearButton {
  #element;

  constructor(element) {
      this.#element = element;
  }

  hide() {
    this.#element.style.display = CSSDisplay.NONE;
  }

  show() {
    this.#element.style.display = CSSDisplay.BLOCK;
  }

  addListener(listener) {
    this.#element.addEventListener('click', listener);
  }
}

export class ItemFilter {
    #element;

    constructor(element) {
        this.#element = element;
    }

    hide() {
        this.#element.style.display = CSSDisplay.NONE;
    }

    show() {
        this.#element.style.display = CSSDisplay.BLOCK;
    }

    addListener(listener) {
        this.#element.addEventListener('input', listener);
    }
}

export class ItemInput {
    #element;

    constructor(element) {
        this.#element = element;
    }

    get uniqueValue() {
        return this.#element.value.trim()
    }

    get hasValidValue() {
        return this.#element.value != ''
    }

    updateValue(newValue) {
        this.#element.value = newValue;
    }

    clearValue() {
        this.#element.value = '';
    }
}

export class FormButton {
    #element;
    #isEditMode;

    constructor(element) {
        this.#element = element;
        this._isEditMode = false;
    }

    get isEditMode() {
        return this._isEditMode;
    }

    applyEditModeStyle() {
        this.#element.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item';
        this.#element.style.backgroundColor = '#228B22';
        this._isEditMode = true;
    }

    applyAddModeStyle() {
        this.#element.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
        this.#element.style.backgroundColor = '#333';
        this._isEditMode = false;
    }
}

export class ItemForm {
    #element;

    constructor(element) {
        this.#element = element;
    }

    get formButton() {
        return this.#element.querySelector(BUTTON_ELEMENT);
    }

    addListener(listener) {
        this.#element.addEventListener('submit', listener);
    }
}
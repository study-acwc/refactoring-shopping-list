import { TODO } from '../constant/index.js'
import { $, updateUI, $all } from '../helper/dom.js'
import { removeFromStorage } from '../helper/util.js'
import { editState } from '../store/index.js'
import { Template } from './Template.js'

export default class Bottom extends Template {
	constructor() {
		super()
		const rootNode = $('#bottom-section')
		rootNode.insertAdjacentHTML('afterbegin', this.template())
		this.bindEvents()
	}
	bindEvents() {
		const itemFilter = $('#filter')
		const itemList = $('#item-list')
		const clearBtn = $('#clear')

		this.clearItems = this.clearItems.bind(this)
		this.onClickItem = this.onClickItem.bind(this)
		this.setItemToEdit = this.setItemToEdit.bind(this)
		this.removeItem = this.removeItem.bind(this)
		this.filterItems = this.filterItems.bind(this)

		itemFilter.addEventListener('input', this.filterItems)
		itemList.addEventListener('click', this.onClickItem)
		clearBtn.addEventListener('click', this.clearItems)
	}

	clearItems() {
		const itemInput = $('#item-input')
		const formBtn = $('#form-btn')
		const itemList = $('#item-list')
		const clearBtn = $('#clear')
		const itemFilter = $('#filter')

		while (itemList.firstChild) {
			itemList.removeChild(itemList.firstChild)
		}

		Storage.removeItem(TODO.STORAGE_KEY)

		updateUI(clearBtn, itemFilter, formBtn, itemInput)
	}

	onClickItem(e) {
		if (e.target.parentElement.classList.contains('remove-item')) {
			this.removeItem(e.target.parentElement.parentElement)
		} else if (e.target.closest('li')) {
			this.setItemToEdit(e.target)
		}
	}

	setItemToEdit(item) {
		const itemList = $('#item-list')
		const formBtn = $('#form-btn')
		const itemInput = $('#item-input')

		editState.on()
		itemList
			.querySelectorAll('li')
			.forEach((i) => i.classList.remove('edit-mode'))

		item.classList.add('edit-mode')
		formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item'
		formBtn.style.backgroundColor = '#228B22'
		itemInput.value = item.textContent
	}

	removeItem(item) {
		const itemInput = $('#item-input')
		const formBtn = $('#form-btn')
		const clearBtn = $('#clear')
		const itemFilter = $('#filter')

		if (
			confirm(`Are you sure you want to remove the item "${item.textContent}"?`)
		) {
			item.remove()
			removeFromStorage(item.textContent)
			updateUI(clearBtn, itemFilter, formBtn, itemInput)
		}
	}

	filterItems(e) {
		const items = $all('li')
		const text = e.target.value.toLowerCase()

		items.forEach((item) => {
			const itemName = item.firstChild.textContent.toLowerCase()

			if (itemName.indexOf(text) != -1) {
				item.style.display = 'flex'
			} else {
				item.style.display = 'none'
			}
		})
	}

	template() {
		return `
			<div class="filter">
				<input
					type="text"
					class="form-input-filter"
					id="filter"
					placeholder="Filter Items"
				/>
			</div>
			<ul id="item-list" class="items">
			</ul>
			<button id="clear" class="btn-clear">Clear All</button>
    `
	}
}

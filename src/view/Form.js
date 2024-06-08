import { TODO } from '../constant/index.js'
import { $, $all, addItemToDOM, updateUI } from '../helper/dom.js'
import { removeFromStorage, Storage, isItemExists } from '../helper/util.js'
import { editState } from '../store/index.js'
import { Template } from './Template.js'

export default class Form extends Template {
	constructor() {
		super()
		const rootNode = $('#item-form')
		rootNode.insertAdjacentHTML('afterbegin', this.template())
		this.bindEvents()
	}

	bindEvents() {
		document.addEventListener('DOMContentLoaded', this.displayItems)
		const itemForm = $('#item-form')
		itemForm.addEventListener('submit', this.onAddItemSubmit)
	}

	onAddItemSubmit(e) {
		const itemInput = $('#item-input')
		const formBtn = $('#form-btn')
		const itemList = $('#item-list')
		const clearBtn = $('#clear')
		const itemFilter = $('#filter')

		e.preventDefault()

		const newItem = itemInput.value.trim()

		if (newItem === '') {
			alert('Please add an item')
			return
		}

		if (editState.get()) {
			const itemToEdit = $('.edit-mode')

			removeFromStorage(itemToEdit.textContent)
			itemToEdit.classList.remove('edit-mode')
			itemToEdit.remove()
			editState.toggle()
		} else {
			if (isItemExists(newItem)) {
				itemInput.value = ''
				alert(`The item "${newItem}" already exists!`)
				return
			}
		}

		addItemToDOM(newItem, itemList)
		Storage.updateItem(TODO.STORAGE_KEY, newItem)
		updateUI(clearBtn, itemFilter, formBtn, itemInput)
	}

	displayItems() {
		const itemInput = $('#item-input')
		const formBtn = $('#form-btn')
		const itemList = $('#item-list')
		const clearBtn = $('#clear')
		const itemFilter = $('#filter')

		Storage.getItem(TODO.STORAGE_KEY).forEach((item) =>
			addItemToDOM(item, itemList)
		)
		updateUI(clearBtn, itemFilter, formBtn, itemInput)
	}

	template() {
		return `
				<div class="form-control">
					<input
						type="text"
						class="form-input"
						id="item-input"
						name="item"
						placeholder="Enter Item"
					/>
				</div>
				<div class="form-control">
					<button type="submit" id="form-btn">
						<i class="fa-solid fa-plus"></i> Add Item
					</button>
				</div>
    `
	}
}

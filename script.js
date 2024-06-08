import { Storage } from './storage.js'
import { TODO } from './const.js'
import { $ } from './src/helper/util.js'

const itemForm = $('#item-form')
const itemInput = $('#item-input')
const itemList = $('#item-list')
const clearBtn = $('#clear')
const itemFilter = $('#filter')
const formBtn = itemForm.querySelector('button')

export let isEditMode = false

export function init() {
	initEvents()
}

function initEvents() {
	itemForm.addEventListener('submit', onAddItemSubmit)
	itemList.addEventListener('click', onClickItem)
	clearBtn.addEventListener('click', clearItems)
	itemFilter.addEventListener('input', filterItems)
	document.addEventListener('DOMContentLoaded', displayItems)
}

export function displayItems() {
	Storage.getItem(TODO.STORAGE_KEY).forEach((item) => addItemToDOM(item))
	checkUI()
}

export function onAddItemSubmit(e) {
	e.preventDefault()

	const newItem = itemInput.value.trim()

	if (newItem === '') {
		alert('Please add an item')
		return
	}

	if (isEditMode) {
		const itemToEdit = itemList.querySelector('.edit-mode')

		removeItemFromStorage(itemToEdit.textContent)
		itemToEdit.classList.remove('edit-mode')
		itemToEdit.remove()
		isEditMode = false
	} else {
		if (checkIfItemExists(newItem)) {
			alert(`The item "${newItem}" already exists!`)
			return
		}
	}

	// Create item DOM element
	addItemToDOM(newItem)

	Storage.updateItem(TODO.STORAGE_KEY, newItem)

	checkUI()

	itemInput.value = ''
}

export function addItemToDOM(item) {
	const li = document.createElement('li')
	li.appendChild(document.createTextNode(item))
	const button = createButton('remove-item btn-link text-red')
	li.appendChild(button)
	itemList.appendChild(li)
}

export function createButton(classes) {
	const button = document.createElement('button')
	button.className = classes
	const icon = createIcon('fa-solid fa-xmark')
	button.appendChild(icon)
	return button
}

export function createIcon(classes) {
	const icon = document.createElement('i')
	icon.className = classes
	return icon
}

export function onClickItem(e) {
	if (e.target.parentElement.classList.contains('remove-item')) {
		removeItem(e.target.parentElement.parentElement)
	} else if (e.target.closest('li')) {
		setItemToEdit(e.target)
	}
}

export function checkIfItemExists(item) {
	return Storage.getItem(TODO.STORAGE_KEY).includes(item)
}

export function setItemToEdit(item) {
	isEditMode = true

	itemList
		.querySelectorAll('li')
		.forEach((i) => i.classList.remove('edit-mode'))

	item.classList.add('edit-mode')
	formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item'
	formBtn.style.backgroundColor = '#228B22'
	itemInput.value = item.textContent
}

export function removeItem(item) {
	if (
		confirm(`Are you sure you want to remove the item "${item.textContent}"?`)
	) {
		// Remove item from DOM
		item.remove()

		// Remove item from storage
		removeItemFromStorage(item.textContent)

		checkUI()
	}
}

export function removeItemFromStorage(item) {
	const updated = Storage.getItem(TODO.STORAGE_KEY).filter((i) => i !== item)
	Storage.setItem(TODO.STORAGE_KEY, updated)
}

export function clearItems() {
	while (itemList.firstChild) {
		itemList.removeChild(itemList.firstChild)
	}

	Storage.removeItem(TODO.STORAGE_KEY)

	checkUI()
}

export function filterItems(e) {
	const items = itemList.querySelectorAll('li')
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

export function checkUI() {
	itemInput.value = ''

	const items = itemList.querySelectorAll('li')

	if (items.length === 0) {
		clearBtn.style.display = 'none'
		itemFilter.style.display = 'none'
	} else {
		clearBtn.style.display = 'block'
		itemFilter.style.display = 'block'
	}

	formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item'
	formBtn.style.backgroundColor = '#333'

	isEditMode = false
}
init()

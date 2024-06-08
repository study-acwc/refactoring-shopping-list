import { editState } from '../store/index.js'

export const $ = function (selector) {
	return document.querySelector(selector)
}

export const $all = function (selector) {
	return document.querySelectorAll(selector)
}

export function addItemToDOM(item, itemList) {
	const li = document.createElement('li')
	li.appendChild(document.createTextNode(item))
	const button = createButton('remove-item btn-link text-red')
	li.appendChild(button)
	itemList.appendChild(li)
}

function createButton(classes) {
	const button = document.createElement('button')
	button.className = classes
	const icon = createIcon('fa-solid fa-xmark')
	button.appendChild(icon)
	return button
}

function createIcon(classes) {
	const icon = document.createElement('i')
	icon.className = classes
	return icon
}

export function updateUI(clearBtn, itemFilter, formBtn, itemInput) {
	itemInput.value = ''

	const items = $all('li')

	if (items.length === 0) {
		clearBtn.style.display = 'none'
		itemFilter.style.display = 'none'
	} else {
		clearBtn.style.display = 'block'
		itemFilter.style.display = 'block'
	}

	formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item'
	formBtn.style.backgroundColor = '#333'

	editState.off()
}

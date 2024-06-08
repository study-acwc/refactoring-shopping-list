import { $, addItemToDOM, updateUI } from './helper/dom.js'
import { TODO } from './constant/index.js'
import { Storage } from './helper/util.js'
import Header from './view/Header.js'
import Form from './view/Form.js'
import Bottom from './view/Bottom.js'

//display items
document.addEventListener('DOMContentLoaded', () => {
	const itemInput = $('#item-input')
	const formBtn = $('#form-btn')
	const itemList = $('#item-list')
	const clearBtn = $('#clear')
	const itemFilter = $('#filter')

	Storage.getItem(TODO.STORAGE_KEY).forEach((item) =>
		addItemToDOM(item, itemList)
	)
	updateUI(clearBtn, itemFilter, formBtn, itemInput)
})

new Header()
new Form()
new Bottom()

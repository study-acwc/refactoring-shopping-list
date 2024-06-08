import { TODO } from '../constant/index.js'

export const Storage = {
	getItem: (key) => {
		const items = localStorage.getItem(key)
		return items ? JSON.parse(items) : []
	},
	setItem: (key, items) => {
		localStorage.setItem(key, JSON.stringify(items))
	},
	removeItem: (key) => {
		localStorage.removeItem(key)
	},
	updateItem: (key, items) => {
		const prevItems = Storage.getItem(key)
		localStorage.setItem(key, JSON.stringify([...prevItems, items]))
	},
}

export function removeFromStorage(item) {
	const updated = Storage.getItem(TODO.STORAGE_KEY).filter((i) => i !== item)
	Storage.setItem(TODO.STORAGE_KEY, updated)
}

export function isItemExists(item) {
	return Storage.getItem(TODO.STORAGE_KEY).includes(item)
}

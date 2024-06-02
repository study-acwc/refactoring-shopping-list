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

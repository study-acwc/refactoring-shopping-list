export const Storage = {
	getItem: (key) => {
		const items = localStorage.getItem(key)
		return items ? JSON.parse(items) : []
	},
	setItem: (key, item) => {
		localStorage.setItem(key, JSON.stringify(item))
	},
	removeItem: (key) => {
		localStorage.removeItem(key)
	},
}

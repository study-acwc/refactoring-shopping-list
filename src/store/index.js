export const editState = {
	value: false,
	get() {
		return this.value
	},

	toggle() {
		this.value = !this.value
		return this.value
	},

	off() {
		this.value = false
		return this.value
	},
	on() {
		this.value = true
		return this.value
	},
}

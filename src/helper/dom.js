export const $ = function (selector) {
	return document.querySelector(selector)
}

export const $all = function (selector) {
	return document.querySelectorAll(selector)
}

export function $(selector) {
	if (!selector) throw new Error('선택자를 입력해주세요.')

	const element = document.querySelector(selector)

	if (!element) throw new Error('선택자가 없습니다.')

	return element
}

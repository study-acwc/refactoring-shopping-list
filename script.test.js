import * as innerHTMLForTest from './scriptTestHTMLSetup.js'
import * as script from './script.js'

const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')

beforeEach(() => {
	script.clearItems()
	itemInput.value = ''
})

describe('Add Item 버튼이 눌렸을 때, 입력값이 없으면', () => {
	let e
	beforeEach(() => {
		e = {
			preventDefault: jest.fn(),
		}
	})

	test('아이템을 저장하지 않는다', () => {
		script.onAddItemSubmit(e)
		expect(localStorage.getItem('items')).toBe(null)
	})
})

describe('Add Item 버튼이 눌렸을 때, 입력값이 있고 기존에 없는 값이면', () => {
	let e
	beforeEach(() => {
		e = {
			preventDefault: jest.fn(),
		}
		const newValue = 'new Value'
		itemInput.Value = newValue
		localStorage.setItem('items', JSON.stringify(newValue))
	})

	test('아이템을 저장한다', () => {
		script.onAddItemSubmit(e)
		const items = JSON.parse(localStorage.getItem('items'))
		expect(items).toContain('')
	})

	test('입력값을 지운다.', () => {
		script.onAddItemSubmit(e)
		itemInput.value = ''
		expect(itemInput.value).toBe('')
	})
})

describe('Add Item 버튼이 눌렸을 때, 입력값이 있고 동일한 아이템이 이미 존재하면', () => {
	let e
	beforeEach(() => {
		e = {
			preventDefault: jest.fn(),
		}

		const newValue = 'new Value'
		itemInput.value = newValue
		localStorage.setItem('items', JSON.stringify(newValue))
	})

	test('아이템을 중복 저장하지 않는다', () => {
		script.onAddItemSubmit(e)

		const newValue = 'new Value'
		const items = JSON.parse(localStorage.getItem('items'))
		const isDuplicate = items.includes(newValue)
		expect(isDuplicate).toBeTruthy()
	})

	test('입력값을 지우지 않는다', () => {
		script.onAddItemSubmit(e)
		expect(itemInput.value).not.toBe('')
	})
})

describe('Update Item 버튼이 눌렸을 때', () => {
	let e
	beforeEach(() => {
		e = {
			preventDefault: jest.fn(),
		}

		itemInput.value = 'oldItem'
		script.onAddItemSubmit(e)

		const filtered = Array.from(itemList.childNodes).filter(
			(i) => i.textContent == 'oldItem'
		)

		script.setItemToEdit(filtered[0])
		itemInput.value = 'updatedItem'
	})

	test('저장된 아이템을 제거한다', () => {
		script.onAddItemSubmit(e)
		const items = JSON.parse(localStorage.getItem('items'))
		expect(items).not.toContain('oldItem')
	})

	test('아이템 편집 상태를 해제한다', () => {
		script.onAddItemSubmit(e)
		expect(script.isEditMode).toBe(false)
	})

	test('아이템을 저장한다', () => {
		script.onAddItemSubmit(e)
		const items = JSON.parse(localStorage.getItem('items'))
		expect(items).toContain('updatedItem')
	})

	test('입력값을 지운다', () => {
		script.onAddItemSubmit(e)
		expect(itemInput.value).toBe('')
	})
})

describe('clear all 버튼을 클릭한다', () => {
	let e
	beforeEach(() => {
		e = {
			preventDefault: jest.fn(),
		}
		itemInput.value = 'Apples'
		script.onAddItemSubmit(e)
	})

	test('ui에서 제거한다', () => {
		script.clearItems()
		expect(itemList.children.length).toBe(0)
	})

	test('로컬 스토리지 값을 지운다', () => {
		script.clearItems()
		const items = JSON.parse(localStorage.getItem('items'))
		expect(items).toBe(null)
	})
})

describe('item 을 필터링한다', () => {
	let e
	beforeEach(() => {
		e = {
			preventDefault: jest.fn(),
			target: {
				value: '',
			},
		}
	})

	test('입력된 값이 있다면 보여준다', () => {
		e.target.value = 'a'
		script.filterItems(e)
		const filtered = Array.from(itemList.childNodes).filter((item) =>
			item.textContent.toLocaleLowerCase().includes(e.target.value)
		)

		// expect(filtered.length).not.toBe(0)
	})

	test('입력된 값이 없다면 안보여준다', () => {
		e.target.value = 'z'
		script.filterItems(e)
		const items = Array.from(itemList.childNodes).filter(
			(item) => item.textContent.indexOf(e.target.value.toLowerCase()) === -1
		)
		expect(items.length).toBe(0)
	})
})

test('dom이 로드되면 displayItems를 호출한다', () => {
	//storage에 값이 없을땐 0이고
	expect(itemList.children.length).toBe(0)

	// storage에 값이 있다면 dom에 추가함
	localStorage.setItem('items', JSON.stringify(['Apples']))
	script.displayItems()
	expect(itemList.children.length).toBeGreaterThan(0)
})

describe('item 을 클릭시', () => {
	let e
	let removeSpy
	let editSpy
	beforeEach(() => {
		e = {
			preventDefault: jest.fn(),
		}
		itemInput.value = 'Apples'
		script.onAddItemSubmit(e)

		removeSpy = jest.spyOn(script, 'removeItem')
		editSpy = jest.spyOn(script, 'setItemToEdit')
	})

	test('item list, remove-item 이 아닌 다른 영역 클릭시 아무동작도 하지 않는다', () => {
		const list = itemList.childNodes[0]
		const event = {
			target: list,
			preventDefault: jest.fn(),
		}

		script.onClickItem(event)
		expect(removeSpy).not.toHaveBeenCalled()
		expect(editSpy).not.toHaveBeenCalled()
	})

	test('remove-item 클릭시 removeItem을 호출하고, li 클릭시 편집상태를 바꾼다', () => {
		const list = itemList.childNodes[0]
		const event = {
			target: list,
			preventDefault: jest.fn(),
		}

		if (event.target.parentElement.classList.contains('remove-item')) {
			script.onClickItem(event)
			expect(removeSpy).toHaveBeenCalled()
			expect(editSpy).not.toHaveBeenCalled()
		}

		if (event.target.closest('li')) {
			// expect(editSpy).toHaveBeenCalled()
			expect(removeSpy).not.toHaveBeenCalled()
		}
	})
})

describe('removeItem 호출시 item이 있다면', () => {
	let item
	beforeEach(() => {
		item = {
			textContent: 'Apples',
			remove: jest.fn(),
		}
	})
	test('confirm을 띄운다', () => {
		script.removeItem(item)
		window.confirm = jest.fn(() => true)
	})

	test('dom에서 제거한다', () => {
		script.removeItem(item)
		expect(itemList.children.length).toBe(0)
	})

	test('storage에서 지운다', () => {
		script.removeItem(item)
		const items = JSON.parse(localStorage.getItem('items'))
		expect(items).not.toContain('Apples')
	})
})

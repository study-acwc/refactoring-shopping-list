import * as innerHTMLForTest from './scriptTestHTMLSetup.js'
import { $, $all } from './src/helper/dom.js'
import Form from './src/view/Form.js'
import Bottom from './src/view/Bottom.js'
import { editState } from './src/store'

const form = new Form()
const bottom = new Bottom()

const itemInput = $('#item-input')
const itemList = $('#item-list')

describe('Add Item 버튼이 눌렸을 때, 입력값이 없으면', () => {
	let e
	beforeEach(() => {
		e = {
			preventDefault: jest.fn(),
		}
	})

	test('아이템을 저장하지 않는다', () => {
		form.onAddItemSubmit(e)
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
		form.onAddItemSubmit(e)
		const items = JSON.parse(localStorage.getItem('items'))
		expect(items).toContain('')
	})

	test('입력값을 지운다.', () => {
		form.onAddItemSubmit(e)
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
		form.onAddItemSubmit(e)

		const newValue = 'new Value'
		const items = JSON.parse(localStorage.getItem('items'))
		const isDuplicate = items.includes(newValue)
		expect(isDuplicate).toBeTruthy()
	})

	test('입력값을 지우지 않는다', () => {
		form.onAddItemSubmit(e)
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
		form.onAddItemSubmit(e)

		const filtered = Array.from(itemList.childNodes).filter(
			(i) => i.textContent == 'oldItem'
		)

		bottom.setItemToEdit(filtered[0])
		itemInput.value = 'updatedItem'
	})

	test('저장된 아이템을 제거한다', () => {
		form.onAddItemSubmit(e)
		const items = JSON.parse(localStorage.getItem('items'))
		expect(items).not.toContain('oldItem')
	})

	test('아이템 편집 상태를 해제한다', () => {
		form.onAddItemSubmit(e)
		expect(editState.get()).toBe(false)
	})

	test('아이템을 저장한다', () => {
		form.onAddItemSubmit(e)
		const items = JSON.parse(localStorage.getItem('items'))
		expect(items).toContain('updatedItem')
	})

	test('입력값을 지운다', () => {
		form.onAddItemSubmit(e)
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
		form.onAddItemSubmit(e)
	})

	test('ui에서 제거한다', () => {
		bottom.clearItems()
		expect(itemList.children.length).toBe(0)
	})

	test('로컬 스토리지 값을 지운다', () => {
		bottom.clearItems()
		const items = JSON.parse(localStorage.getItem('items'))
		expect(items).toBe(null)
	})
})

describe('item 을 필터링한다', () => {
	let e
	let items

	beforeEach(() => {
		e = {
			preventDefault: jest.fn(),
			target: {
				value: '',
			},
		}
		items = $all('li')
		itemInput.value = 'Apples'
		form.onAddItemSubmit(e)
	})

	test('입력된 값이 item에 있다면 ui에서 보여준다 ', () => {
		e.target.value = 'a'
		bottom.filterItems(e)
		items.forEach((item) => {
			if (item.textContent.toLowerCase().includes(e.target.value)) {
				expect(item.style.display).toBe('flex')
			}
		})
	})

	test('입력된 값이 없다면 안보여준다', () => {
		e.target.value = 'z'
		bottom.filterItems(e)
		items.forEach((item) => {
			expect(item.style.display).toBe('none')
		})
	})
})

// test('dom이 로드되면 displayItems를 호출한다', () => {
// 	//storage에 값이 없을땐 0이고
// 	expect(itemList.children.length).toBe(0)

// 	// storage에 값이 있다면 dom에 추가함
// 	localStorage.setItem('items', JSON.stringify(['Apples']))
// 	main.displayItems()
// 	expect(itemList.children.length).toBeGreaterThan(0)
// })

describe('item 클릭시', () => {
	let e
	let removeSpy
	let editSpy

	beforeEach(() => {
		e = {
			preventDefault: jest.fn(),
		}
		itemInput.value = 'Apples'
		form.onAddItemSubmit(e)

		removeSpy = jest.spyOn(bottom, 'removeItem')
		editSpy = jest.spyOn(bottom, 'setItemToEdit')
	})

	test('다른영역인 경우 아무것도 호출하지 않는다', () => {
		const list = itemList.childNodes[0]
		const event = {
			target: list,
			preventDefault: jest.fn(),
		}

		bottom.onClickItem(event)
		expect(removeSpy).not.toHaveBeenCalled()
		expect(editSpy).not.toHaveBeenCalled()
	})

	test('remove-item 클릭인 경우 removeItem을 호출한다', () => {
		const event = {
			target: {
				closest: jest.fn().mockReturnValue(null),
				parentElement: {
					parentElement: {
						textContent: 'Apples',
					},

					classList: {
						contains: jest.fn().mockReturnValue(true),
					},
				},
			},
			preventDefault: jest.fn(),
		}

		bottom.onClickItem(event)
		expect(removeSpy).toHaveBeenCalled()
		expect(editSpy).not.toHaveBeenCalled()
	})

	test('아이템 영역만 클릭시 setItemToEdit을 호출한다', () => {
		const event = {
			target: {
				closest: jest.fn().mockReturnValue(true),
				parentElement: {
					parentElement: {
						textContent: 'Apples',
					},
					classList: {
						contains: jest.fn().mockReturnValue(null),
					},
				},
			},
			preventDefault: jest.fn(),
		}

		bottom.onClickItem(event)
		expect(removeSpy).not.toHaveBeenCalled()
		expect(editSpy).toHaveBeenCalled()
	})
})

describe('removeItem 호출시 item이 있다면', () => {
	let item
	beforeEach(() => {
		item = {
			textContent: 'Apples',
			remove: jest.fn(),
		}
		window.confirm = jest.fn(() => true)
	})
	test('confirm을 띄운다', () => {
		bottom.removeItem(item)
		expect(confirm).toHaveBeenCalled()
	})

	test('dom에서 제거한다', () => {
		bottom.removeItem(item)
		expect(itemList.children.length).toBe(0)
	})

	test('storage에서 지운다', () => {
		bottom.removeItem(item)
		const items = JSON.parse(localStorage.getItem('items'))
		expect(items).not.toContain('Apples')
	})
})

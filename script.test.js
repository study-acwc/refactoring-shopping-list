import * as innerHTMLForTest from './scriptTestHTMLSetup.js';
import * as script from './script.js';

const localStorageKey = 'items';

window.alert = jest.fn();

beforeEach(() => {
  script.clearItems();
});

describe('Add Item 버튼이 눌렸을 때, 입력값이 없으면', () => {
    let e;
    beforeEach(() => {
        e = dummyUIEvent();
        setItemInputValue('');
    });

    test('아이템을 저장하지 않는다', () => {
        script.onAddItemSubmit(e);

        expect(localStorageItems()).toBe(null);
    });
});

describe('Add Item 버튼이 눌렸을 때, 입력값이 있고 기존에 없는 값이면', () => {
    let e;
    let inputValue;
    beforeEach(() => {
        e = dummyUIEvent();
        inputValue = 'item1';
        setItemInputValue(inputValue);
        setLocalStorageItems(['item2', 'item3']);
    });

    test('아이템을 저장한다', () => {
        script.onAddItemSubmit(e);

        expect(localStorageItems()).toContain(inputValue);
    });

    test("입력값을 지운다.", () => {
        script.onAddItemSubmit(e);

        expect(itemInputValue()).toBe('');
    });
});

describe('Add Item 버튼이 눌렸을 때, 입력값이 있고 동일한 아이템이 이미 존재하면', () => {
    let e;
    let inputValue;
    beforeEach(() => {
        e = dummyUIEvent();
        inputValue = 'item1';
        setItemInputValue(inputValue);
        setLocalStorageItems([inputValue]);
    });

    test('아이템을 중복 저장하지 않는다', () => {
        script.onAddItemSubmit(e);

        const filteredItems = filteredLocalStorageItemsBy(inputValue);
        expect(filteredItems).toHaveLength(1);
    });

    test("입력값을 지우지 않는다", () => {
        script.onAddItemSubmit(e);

        expect(itemInputValue()).toBe(inputValue);
    });
});

describe('Update Item 버튼이 눌렸을 때', () => {
    let e;
    let itemTitle;
    let updatedItemTitle;
    beforeEach(() => {
      e = dummyUIEvent();
      itemTitle = 'oldItem';
      updatedItemTitle = 'updatedItem';
      // 1
      setItemInputValue(itemTitle);
      script.onAddItemSubmit(e);
      // 2
      const filtered = filteredItemElementsBy(itemTitle);
      script.setItemToEdit(filtered[0]);
      // 3
      setItemInputValue(updatedItemTitle);
    });

    test('저장된 아이템을 제거한다', () => {
        script.onAddItemSubmit(e);

        expect(localStorageItems()).not.toContain(itemTitle);
    });

    test("아이템 편집 상태를 해제한다", () => {
        script.onAddItemSubmit(e);

        expect(script.isEditMode).toBeFalsy();
    });

    test('아이템을 저장한다', () => {
        script.onAddItemSubmit(e);

        expect(localStorageItems()).toContain(updatedItemTitle);
    });

    test("입력값을 지운다", () => {
        script.onAddItemSubmit(e);

        expect(itemInputValue()).toBe('');
    });
});

describe('아이템 영역이 눌렸을 때, 삭제 버튼 영역 안이였다면', () => {
  let item;

  beforeEach(() => {;
    // 1
    let e = dummyUIEvent();
    let itemTitle = 'item1';
    setItemInputValue(itemTitle);
    script.onAddItemSubmit(e);
    // 2
    const filtered = filteredItemElementsBy(itemTitle);
    item = filtered[0];
    // 3
    global.confirm = jest.fn();
  });

  test('삭제 여부 확인 창을 띄운다', () => {
    let event = {
      target: deleteButtonInItemElement(item)
    };
    script.onClickItem(event);

    // 메서드 호출 여부로 테스트 성공여부를 검증(= 행위 검증)
    expect(confirm).toHaveBeenCalled();
  });
});

describe('아이템 영역이 눌렸을 때, 삭제 버튼 영역 바깥쪽이었다면', () => {
  let item;
  let event;
  beforeEach(() => {
    // 1
    let e = dummyUIEvent();
    let itemTitle = 'item1';
    setItemInputValue(itemTitle);
    script.onAddItemSubmit(e);
    // 2
    const filtered = filteredItemElementsBy(itemTitle);
    item = filtered[0];
    // 3. event 객체 생성
    event = {
      target: item // item element (LI)
    };
  });

  test('아이템 편집 상태를 활성화한다', () => {
    script.onClickItem(event);

    expect(script.isEditMode).toBeTruthy();
  });

  test('해당 아이템을 편집 모드로 표시한다', () => {
    script.onClickItem(event);

    const filteredItems = itemElements().filter(
      (i) => i.textContent.includes(item.textContent) && editingItemElement(i)
    );
    expect(filteredItems).toHaveLength(1);
  });

  test('해당되지 않는 아이템은 편집 모드로 표시하지 않는다', () => {
    script.onClickItem(event);
  
    const filteredItems = itemElements().filter(
      (i) => false == i.textContent.includes(item.textContent) && editingItemElement(i)
    );
    expect(filteredItems).toHaveLength(0);
  });

  test('검색어 입력창을 편집할 아이템의 텍스트로 채운다', () => {
    script.onClickItem(event);

    expect(script.itemInput.value).toBe(item.textContent);
  });
});

describe('아이템 영역이 아닌 위치에서 눌렸을 때', () => {
  let removeItemSpy;
  let setItemToEditSpy;

  beforeEach(() => {
    // script 모듈의 removeItem과 setItemToEdit 함수를 스파이가 모킹한다.
    removeItemSpy = jest.spyOn(script, 'removeItem');
    setItemToEditSpy = jest.spyOn(script, 'setItemToEdit');
  });

  afterEach(() => {
    // 테스트 후 각 스파이를 복원한다.
    jest.restoreAllMocks();
  });

  test('아이템 삭제나 편집 동작을 수행하지 않는다', () => {
    let event = {
      target: {
        parentElement: {
          classList: {
            contains: jest.fn().mockReturnValue(false)
          }
        },
        closest: jest.fn().mockReturnValue(null)
      }
    };
    script.onClickItem(event);

    expect(removeItemSpy).not.toHaveBeenCalled();
    expect(setItemToEditSpy).not.toHaveBeenCalled();
  });
});


describe('삭제 여부 확인 창에서 확인 버튼이 눌렸을 때', () => {
  let item;
  let itemTitle;

  afterEach(() => {
    jest.clearAllMocks();  // 각 테스트 후 모의 함수를 초기화
  });

  beforeEach(() => {
    let e = dummyUIEvent();
    itemTitle = 'item1';
    // 1
    setItemInputValue(itemTitle);
    script.onAddItemSubmit(e);
    // 2
    const filtered = filteredItemElementsBy(itemTitle);
    item = filtered[0];
    // 3
    global.confirm = jest.fn().mockReturnValue(true);
  });

  test('아이템을 저장소에서 제거한다', () => {
    script.removeItem(item);

    expect(localStorageItems()).not.toContain(itemTitle);
  });
});

describe('검색어를 입력했을 때', () => {
  let searchKeyword;
  let searchKeywordEvent;
  beforeEach(() => {
    // 1
    let e = dummyUIEvent();
    setItemInputValue('notebook');
    script.onAddItemSubmit(e);
    setItemInputValue('ipad');
    script.onAddItemSubmit(e);
    // 2
    searchKeyword = 'note';
    searchKeywordEvent = {
      preventDefault: jest.fn(),
      target: { value: searchKeyword }
    };
  });

  test('검색 결과에 해당하는 아이템을 표시한다', () => {
    script.filterItems(searchKeywordEvent);

    const filteredItems = itemElements().filter(
      (i) => i.textContent.includes(searchKeyword) && hasFilteredItemStyle(i)
    );
    expect(filteredItems).toHaveLength(1);
  });

  test('검색 결과에 해당하지 않는 아이템은 표시하지 않는다.', () => {
    script.filterItems(searchKeywordEvent);
    
    const filteredItems = itemElements().filter(
      (i) => i.textContent != searchKeyword && hasUnfilteredItemStyle(i)
    );
    expect(filteredItems).toHaveLength(1);
  });
});

describe('Clear All 버튼이 눌렸을 때', () => {
  beforeEach(() => {
    setLocalStorageItems(['item1', 'item2']);
  });

  test('모든 아이템을 저장소에서 제거한다.', () => {
    script.clearItems();

    expect(localStorageItems()).toBeNull();
  });
});

describe('Dom Content가 로드되었을 때', () => {
  let contents = ['item1', 'item2'];
  beforeEach(() => {
    setLocalStorageItems(contents);
  });

  test('저장된 아이템을 화면에 표시한다', () => {
    script.displayItems();
    
    const items = itemElements().map(
      (i) => i.textContent
    );

    // items 배열과 contents 배열이 자료형과 내용이 완전히 동일한지를 검사한다. 
    // 만약 두 배열의 요소의 순서, 자료형, 내용이 완전히 같으면 테스트가 통과한다.
    // 하지만 만약 두 배열이 다른 요소 순서나 다른 요소를 포함하거나 자료형이 다르면 테스트는 실패하게 된다.
    expect(items).toStrictEqual(contents);
  });

  test('입력필드가 비어있어야 한다', () => {
    script.displayItems();

    expect(itemInputValue()).toBe('');
  });

  test('아이템 편집상태가 아니어야 한다', () => {
    script.displayItems();

    expect(script.isEditMode).toBeFalsy();
  });
});

function dummyUIEvent() {
  return {
    preventDefault: jest.fn(),
    target: { value: 'Sample Value' }
  };
}

function localStorageItems() {
  return JSON.parse(localStorage.getItem(localStorageKey));
}

function filteredLocalStorageItemsBy(itemTitle) {
  return localStorageItems().filter(item => item === itemTitle);
}

function setLocalStorageItems(items) {
  localStorage.setItem(localStorageKey, JSON.stringify(items));
}

function setItemInputValue(value) {
  document.getElementById('item-input').value = value;
}

function itemInputValue() {
  return script.itemInput.value;
}

function itemElements() {
  return Array.from(script.itemList.querySelectorAll('li'));
}

function filteredItemElementsBy(itemTitle) {
  return itemElements().filter((i) => i.textContent == itemTitle);
}

function hasFilteredItemStyle(element) {
  return element.style.display == 'flex'
}

function hasUnfilteredItemStyle(element) {
  return element.style.display == 'none'
}

function deleteButtonInItemElement(element) {
  return element.lastElementChild.lastElementChild;
}

function editingItemElement(element) {
  return element.classList.contains('edit-mode')
}
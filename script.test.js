import * as innerHTMLForTest from './scriptTestHTMLSetup.js';
import * as script from './script.js';

window.alert = jest.fn();

function initialize() {
  // 테스트 시작하기 전에 다른 테스트에서 설정한 값을 초기화하는 작업
  script.clearItems();
}

describe('Add Item 버튼이 눌렸을 때, 입력값이 없으면', () => {
    let e;
    beforeEach(() => {
        initialize();
        e = {
            preventDefault: jest.fn(), // preventDefault 메서드를 가짐
            target: { value: 'Sample Value' } // target 속성을 가짐
        };
        // HTML 요소를 생성하여 테스트에 사용합니다.
        document.getElementById('item-input').value = '';
    });

    test('아이템을 저장하지 않는다', () => {
        script.onAddItemSubmit(e);
        expect(localStorage.getItem('items')).toBe(null);
    });
});

describe('Add Item 버튼이 눌렸을 때, 입력값이 있고 기존에 없는 값이면', () => {
    let e;
    beforeEach(() => {
      initialize();
        e = {
            preventDefault: jest.fn(), // preventDefault 메서드를 가짐
            target: { value: 'Sample Value' } // target 속성을 가짐
        };
        // HTML 요소를 생성하여 테스트에 사용합니다.
        document.getElementById('item-input').value = 'item1';
        localStorage.setItem('items', JSON.stringify(['item2', 'item3']));
    });

    test('아이템을 저장한다', () => {
        script.onAddItemSubmit(e);

        const items = JSON.parse(localStorage.getItem('items'));
        expect(items).toContain('item1');
    });

    test("입력값을 지운다.", () => {
        script.onAddItemSubmit(e);
        expect(document.getElementById('item-input').value).toBe('');
    });
});

describe('Add Item 버튼이 눌렸을 때, 입력값이 있고 동일한 아이템이 이미 존재하면', () => {
    let e;
    beforeEach(() => {
      initialize();
        e = {
            preventDefault: jest.fn(), // preventDefault 메서드를 가짐
            target: { value: 'Sample Value' } // target 속성을 가짐
        };
  
        // HTML 요소를 생성하여 테스트에 사용합니다.
        document.getElementById('item-input').value = 'item1';
        localStorage.setItem('items', JSON.stringify(['item1']));
    });

    test('아이템을 중복 저장하지 않는다', () => {
        script.onAddItemSubmit(e);

        const items = JSON.parse(localStorage.getItem('items'));
        const filteredItems = items.filter(item => item === 'item1');
        expect(filteredItems).toHaveLength(1);
    });

    test("입력값을 지우지 않는다", () => {
        script.onAddItemSubmit(e);
        expect(document.getElementById('item-input').value).not.toBe('');
    });
});

describe('Update Item 버튼이 눌렸을 때', () => {
    let e;
    beforeEach(() => {
      initialize();
      e = {
          preventDefault: jest.fn(), // preventDefault 메서드를 가짐
          target: { value: 'Sample Value' } // target 속성을 가짐
      };
      // 1. "oldItem" item 등록
      document.getElementById('item-input').value = 'oldItem';
      script.onAddItemSubmit(e);
      // 2. "oldItem" item 업데이트 모드로 전환
      // "oldItem" item 객체 조회
      const items = script.itemList.querySelectorAll('li');
      const filtered = Array.from(items).filter((i) => i.textContent == 'oldItem');
      // 그 아이템을 업데이트 모드로 변경
      script.setItemToEdit(filtered[0]);
      // 3. "updatedItem" 으로 변경된 이름 입력
      document.getElementById('item-input').value = 'updatedItem';
    });

    test('저장된 아이템을 제거한다', () => {
        script.onAddItemSubmit(e);
        const items = JSON.parse(localStorage.getItem('items'));
        expect(items).not.toContain('oldItem');
    });

    test("아이템 편집 상태를 해제한다", () => {
        script.onAddItemSubmit(e);
        expect(script.isEditMode).toBeFalsy();
    });

    test('아이템을 저장한다', () => {
        script.onAddItemSubmit(e);

        const items = JSON.parse(localStorage.getItem('items'));
        expect(items).toContain('updatedItem');
    });

    test("입력값을 지운다", () => {
        script.onAddItemSubmit(e);
        expect(document.getElementById('item-input').value).toBe('');
    });
});

describe('아이템 영역이 눌렸을 때, 삭제 버튼 영역 안이였다면', () => {
  let item;
  beforeEach(() => {
    initialize();
    // 1. "item1" item 등록
    let e = {
      preventDefault: jest.fn(), // preventDefault 메서드를 가짐
      target: { value: 'Sample Value' } // target 속성을 가짐
    };
    document.getElementById('item-input').value = 'item1';
    script.onAddItemSubmit(e);
    // 2. "item1" item 객체 조회
    const items = script.itemList.querySelectorAll('li');
    const filtered = Array.from(items).filter((i) => i.textContent == 'item1');
    item = filtered[0];
    // 3. confirm 함수를 모의 함수로 대체
    global.confirm = jest.fn();
  });

  test('삭제 여부 확인 창을 띄운다', () => {
    let event = {
      target: item.lastElementChild.lastElementChild // 삭제 버튼 element
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
    initialize();
    // 1. "item1" item 등록
    let e = {
      preventDefault: jest.fn(), // preventDefault 메서드를 가짐
      target: { value: 'Sample Value' } // target 속성을 가짐
    };
    document.getElementById('item-input').value = 'item1';
    script.onAddItemSubmit(e);
    // 2. "item1" item 객체 조회
    const items = script.itemList.querySelectorAll('li');
    const filtered = Array.from(items).filter((i) => i.textContent == 'item1');
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

    const items = script.itemList.querySelectorAll('li'); 
    const filteredItems = Array.from(items).filter(
      (i) => i.textContent.includes(item.textContent) && i.classList.contains('edit-mode')
    );
    expect(filteredItems).toHaveLength(1);
  });

  test('해당되지 않는 아이템은 편집 모드로 표시하지 않는다', () => {
    script.onClickItem(event);

    const items = script.itemList.querySelectorAll('li'); 
    const filteredItems = Array.from(items).filter(
      (i) => false == i.textContent.includes(item.textContent) && i.classList.contains('edit-mode')
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
    initialize();

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
  afterEach(() => {
    jest.clearAllMocks();  // 각 테스트 후 모의 함수를 초기화
  });

  beforeEach(() => {
    initialize();
    let e = {
      preventDefault: jest.fn(), // preventDefault 메서드를 가짐
      target: { value: 'Sample Value' } // target 속성을 가짐
    };
    // 1. "item1" item 등록
    document.getElementById('item-input').value = 'item1';
    script.onAddItemSubmit(e);
    // 2. "item1" item 객체 조회
    const items = script.itemList.querySelectorAll('li');
    const filtered = Array.from(items).filter((i) => i.textContent == 'item1');
    item = filtered[0];
    // 3. alert 함수를 모의 함수로 대체
    global.confirm = jest.fn().mockReturnValue(true);
  });

  test('아이템을 저장소에서 제거한다', () => {
    script.removeItem(item);

    const items = JSON.parse(localStorage.getItem('items'));
    
    expect(items).not.toContain('item1');
  });
});

describe('검색어를 입력했을 때', () => {
  let searchKeyword;
  let searchKeywordEvent;
  beforeEach(() => {
    initialize();
    // 1. 아이템을 2개 추가한다.
    let e = {
      preventDefault: jest.fn(), // preventDefault 메서드를 가짐
      target: { value: 'Sample Value' } // target 속성을 가짐
    };
    document.getElementById('item-input').value = 'notebook';
    script.onAddItemSubmit(e);
    document.getElementById('item-input').value = 'ipad';
    script.onAddItemSubmit(e);
    // 2. 그 중 1개의 아이템만 검색되는 검색어를 설정한다.
    searchKeyword = 'note';
    searchKeywordEvent = {
      preventDefault: jest.fn(), // preventDefault 메서드를 가짐
      target: { value: searchKeyword } // target 속성을 가짐
    };
  });

  test('검색 결과에 해당하는 아이템을 표시한다', () => {
    script.filterItems(searchKeywordEvent);

    const items = script.itemList.querySelectorAll('li'); 
    const filteredItems = Array.from(items).filter(
      (i) => i.textContent.includes(searchKeyword) && i.style.display == 'flex'
    );
    expect(filteredItems).toHaveLength(1);
  });

  test('검색 결과에 해당하지 않는 아이템은 표시하지 않는다.', () => {
    script.filterItems(searchKeywordEvent);

    const items = script.itemList.querySelectorAll('li');
    const filteredItems = Array.from(items).filter(
      (i) => i.textContent != searchKeyword && i.style.display == 'none'
    );
    expect(filteredItems).toHaveLength(1);
  });
});

describe('Clear All 버튼이 눌렸을 때', () => {
  beforeEach(() => {
    initialize();
    // 2개의 아이템을 추가한다.
    localStorage.setItem('items', JSON.stringify(['item1', 'item2']));
  });

  test('모든 아이템을 저장소에서 제거한다.', () => {
    script.clearItems();

    const items = JSON.parse(localStorage.getItem('items'));
    expect(items).toBeNull();
  });
});

describe('Dom Content가 로드되었을 때', () => {
  let contents = ['item1', 'item2'];
  beforeEach(() => {
    initialize();
    // 2개의 아이템을 추가한다.
    localStorage.setItem('items', JSON.stringify(contents));
  });

  test('저장된 아이템을 화면에 표시한다', () => {
    script.displayItems();

    const items = script.itemList.querySelectorAll('li');
    const filteredItems = Array.from(items).filter(
      (i) => contents.includes(i.textContent)
    );
    expect(filteredItems).toHaveLength(2);
  });

  test('입력필드가 비어있어야 한다', () => {
    script.displayItems();

    expect(script.itemInput.value).toBe('');
  });

  test('아이템 편집상태가 아니어야 한다', () => {
    script.displayItems();

    expect(script.isEditMode).toBeFalsy();
  });
});
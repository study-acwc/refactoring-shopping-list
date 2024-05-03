import * as innerHTMLForTest from './scriptTestHTMLSetup.js';
import * as script from './script.js';

window.alert = jest.fn()

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
        expect(script.isEditMode).toBe(false);
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

describe('아이템 제거 버튼이 눌렸을 때', () => {
  let item;
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
    // 3. confirm 함수를 모의 함수로 대체
    global.confirm = jest.fn();
  });

  test('삭제 여부를 묻는 Alert를 띄운다', () => {
    script.removeItem(item);

    expect(confirm).toHaveBeenCalled();
  });
});

describe('삭제 여부 Alert에서 확인 버튼이 눌렸을 때', () => {
  let item;
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
import * as innerHTMLForTest from "./scriptTestHTMLSetup.js";
import * as script from "./script.js";

const ITEM_LIST_ELEMENT_ID = "item-list";
const LOCAL_STORAGE_LIST_KEY = "items";

window.alert = jest.fn();

function initialize() {
  // 테스트 시작하기 전에 다른 테스트에서 설정한 값을 초기화하는 작업
  script.clearItems();
}

const getElementList = () => document.getElementById(ITEM_LIST_ELEMENT_ID);
const getLocalStorageList = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY));
  } catch (error) {
    console.error("JSON.parse get list error");
    return null;
  }
};

// beforeEach 블록 내에서 confirm 함수 설정
beforeEach(() => {
  global.confirm = jest.fn(); // confirm 함수를 jest.fn()으로 초기화
});

describe("Add Item 버튼이 눌렸을 때, 입력값이 없으면", () => {
  let e;
  beforeEach(() => {
    initialize();
    e = {
      preventDefault: jest.fn(), // preventDefault 메서드를 가짐
      target: { value: "Sample Value" }, // target 속성을 가짐
    };
    // HTML 요소를 생성하여 테스트에 사용합니다.
    document.getElementById("item-input").value = "";
  });

  test("아이템을 저장하지 않는다", () => {
    script.onAddItemSubmit(e);
    expect(localStorage.getItem("items")).toBe(null);
  });
});

describe("Add Item 버튼이 눌렸을 때, 입력값이 있고 기존에 없는 값이면", () => {
  let e;
  beforeEach(() => {
    initialize();
    e = {
      preventDefault: jest.fn(), // preventDefault 메서드를 가짐
      target: { value: "Sample Value" }, // target 속성을 가짐
    };
    // HTML 요소를 생성하여 테스트에 사용합니다.
    document.getElementById("item-input").value = "item1";
    localStorage.setItem("items", JSON.stringify(["item2", "item3"]));
  });

  test("아이템을 저장한다", () => {
    script.onAddItemSubmit(e);

    const items = JSON.parse(localStorage.getItem("items"));
    expect(items).toContain("item1");
  });

  test("입력값을 지운다.", () => {
    script.onAddItemSubmit(e);
    expect(document.getElementById("item-input").value).toBe("");
  });
});

describe("Add Item 버튼이 눌렸을 때, 입력값이 있고 동일한 아이템이 이미 존재하면", () => {
  let e;
  beforeEach(() => {
    initialize();
    e = {
      preventDefault: jest.fn(), // preventDefault 메서드를 가짐
      target: { value: "Sample Value" }, // target 속성을 가짐
    };

    // HTML 요소를 생성하여 테스트에 사용합니다.
    document.getElementById("item-input").value = "item1";
    localStorage.setItem("items", JSON.stringify(["item1"]));
  });

  test("아이템을 중복 저장하지 않는다", () => {
    script.onAddItemSubmit(e);

    const items = JSON.parse(localStorage.getItem("items"));
    const filteredItems = items.filter((item) => item === "item1");
    expect(filteredItems).toHaveLength(1);
  });

  test("입력값을 지우지 않는다", () => {
    script.onAddItemSubmit(e);
    expect(document.getElementById("item-input").value).not.toBe("");
  });
});

describe("Update Item 버튼이 눌렸을 때", () => {
  let e;
  beforeEach(() => {
    initialize();
    e = {
      preventDefault: jest.fn(), // preventDefault 메서드를 가짐
      target: { value: "Sample Value" }, // target 속성을 가짐
    };
    // 1. "oldItem" item 등록
    document.getElementById("item-input").value = "oldItem";
    script.onAddItemSubmit(e);
    // 2. "oldItem" item 업데이트 모드로 전환
    // "oldItem" item 객체 조회
    const items = script.itemList.querySelectorAll("li");
    const filtered = Array.from(items).filter(
      (i) => i.textContent == "oldItem"
    );
    // 그 아이템을 업데이트 모드로 변경
    script.setItemToEdit(filtered[0]);
    // 3. "updatedItem" 으로 변경된 이름 입력
    document.getElementById("item-input").value = "updatedItem";
  });

  test("저장된 아이템을 제거한다", () => {
    script.onAddItemSubmit(e);
    const items = JSON.parse(localStorage.getItem("items"));
    expect(items).not.toContain("oldItem");
  });

  test("아이템 편집 상태를 해제한다", () => {
    script.onAddItemSubmit(e);
    expect(script.isEditMode).toBe(false);
  });

  test("아이템을 저장한다", () => {
    script.onAddItemSubmit(e);

    const items = JSON.parse(localStorage.getItem("items"));
    expect(items).toContain("updatedItem");
  });

  test("입력값을 지운다", () => {
    script.onAddItemSubmit(e);
    expect(document.getElementById("item-input").value).toBe("");
  });
});

//NOTE: william test case begin

describe("UI 아이템 추가", () => {
  beforeEach(() => {
    initialize();
  });
  // addItemToDOM 함수 테스트
  test("임으의 입력값 item block이 추가", () => {
    const inputValue = "test-item";
    // 새로운 아이템을 추가
    script.addItemToDOM(inputValue);

    // 아이템 목록에 해당 아이템이 추가되었는지 확인
    const itemList = getElementList();
    expect(itemList.children.length).toBe(1);
    expect(itemList.children[0].textContent).toBe(inputValue);
  });
});

describe("UI 아이템 삭제", () => {
  beforeEach(() => {
    // confirm 함수를 jest.fn()으로 초기화
    global.confirm = jest.fn();
    initialize();
  });
  // addItemToDOM 함수 테스트
  test("삭제 확인을 누르면 목록에서 item block이 삭제", () => {
    // confirm 함수가 항상 true를 반환하도록 설정
    global.confirm.mockReturnValueOnce(true);

    const inputValue = "test-item";

    // 아이템 추가
    document.body.innerHTML = `<ul id="item-list"><li>${inputValue}</li></ul>`;

    // 아이템 목록이 비어있는지 확인
    const itemList = getElementList();

    // 아이템을 DOM에서 제거
    script.removeItem(itemList.children[0]);
    expect(itemList.children.length).toBe(0);
  });
});

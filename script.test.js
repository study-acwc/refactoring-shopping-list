import * as innerHTMLForTest from "./scriptTestHTMLSetup.js";
import ShoppingListController from "./ShoppingListController.js";

const ITEM_LIST_ELEMENT_ID = "item-list";
const BUTTON_REMOVE_CLASS_NAME = "remove-item btn-link text-red";
const ICON_DELETE_CLASS_NAMES = ["fa-solid", "fa-xmark"];
const INPUT_ELEMENT_Id = "item-input";
const BUTTON_CLEAR_ID = "clear";

window.alert = jest.fn();

const shoppingListControl = new ShoppingListController();

// 테스트 시작하기 전에 다른 테스트에서 설정한 값을 초기화하는 작업
function initialize() {
  shoppingListControl.clearItems();
}

function setInputValue(value) {
  document.getElementById(INPUT_ELEMENT_Id).value = value;
}

function getInputValue() {
  return document.getElementById(INPUT_ELEMENT_Id).value;
}

const getElementList = () => [
  ...document.getElementById(ITEM_LIST_ELEMENT_ID).children,
];

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
    setInputValue("");
  });

  test("아이템을 저장하지 않는다", () => {
    shoppingListControl.onAddItemSubmit(e);

    expect(shoppingListControl.storage.getItem()).toBe(null);
  });
});

describe("Add Item 버튼이 눌렸을 때, 입력값이 있고 기존에 없는 값이면", () => {
  const TEST_INPUT_VALUE = "item1";

  let e;
  beforeEach(() => {
    initialize();
    e = {
      preventDefault: jest.fn(), // preventDefault 메서드를 가짐
      target: { value: "Sample Value" }, // target 속성을 가짐
    };
    // HTML 요소를 생성하여 테스트에 사용합니다.
    setInputValue(TEST_INPUT_VALUE);
    shoppingListControl.storage.setItem(JSON.stringify(["item2", "item3"]));
  });

  test("아이템을 저장한다", () => {
    shoppingListControl.onAddItemSubmit(e);
    expect(shoppingListControl.storage.getItem()).toContain(TEST_INPUT_VALUE);
  });

  test("입력값을 지운다.", () => {
    shoppingListControl.onAddItemSubmit(e);
    expect(getInputValue()).toBe("");
  });
});

describe("Add Item 버튼이 눌렸을 때, 입력값이 있고 동일한 아이템이 이미 존재하면", () => {
  const TEST_INPUT_VALUE = "item1";

  let e;
  beforeEach(() => {
    initialize();
    e = {
      preventDefault: jest.fn(), // preventDefault 메서드를 가짐
      target: { value: "Sample Value" }, // target 속성을 가짐
    };

    setInputValue(TEST_INPUT_VALUE);
    shoppingListControl.storage.setItem(JSON.stringify([TEST_INPUT_VALUE]));
  });

  test("아이템을 중복 저장하지 않는다", () => {
    shoppingListControl.onAddItemSubmit(e);

    const filteredItems = shoppingListControl
      .getItemsFromStorage()
      .filter((item) => item === TEST_INPUT_VALUE);
    expect(filteredItems).toHaveLength(1);
  });

  test("입력값을 지우지 않는다", () => {
    shoppingListControl.onAddItemSubmit(e);
    expect(getInputValue()).not.toBe("");
  });
});

describe("Update Item 버튼이 눌렸을 때", () => {
  const TEST_INPUT_VALUE = "oldItem";
  const TEST_UPDATE_VALUE = "updatedItem";

  let e;
  beforeEach(() => {
    initialize();
    e = {
      preventDefault: jest.fn(), // preventDefault 메서드를 가짐
      target: { value: "Sample Value" }, // target 속성을 가짐
    };
    // 1. "oldItem" item 등록
    setInputValue(TEST_INPUT_VALUE);
    shoppingListControl.onAddItemSubmit(e);

    // 2. "oldItem" item 업데이트 모드로 전환
    // "oldItem" item 객체 조회
    const filtered = getElementList().filter(
      (i) => i.textContent == TEST_INPUT_VALUE
    );
    // 그 아이템을 업데이트 모드로 변경
    filtered[0].click();
    setInputValue(TEST_UPDATE_VALUE);
  });

  test("저장된 아이템을 제거한다", () => {
    shoppingListControl.onAddItemSubmit(e);
    expect(shoppingListControl.getItemsFromStorage()).not.toContain(
      TEST_INPUT_VALUE
    );
  });

  test("아이템 편집 상태를 해제한다", () => {
    shoppingListControl.onAddItemSubmit(e);
    expect(shoppingListControl.isEditMode).toBe(false);
  });

  test("아이템을 저장한다", () => {
    shoppingListControl.onAddItemSubmit(e);
    expect(shoppingListControl.getItemsFromStorage()).toContain("updatedItem");
  });

  test("입력값을 지운다", () => {
    shoppingListControl.onAddItemSubmit(e);
    expect(getInputValue()).toBe("");
  });
});

//NOTE: william test case begin

describe("목록 아이템 추가", () => {
  beforeEach(() => {
    initialize();
  });
  const inputValue = "test-item";
  // addItemToDOM 함수 테스트
  test("아이템 DOM 생성", () => {
    // 새로운 아이템을 추가
    shoppingListControl.addDom(inputValue);

    // 아이템 목록에 해당 아이템이 추가되었는지 확인
    const itemList = getElementList();
    const itemButton = itemList[0].children[0];

    expect(itemList.length).toBe(1);
    expect(itemList[0].textContent).toBe(inputValue);

    expect(itemButton.className).toBe(BUTTON_REMOVE_CLASS_NAME);

    const icon = itemButton.children[0];
    expect(icon.classList.contains(...ICON_DELETE_CLASS_NAMES)).toBe(true);
  });

  test("로컬 스토리지 아이템 추가", () => {
    shoppingListControl.addStorage(inputValue);
    expect(shoppingListControl.storage.getItem()).toContain(inputValue);
  });
});

describe("목록 아이템 삭제", () => {
  const inputValue = "test-item";

  function getRemoveButton() {
    return getElementList()[0].querySelector("i");
  }

  beforeEach(() => {
    // confirm 함수를 jest.fn()으로 초기화
    global.confirm = jest.fn();
    initialize();
    shoppingListControl.addItem(inputValue);
  });

  test("삭제 취소를 누르면 목록에서 item 유지", () => {
    // confirm 함수가 항상 true를 반환하도록 설정
    global.confirm.mockReturnValueOnce(false);

    // 아이템 목록이 비어있는지 확인
    const itemList = getElementList();

    // 아이템을 DOM에서 유지
    getRemoveButton().click();
    expect(itemList.length).toBe(1);
    expect(itemList[0].textContent).toBe(inputValue);
  });

  test("삭제 취소를 누르면 로컬 스토리지에 유지", () => {
    global.confirm.mockReturnValueOnce(false);

    getRemoveButton().click();
    expect(shoppingListControl.storage.getItem()).toContain(inputValue);
  });

  //TODO: 확인 필요
  test("삭제 확인을 누르면 목록에서 item 삭제", () => {
    global.confirm.mockReturnValueOnce(true);

    const removeButton = getElementList()[0].querySelector("i");
    removeButton.click();
    expect(getElementList().length).toBe(0);
  });

  test("삭제 확인을 누르면 로컬 스토리지에서 삭제", () => {
    global.confirm.mockReturnValueOnce(true);

    getRemoveButton().click();
    expect(shoppingListControl.getItemsFromStorage()).not.toContain(inputValue);
  });
});

describe("clear all 버튼", () => {
  const inputValues = ["test1", "test2", "test3", "test4"];

  function getClearButton() {
    return document.getElementById(BUTTON_CLEAR_ID);
  }

  beforeEach(() => {
    inputValues.map((value) => shoppingListControl.addItem(value));
  });

  test("버튼 노출", () => {
    shoppingListControl.styleDisplayItems();
    expect(getClearButton().style.display).toBe("block");
  });

  test("버튼 클릭시 모든 아이템 삭제시 버튼 숨김", () => {
    const buttonClearAll = getClearButton();
    buttonClearAll.click();

    expect(getElementList().length).toBe(0);
    expect(buttonClearAll.style.display).toBe("none");
  });
});

describe("아이템 편집", () => {
  const inputValues = ["test1", "test2", "test3", "test4"];

  function getSubmitButton() {
    return document.querySelector('button[type="submit"]');
  }

  beforeEach(() => {
    initialize();
    inputValues.map((value) => shoppingListControl.addItem(value));
  });

  test("X버튼 외 버튼 영역 클릭시 편집 모드로 전환", () => {
    const item = getElementList()[1];
    item.click();

    expect(item.className).toContain("edit-mode");
    expect(shoppingListControl.isEditMode).toBe(true);
    expect(getInputValue()).toBe(item.textContent);
    expect(getSubmitButton().textContent.trim()).toBe("Update Item");
  });

  //TODO: 에러확인
  test("아이템 값 변경", () => {
    const itemList = getElementList();
    const buttonSubmit = getSubmitButton();
    const updateValue = "update test item";

    itemList[0].click();
    setInputValue(updateValue);
    buttonSubmit.click();

    expect(shoppingListControl.isEditMode).toBe(false);
    expect(itemList).toHaveLength(inputValues.length);
    expect(getElementList().at(-1).textContent).toBe(updateValue);
    expect(getSubmitButton().textContent.trim()).toBe("Add Item");
    expect(shoppingListControl.getItemsFromStorage()).toContain(updateValue);
  });

  test("빈 값을 업데이트 할 경우, 편집 모드 유지", () => {
    const itemList = getElementList();
    const buttonSubmit = getSubmitButton();

    itemList[0].click();
    setInputValue("");
    buttonSubmit.click();

    expect(shoppingListControl.isEditMode).toBe(true);
    expect(itemList).toHaveLength(inputValues.length);
    expect(buttonSubmit.textContent.trim()).toBe("Update Item");
  });

  test("편집모드 버튼을 다시 누르면 해제", () => {
    const itemList = getElementList();
    const buttonSubmit = getSubmitButton();

    itemList[0].click();
    buttonSubmit.click();

    expect(shoppingListControl.isEditMode).toBe(false);
    expect(buttonSubmit.textContent.trim()).toBe("Add Item");
    expect(getInputValue().length).toBe(0);
    expect(getElementList()[0].className).not.toContain("edit-mode");
  });
});

describe("이닛 후 아이템 목록", () => {
  const inputValues = ["test1", "test2", "test3", "test4"];

  beforeEach(() => {
    initialize();
    inputValues.map((value) => shoppingListControl.addStorage(value));
  });

  test("local에 저장된 아이템을 있는 겨웅 목록의 아이템을 보여준다", () => {
    document.addEventListener("DOMContentLoaded", () => {
      const itemList = getElementList();
      expect(itemList.length).toBe(inputValues.length);

      itemLis.forEach((element, index) => {
        expect(element.textContent).toBe(inputValues[index]);
      });
    });
  });
});

describe("Filter Items", () => {
  const inputValues = ["apple", "Orange", "Milk", "Test", "test123"];
  const getFilteredDomItems = () => {
    return getElementList().filter(({ style }) => style.display === "flex");
  };

  beforeEach(() => {
    initialize();
    inputValues.map((value) => shoppingListControl.addItem(value));
  });

  test("입력된 값이 포함된 아이템들 노출", () => {
    const searchingChar = "test";

    const e = {
      target: { value: searchingChar }, // target 속성을 가짐
    };

    shoppingListControl.filterItems(e);

    const filteredInput = inputValues.filter(
      (keyword) => keyword.toLocaleLowerCase().indexOf(searchingChar) !== -1
    );

    expect(filteredInput.length).toBe(getFilteredDomItems().length);
  });

  test("입력된 값과 일치하지 않는다면 목록 아이템 미노출", () => {
    const searchingChar = "bb";

    const e = {
      target: { value: searchingChar }, // target 속성을 가짐
    };

    shoppingListControl.filterItems(e);
    expect(getFilteredDomItems().length).toBe(0);
  });
});

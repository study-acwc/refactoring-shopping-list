import * as innerHTMLForTest from "./scriptTestHTMLSetup.js";
import * as script from "./script.js";

window.alert = jest.fn();

function initialize() {
  // 테스트 시작하기 전에 다른 테스트에서 설정한 값을 초기화하는 작업
  script.clearItems();
}

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
      (i) => i.textContent == "oldItem",
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

describe("Click Item 이벤트가 발생했을 때", () => {
  let mockSetItemToEdit;
  let mockRemoveItem;
  let script;
  beforeEach(() => {
    mockSetItemToEdit = jest.fn();
    mockRemoveItem = jest.fn();
    jest.mock(script, () => ({
      ...jest.requireActual("./script"),
      removeItem: mockRemoveItem,
    }));
    script = require("./script");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("remove-item 클래스가 클릭했을 때, removeItem 함수를 호출해야 한다", () => {
    const mockGrandParentElement = {
      textContent: "Mock Item Text",
      remove: jest.fn(),
    };
    const mockParentElement = {
      classList: {
        contains: jest.fn().mockReturnValue(true),
      },
      parentElement: mockGrandParentElement,
    };

    const mockEvent = {
      target: {
        parentElement: mockParentElement,
      },
    };
    const mockRemoveItemFromStorage = jest.fn();
    global.removeItemFromStorage = mockRemoveItemFromStorage;

    // confirm 함수도 모킹
    window.confirm = jest.fn().mockReturnValue(true);

    script.onClickItem(mockEvent);
    expect(mockRemoveItem).toHaveBeenCalled();
    expect(mockSetItemToEdit).not.toHaveBeenCalled();
    expect(mockGrandParentElement.remove).toHaveBeenCalled();
    // expect(mockRemoveItemFromStorage).toHaveBeenCalledWith("Mock Item Text");
  });
  it("li 요소가 클릭될 때 setItemToEdit를 호출해야 한다.", () => {
    const mockLiElement = document.createElement("li");
    mockLiElement.textContent = "Mock Item Text";
    const mockEvent = {
      target: {
        closest: jest.fn().mockReturnValue(mockLiElement),
        parentElement: {
          classList: {
            contains: jest.fn().mockReturnValue(false),
          },
        },
      },
    };

    script.onClickItem(mockEvent);

    expect(mockSetItemToEdit).toHaveBeenCalledWith("mockLiElement");
    expect(mockRemoveItem).not.toHaveBeenCalled();
  });
});

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
});

describe("아이템을 클릭했을 때", () => {
  let e;
  beforeEach(() => {
    initialize();
    e = {
      target: {
        parentElement: {
          classList: {
            contains: jest.fn().mockReturnValue(false),
            add: jest.fn(),
          },
          parentElement: {
            remove: jest.fn(),
          },
        },
        closest: jest.fn().mockReturnValue(true),
        classList: {
          add: jest.fn(),
        },
      },
      preventDefault: jest.fn(),
    };

    document.getElementById("item-input").value = "item1";
    script.onAddItemSubmit(e);
    script.addItemToDOM("item2");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("아이템을 누른경우 편집모드로 설정되어야 한다.", () => {
    e.target.parentElement.classList.contains.mockReturnValue(false);
    const setItemToEditSpy = jest.spyOn(script, "setItemToEdit");
    const itemElements = Array.from(script.itemList.querySelectorAll("li"));
    script.onClickItem(e);
    expect(script.isEditMode).toBe(true);
  });

  test("삭제 버튼을 누른경우 삭제되어야 한다.", () => {
    e.target.parentElement.classList.contains.mockReturnValue(true);
    const removeItemSpy = jest.spyOn(script, "removeItem");
    const itemElements = Array.from(script.itemList.querySelectorAll("li"));
    window.confirm = jest.fn(() => true);
    const itemList = document.getElementById("item-list");
    script.removeItem(itemList.children[0]);
    //script.onClickItem(e);
    script.removeItem(e.target.parentElement.parentElement); // 함수 호출

    expect(script.isEditMode).toBe(false);
  });

  test("삭제 버튼을 누른경우 값이 없는 경우", () => {
    e.target.parentElement.classList.contains.mockReturnValue(true);
    const removeItemSpy = jest.spyOn(script, "removeItem");
    const itemElements = Array.from(script.itemList.querySelectorAll("li"));
    window.confirm = jest.fn(() => true);

    script.onClickItem(e);
    script.removeItem(e.target.parentElement.parentElement); // 함수 호출
    expect(script.isEditMode).toBe(false);
  });
});

describe("아이템을 삭제했을 때", () => {
  let e;

  beforeEach(() => {
    initialize();
    e = {
      target: {
        parentElement: {
          classList: {
            contains: jest.fn().mockReturnValue(false),
            add: jest.fn(),
          },
          parentElement: {
            remove: jest.fn(),
          },
        },
        closest: jest.fn().mockReturnValue(true),
        classList: {
          add: jest.fn(),
        },
      },
      preventDefault: jest.fn(),
    };

    document.getElementById("item-input").value = "item1";
    script.onAddItemSubmit(e);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("beforeEach에 대한 테스트", () => {
    test("event 발생시 preventDefault를 호출한다", () => {
      expect(e.preventDefault).toHaveBeenCalled();
    });
    test("itemlist에 item1이 추가되어 있다", () => {
      const itemList = document.getElementById("item-list");
      expect(itemList.children.length).toBe(1);
      expect(itemList.textContent).toContain("item1");
    });
    test("item 삭제", () => {
      script.onClickItem(e);
      expect(script.setItemToEdit).toHaveBeenCalledTimes(1);
    });
    test("item 삭제confirm이되는경우", () => {
      window.confirm = jest.fn(() => true);
      e.target.parentElement.classList.contains.mockReturnValue(true);
      script.onClickItem(e);
      expect(script.removeItem).toHaveBeenCalledTimes(1);
    });
    test("item 삭제confirm이 안된경우", () => {
      window.confirm = jest.fn(() => false);
      e.target.parentElement.classList.contains.mockReturnValue(true);
      script.onClickItem(e);
      expect(script.removeItem).toHaveBeenCalledTimes(1);
    });
  });
});

describe("filterItems 함수 테스트", () => {
  beforeEach(() => {
    script.addItemToDOM("Item1");
    script.addItemToDOM("Item2");
  });

  test("입력된 텍스트와 일치하는 아이템만 표시한다", () => {
    const e = {
      target: {
        value: "item2",
      },
    };

    // filterItems 함수를 호출합니다.
    script.filterItems(e);
    const itemList = Array.from(script.itemList.querySelectorAll("li"));
    const filteredItems = itemList.filter(
      (i) =>
        i.textContent.toLowerCase().includes(e.target.value) &&
        i.style.display === "flex",
    );
    expect(filteredItems).toHaveLength(1);
  });
});

describe("displayItems 함수 테스트", () => {
  let e;
  beforeEach(() => {
    e = {
      target: {
        parentElement: {
          classList: {
            contains: jest.fn().mockReturnValue(false),
            add: jest.fn(),
          },
          parentElement: {
            remove: jest.fn(),
          },
        },
        closest: jest.fn().mockReturnValue(true),
        classList: {
          add: jest.fn(),
        },
      },
      preventDefault: jest.fn(),
    };

    jest
      .spyOn(script, "getItemsFromStorage")
      .mockReturnValue(["Item1", "Item2"]);
    jest.spyOn(script, "addItemToDOM");
    jest.spyOn(script, "checkUI");
    script.onClickItem(e);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("아이템이 올바르게 표시되는지 확인", () => {
    script.displayItems();
    expect(script.addItemToDOM).toHaveBeenCalledTimes(2);
    expect(script.addItemToDOM).toHaveBeenCalledWith("Item1");
    expect(script.addItemToDOM).toHaveBeenCalledWith("Item2");
    expect(script.checkUI).toHaveBeenCalled();
  });
});
describe("checkIfItemExists", () => {
  test("스토리지에 item이 있는경우 true 리턴", () => {
    script.getItemsFromStorage = jest.fn(() => ["item1", "item2", "item3"]);

    const itemExists = script.checkIfItemExists("item2");
    expect(itemExists).toBe(true);
  });

  test("스토리지에 item이없는경우 true 리턴", () => {
    script.getItemsFromStorage = jest.fn(() => ["item1", "item2", "item3"]);

    const itemExists = script.checkIfItemExists("item4");
    expect(itemExists).toBe(false);
  });
});

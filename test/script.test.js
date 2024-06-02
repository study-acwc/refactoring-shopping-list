import * as innerHTMLForTest from "./scriptTestHTMLSetup.js";
import Storage from "../src/storage/Storage.js";
import UI from "../src/ui/UI.js";
import Item from "../src/models/Item.js";
import EventHandler from "../src/event/eventHandler.js";

window.alert = jest.fn();
UI.init();
function initialize() {
  // 테스트 시작하기 전에 다른 테스트에서 설정한 값을 초기화하는 작업
  EventHandler.handleClearItems();
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
    EventHandler.handleAddItemSubmit(e);
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
    EventHandler.handleAddItemSubmit(e);

    const items = JSON.parse(localStorage.getItem("items"));
    expect(items).toContain("item1");
  });

  test("입력값을 지운다.", () => {
    EventHandler.handleAddItemSubmit(e);
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
    EventHandler.handleAddItemSubmit(e);

    const items = JSON.parse(localStorage.getItem("items"));
    const filteredItems = items.filter((item) => item === "item1");
    expect(filteredItems).toHaveLength(1);
  });

  test("입력값을 지우지 않는다", () => {
    EventHandler.handleAddItemSubmit(e);
    expect(document.getElementById("item-input").value).not.toBe("");
  });
});

describe("Update Item 버튼이 눌렸을 때", () => {
  let e;
  let filtered;
  beforeEach(() => {
    initialize();
    e = {
      preventDefault: jest.fn(), // preventDefault 메서드를 가짐
      target: { value: "Sample Value" }, // target 속성을 가짐
    };

    document.getElementById("item-input").value = "oldItem";
    EventHandler.handleAddItemSubmit(e);
    const itemListChildren = document.querySelector("#item-list").children;
    filtered = Array.from(itemListChildren).find(
      (node) => node.textContent.trim() === "oldItem",
    );

    UI.setItemToEdit(filtered);
    document.getElementById("item-input").value = "updatedItem";
  });

  test("저장된 아이템을 제거한다", () => {
    EventHandler.handleAddItemSubmit(e);
    const items = JSON.parse(localStorage.getItem("items"));
    expect(items).not.toContain("oldItem");
  });

  test("아이템 편집 상태를 해제한다", () => {
    EventHandler.handleAddItemSubmit(e);
    expect(UI.isEditMode).toBe(false);
  });
});

describe("아이템을 클릭했을 때", () => {
  let e;
  let setItemToEditSpy;
  let itemElements;
  let confirmRemoveItemSpy;
  let itemList;
  let removeItemSpy;

  beforeEach(() => {
    initialize();
    e = {
      target: {
        parentElement: {
          classList: {
            contains: jest.fn(),
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
    EventHandler.handleAddItemSubmit(e);
    UI.addItemToDOM("item2");
    global.confirm = jest.fn().mockReturnValue(true);

    itemList = document.getElementById("item-list");
    itemElements = Array.from(itemList.querySelectorAll("li"));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("아이템을 누른경우 편집모드로 설정되어야 한다.", () => {
    e.target.parentElement.classList.contains.mockReturnValue(false);
    setItemToEditSpy = jest.spyOn(UI, "setItemToEdit");
    EventHandler.handleClickItem(e);
    expect(UI.isEditMode).toBe(true);
    expect(setItemToEditSpy).toHaveBeenCalledTimes(1);
  });

  test("삭제 버튼을 누른경우 삭제되어야 한다.", () => {
    e.target.parentElement.classList.contains.mockReturnValue(true);
    removeItemSpy = jest.spyOn(Item, "remove");
    Item.remove(itemList.children[0]);
    expect(UI.isEditMode).toBe(false);
  });
  test("삭제 버튼을 누른경우 취소하면 삭제되지 않는다.", () => {
    e.target.parentElement.classList.contains.mockReturnValue(true);
    confirmRemoveItemSpy = jest.spyOn(Item, "confirmRemoveItem");
    Item.remove(itemList.children[0]);
    expect(confirmRemoveItemSpy).toHaveBeenCalledTimes(1);
  });

  test("삭제 버튼을 누른경우 값이 없는 경우", () => {
    e.target.parentElement.classList.contains.mockReturnValue(true);

    EventHandler.handleClickItem(e);
    Item.remove(e.target.parentElement.parentElement); // 함수 호출
    expect(UI.isEditMode).toBe(false);
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
    EventHandler.handleAddItemSubmit(e);
    global.confirm = jest.fn(() => false);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
      EventHandler.handleClickItem(e);
      expect(UI.setItemToEdit).toHaveBeenCalledTimes(1);
    });
    test("item 삭제confirm이되는경우", () => {
      global.confirm = jest.fn(() => true);
      e.target.parentElement.classList.contains.mockReturnValue(true);
      EventHandler.handleClickItem(e);
      expect(Item.remove).toHaveBeenCalledTimes(1);
    });
    test("item 삭제confirm이 안된경우", () => {
      e.target.parentElement.classList.contains.mockReturnValue(true);
      EventHandler.handleClickItem(e);
      expect(Item.remove).toHaveBeenCalledTimes(1);
    });
  });
});

describe("filterItems 함수 테스트", () => {
  beforeEach(() => {
    UI.addItemToDOM("Item1");
    UI.addItemToDOM("Item2");
  });

  test("입력된 텍스트와 일치하는 아이템만 표시한다", () => {
    const e = {
      target: {
        value: "item2",
      },
    };

    EventHandler.handleFilterItems(e);
    const itemList = Array.from(document.getElementById("item-list"));
    console.log("itemList", itemList);

    const itemListChildren = document.querySelector("#item-list").children;
    const filteredItems = Array.from(itemListChildren).filter(
      (node) =>
        node.textContent.toLowerCase().includes(e.target.value) &&
        node.style.display === "flex",
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

    jest.spyOn(Storage, "getItems").mockReturnValue(["Item1", "Item2"]);
    jest.spyOn(UI, "addItemToDOM");
    jest.spyOn(UI, "checkUI");
    EventHandler.handleClickItem(e);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("아이템이 올바르게 표시되는지 확인", () => {
    EventHandler.handleDisplayItems();
    expect(UI.addItemToDOM).toHaveBeenCalledTimes(2);
    expect(UI.addItemToDOM).toHaveBeenCalledWith("Item1");
    expect(UI.addItemToDOM).toHaveBeenCalledWith("Item2");
    expect(UI.checkUI).toHaveBeenCalled();
  });
});
describe("checkIfItemExists", () => {
  test("스토리지에 item이 있는경우 true 리턴", () => {
    Storage.getItems = jest.fn(() => ["item1", "item2", "item3"]);

    const itemExists = Item.isExists("item2");
    expect(itemExists).toBe(true);
  });

  test("스토리지에 item이없는경우 true 리턴", () => {
    Storage.getItems = jest.fn(() => ["item1", "item2", "item3"]);

    const itemExists = Item.isExists("item4");
    expect(itemExists).toBe(false);
  });
});

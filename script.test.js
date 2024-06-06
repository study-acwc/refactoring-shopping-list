import * as innerHTMLForTest from './scriptTestHTMLSetup.js';
import * as script from './script.js';
import * as elements from './elements.js';
import * as storage from './storage.js';

window.alert = jest.fn();
let ctrl;
let model;
let view;

beforeEach(() => {
  view = new script.ShoppingListPage();
  model = new storage.Storage('items');
  ctrl = new script.ShoppingListPageController(
    view,
    model
  );
  ctrl.launchUI();
});

beforeEach(() => {
  ctrl.onClickClearAll();
});

describe('Add Item 버튼이 눌렸을 때, 입력값이 없으면', () => {
    let newItemTitle;
    beforeEach(() => {
        newItemTitle = '';
    });

    test('아이템을 저장하지 않는다', () => {
        ctrl.onAddItemSubmit(newItemTitle);

        expect(global.document.documentElement.innerHTML).toMatchInlineSnapshot(`
"<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer">
    <link rel="stylesheet" href="style.css">
    <title>Shopping List</title>
  </head>
  <body>
    <div class="container">
      <header>
        <img src="images/note.png" alt="">
        <h1>Shopping List</h1>
      </header>
      <form id="item-form">
        <div class="form-control">
          <input type="text" class="form-input" id="item-input" name="item" placeholder="Enter Item">
        </div>
        <div class="form-control">
          <button type="submit" class="btn" style="background-color: rgb(51, 51, 51);"><i class="fa-solid fa-plus"></i> Add Item</button>
        </div>
      </form>

      <div class="filter">
        <input type="text" class="form-input-filter" id="filter" placeholder="Filter Items" style="display: none;">
      </div>

      <ul id="item-list" class="items"></ul>

      <button id="clear" class="btn-clear" style="display: none;">Clear All</button>
    </div>

    <script type="module" src="script.js"></script>
  

</body>"
`);
    });
});

describe('Add Item 버튼이 눌렸을 때, 입력값이 있고 기존에 없는 값이면', () => {
    let inputValue;
    let editingItemTitle;
    beforeEach(() => {
        inputValue = 'item1';
        ctrl.onAddItemSubmit('item2');
        ctrl.onAddItemSubmit('item3');
    });

    test('아이템을 저장하고, 화면에 새로운 아이템을 표시하고, 입력값을 지운다.', () => {
        ctrl.onAddItemSubmit(inputValue);

        expect(global.document.documentElement.innerHTML).toMatchInlineSnapshot(`
"<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer">
    <link rel="stylesheet" href="style.css">
    <title>Shopping List</title>
  </head>
  <body>
    <div class="container">
      <header>
        <img src="images/note.png" alt="">
        <h1>Shopping List</h1>
      </header>
      <form id="item-form">
        <div class="form-control">
          <input type="text" class="form-input" id="item-input" name="item" placeholder="Enter Item">
        </div>
        <div class="form-control">
          <button type="submit" class="btn" style="background-color: rgb(51, 51, 51);"><i class="fa-solid fa-plus"></i> Add Item</button>
        </div>
      </form>

      <div class="filter">
        <input type="text" class="form-input-filter" id="filter" placeholder="Filter Items" style="display: block;">
      </div>

      <ul id="item-list" class="items"><li>item2<button class="remove-item btn-link text-red"><i class="fa-solid fa-xmark"></i></button></li><li>item3<button class="remove-item btn-link text-red"><i class="fa-solid fa-xmark"></i></button></li><li>item1<button class="remove-item btn-link text-red"><i class="fa-solid fa-xmark"></i></button></li></ul>

      <button id="clear" class="btn-clear" style="display: block;">Clear All</button>
    </div>

    <script type="module" src="script.js"></script>
  

</body>"
`);
    });
});

describe('Add Item 버튼이 눌렸을 때, 입력값이 있고 동일한 아이템이 이미 존재하면', () => {
    let inputValue;
    beforeEach(() => {
        inputValue = 'item1';
        ctrl.onAddItemSubmit(inputValue);
    });

    test('아이템을 중복 저장하지 않고, 입력값을 지우지 않는다', () => {
        ctrl.onAddItemSubmit(inputValue);

        expect(global.document.documentElement.innerHTML).toMatchInlineSnapshot(`
"<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer">
    <link rel="stylesheet" href="style.css">
    <title>Shopping List</title>
  </head>
  <body>
    <div class="container">
      <header>
        <img src="images/note.png" alt="">
        <h1>Shopping List</h1>
      </header>
      <form id="item-form">
        <div class="form-control">
          <input type="text" class="form-input" id="item-input" name="item" placeholder="Enter Item">
        </div>
        <div class="form-control">
          <button type="submit" class="btn" style="background-color: rgb(51, 51, 51);"><i class="fa-solid fa-plus"></i> Add Item</button>
        </div>
      </form>

      <div class="filter">
        <input type="text" class="form-input-filter" id="filter" placeholder="Filter Items" style="display: block;">
      </div>

      <ul id="item-list" class="items"><li>item1<button class="remove-item btn-link text-red"><i class="fa-solid fa-xmark"></i></button></li></ul>

      <button id="clear" class="btn-clear" style="display: block;">Clear All</button>
    </div>

    <script type="module" src="script.js"></script>
  

</body>"
`);
    });
});

describe('Update Item 버튼이 눌렸을 때, 입력값이 없으면', () => {
  let itemTitle;
  let updatedItemTitle;
  beforeEach(() => {
    itemTitle = 'oldItem';
    updatedItemTitle = '';
    // 1
    ctrl.onAddItemSubmit(itemTitle);
    // 2
    ctrl.onClickItemContents(itemTitle);
  });

  test('업데이트 액션을 수행하지 않는다', () => {
      ctrl.onUpdateItemSubmit(itemTitle, updatedItemTitle);

      expect(global.document.documentElement.innerHTML).toMatchInlineSnapshot(`
"<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer">
    <link rel="stylesheet" href="style.css">
    <title>Shopping List</title>
  </head>
  <body>
    <div class="container">
      <header>
        <img src="images/note.png" alt="">
        <h1>Shopping List</h1>
      </header>
      <form id="item-form">
        <div class="form-control">
          <input type="text" class="form-input" id="item-input" name="item" placeholder="Enter Item">
        </div>
        <div class="form-control">
          <button type="submit" class="btn" style="background-color: rgb(34, 139, 34);"><i class="fa-solid fa-pen"></i>   Update Item</button>
        </div>
      </form>

      <div class="filter">
        <input type="text" class="form-input-filter" id="filter" placeholder="Filter Items" style="display: block;">
      </div>

      <ul id="item-list" class="items"><li class="edit-mode">oldItem<button class="remove-item btn-link text-red"><i class="fa-solid fa-xmark"></i></button></li></ul>

      <button id="clear" class="btn-clear" style="display: block;">Clear All</button>
    </div>

    <script type="module" src="script.js"></script>
  

</body>"
`)
  });
});

describe('Update Item 버튼이 눌렸을 때, 입력값이 있으면', () => {
    let itemTitle;
    let updatedItemTitle;
    beforeEach(() => {
      itemTitle = 'oldItem';
      updatedItemTitle = 'updatedItem';
      // 1
      ctrl.onAddItemSubmit(itemTitle);
      // 2
      ctrl.onClickItemContents(itemTitle);
    });

    test('저장된 아이템을 제거하고, 화면에서 해당 아이템을 제거하고, 아이템 편집 상태를 해제하고, 새로운 아이템을 저장하고, 화면에 새로운 아이템을 표시하고, 입력값을 지운다', () => {
        ctrl.onUpdateItemSubmit(itemTitle, updatedItemTitle);

        expect(global.document.documentElement.innerHTML).toMatchInlineSnapshot(`
"<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer">
    <link rel="stylesheet" href="style.css">
    <title>Shopping List</title>
  </head>
  <body>
    <div class="container">
      <header>
        <img src="images/note.png" alt="">
        <h1>Shopping List</h1>
      </header>
      <form id="item-form">
        <div class="form-control">
          <input type="text" class="form-input" id="item-input" name="item" placeholder="Enter Item">
        </div>
        <div class="form-control">
          <button type="submit" class="btn" style="background-color: rgb(51, 51, 51);"><i class="fa-solid fa-plus"></i> Add Item</button>
        </div>
      </form>

      <div class="filter">
        <input type="text" class="form-input-filter" id="filter" placeholder="Filter Items" style="display: block;">
      </div>

      <ul id="item-list" class="items"><li>updatedItem<button class="remove-item btn-link text-red"><i class="fa-solid fa-xmark"></i></button></li></ul>

      <button id="clear" class="btn-clear" style="display: block;">Clear All</button>
    </div>

    <script type="module" src="script.js"></script>
  

</body>"
`);
    });
});

describe('아이템 영역이 눌렸을 때, 삭제 버튼 영역 안이였다면', () => {
  let itemTitle;

  beforeEach(() => {;
    itemTitle = 'item1';
    // 1
    ctrl.onAddItemSubmit(itemTitle);
    // 2
    global.confirm = jest.fn();
  });

  test('삭제 여부 확인 창을 띄운다', () => {
    ctrl.onClickItemDeleteButton(itemTitle);

    expect(global.document.documentElement.innerHTML).toMatchInlineSnapshot(`
"<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer">
    <link rel="stylesheet" href="style.css">
    <title>Shopping List</title>
  </head>
  <body>
    <div class="container">
      <header>
        <img src="images/note.png" alt="">
        <h1>Shopping List</h1>
      </header>
      <form id="item-form">
        <div class="form-control">
          <input type="text" class="form-input" id="item-input" name="item" placeholder="Enter Item">
        </div>
        <div class="form-control">
          <button type="submit" class="btn" style="background-color: rgb(51, 51, 51);"><i class="fa-solid fa-plus"></i> Add Item</button>
        </div>
      </form>

      <div class="filter">
        <input type="text" class="form-input-filter" id="filter" placeholder="Filter Items" style="display: block;">
      </div>

      <ul id="item-list" class="items"><li>item1<button class="remove-item btn-link text-red"><i class="fa-solid fa-xmark"></i></button></li></ul>

      <button id="clear" class="btn-clear" style="display: block;">Clear All</button>
    </div>

    <script type="module" src="script.js"></script>
  

</body>"
`);
  });
});

describe('아이템 영역이 눌렸을 때, 삭제 버튼 영역 바깥쪽이었다면', () => {
  let itemTitle;
  beforeEach(() => {
    itemTitle = 'item1';
    // 1
    ctrl.onAddItemSubmit(itemTitle);
  });

  test('아이템 편집 상태를 활성화하고, 해당 아이템을 편집 모드로 표시하고, 해당되지 않는 아이템은 편집 모드로 표시하지 않고, 검색어 입력창을 편집할 아이템의 텍스트로 채운다', () => {
    ctrl.onClickItemContents(itemTitle);

    expect(global.document.documentElement.innerHTML).toMatchInlineSnapshot(`
"<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer">
    <link rel="stylesheet" href="style.css">
    <title>Shopping List</title>
  </head>
  <body>
    <div class="container">
      <header>
        <img src="images/note.png" alt="">
        <h1>Shopping List</h1>
      </header>
      <form id="item-form">
        <div class="form-control">
          <input type="text" class="form-input" id="item-input" name="item" placeholder="Enter Item">
        </div>
        <div class="form-control">
          <button type="submit" class="btn" style="background-color: rgb(34, 139, 34);"><i class="fa-solid fa-pen"></i>   Update Item</button>
        </div>
      </form>

      <div class="filter">
        <input type="text" class="form-input-filter" id="filter" placeholder="Filter Items" style="display: block;">
      </div>

      <ul id="item-list" class="items"><li class="edit-mode">item1<button class="remove-item btn-link text-red"><i class="fa-solid fa-xmark"></i></button></li></ul>

      <button id="clear" class="btn-clear" style="display: block;">Clear All</button>
    </div>

    <script type="module" src="script.js"></script>
  

</body>"
`);
  });
});


describe('삭제 여부 확인 창에서 취소 버튼이 눌렸을 때', () => {
  let itemTitle;

  beforeEach(() => {
    itemTitle = 'item1';
    // 1
    ctrl.onAddItemSubmit(itemTitle);
    // 2
    global.confirm = jest.fn().mockReturnValue(false);
  });

  test('아이템을 저장소에서 제거하지 않고, 아이템을 DOM에서 제거하지 않는다', () => {
    ctrl.onClickItemDeleteButton(itemTitle);

   expect(global.document.documentElement.innerHTML).toMatchInlineSnapshot(`
"<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer">
    <link rel="stylesheet" href="style.css">
    <title>Shopping List</title>
  </head>
  <body>
    <div class="container">
      <header>
        <img src="images/note.png" alt="">
        <h1>Shopping List</h1>
      </header>
      <form id="item-form">
        <div class="form-control">
          <input type="text" class="form-input" id="item-input" name="item" placeholder="Enter Item">
        </div>
        <div class="form-control">
          <button type="submit" class="btn" style="background-color: rgb(51, 51, 51);"><i class="fa-solid fa-plus"></i> Add Item</button>
        </div>
      </form>

      <div class="filter">
        <input type="text" class="form-input-filter" id="filter" placeholder="Filter Items" style="display: block;">
      </div>

      <ul id="item-list" class="items"><li>item1<button class="remove-item btn-link text-red"><i class="fa-solid fa-xmark"></i></button></li></ul>

      <button id="clear" class="btn-clear" style="display: block;">Clear All</button>
    </div>

    <script type="module" src="script.js"></script>
  

</body>"
`);

  });
});

describe('삭제 여부 확인 창에서 확인 버튼이 눌렸을 때, 아이템이 하나이면', () => {
  let itemTitle;

  beforeEach(() => {
    itemTitle = 'item1';
    // 1
    ctrl.onAddItemSubmit(itemTitle);
    // 2
    ctrl.onClickItemContents(itemTitle);
    // 3
    global.confirm = jest.fn().mockReturnValue(true);
  });

  test('아이템을 저장소에서 제거하고, 필터링 영역을 표시하지 않고, 전체 삭제 버튼을 표시하지 않는다', () => {
    ctrl.onClickItemDeleteButton(itemTitle);

    expect(global.document.documentElement.innerHTML).toMatchInlineSnapshot(`
"<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer">
    <link rel="stylesheet" href="style.css">
    <title>Shopping List</title>
  </head>
  <body>
    <div class="container">
      <header>
        <img src="images/note.png" alt="">
        <h1>Shopping List</h1>
      </header>
      <form id="item-form">
        <div class="form-control">
          <input type="text" class="form-input" id="item-input" name="item" placeholder="Enter Item">
        </div>
        <div class="form-control">
          <button type="submit" class="btn" style="background-color: rgb(51, 51, 51);"><i class="fa-solid fa-plus"></i> Add Item</button>
        </div>
      </form>

      <div class="filter">
        <input type="text" class="form-input-filter" id="filter" placeholder="Filter Items" style="display: none;">
      </div>

      <ul id="item-list" class="items"></ul>

      <button id="clear" class="btn-clear" style="display: none;">Clear All</button>
    </div>

    <script type="module" src="script.js"></script>
  

</body>"
`);
  });
});

describe('삭제 여부 확인 창에서 확인 버튼이 눌렸을 때, 아이템이 두 개이면', () => {
  let itemTitle1;

  beforeEach(() => {
    itemTitle1 = 'item1';
    // 1
    ctrl.onAddItemSubmit(itemTitle1);
    ctrl.onAddItemSubmit('item2');
    // 2
    global.confirm = jest.fn().mockReturnValue(true);
  });

  test('아이템을 저장소에서 제거하고, 필터링 영역을 표시하고, 전체 삭제 버튼을 표시한다', () => {
    ctrl.onClickItemDeleteButton(itemTitle1);

    expect(global.document.documentElement.innerHTML).toMatchInlineSnapshot(`
"<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer">
    <link rel="stylesheet" href="style.css">
    <title>Shopping List</title>
  </head>
  <body>
    <div class="container">
      <header>
        <img src="images/note.png" alt="">
        <h1>Shopping List</h1>
      </header>
      <form id="item-form">
        <div class="form-control">
          <input type="text" class="form-input" id="item-input" name="item" placeholder="Enter Item">
        </div>
        <div class="form-control">
          <button type="submit" class="btn" style="background-color: rgb(51, 51, 51);"><i class="fa-solid fa-plus"></i> Add Item</button>
        </div>
      </form>

      <div class="filter">
        <input type="text" class="form-input-filter" id="filter" placeholder="Filter Items" style="display: block;">
      </div>

      <ul id="item-list" class="items"><li>item2<button class="remove-item btn-link text-red"><i class="fa-solid fa-xmark"></i></button></li></ul>

      <button id="clear" class="btn-clear" style="display: block;">Clear All</button>
    </div>

    <script type="module" src="script.js"></script>
  

</body>"
`);
  });
});

describe('검색어를 입력했을 때', () => {
  let searchKeyword;
  let searchKeywordEvent;
  beforeEach(() => {
    // 1
    ctrl.onAddItemSubmit('notebook');
    ctrl.onAddItemSubmit('ipad');
    // 2
    searchKeyword = 'note';
    searchKeywordEvent = {
      preventDefault: jest.fn(),
      target: { value: searchKeyword }
    };
  });

  test('검색 결과에 해당하는 아이템을 표시하고, 검색 결과에 해당하지 않는 아이템은 표시하지 않는다', () => {
    ctrl.onEditingInput(searchKeywordEvent);

    expect(global.document.documentElement.innerHTML).toMatchInlineSnapshot(`
"<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer">
    <link rel="stylesheet" href="style.css">
    <title>Shopping List</title>
  </head>
  <body>
    <div class="container">
      <header>
        <img src="images/note.png" alt="">
        <h1>Shopping List</h1>
      </header>
      <form id="item-form">
        <div class="form-control">
          <input type="text" class="form-input" id="item-input" name="item" placeholder="Enter Item">
        </div>
        <div class="form-control">
          <button type="submit" class="btn" style="background-color: rgb(51, 51, 51);"><i class="fa-solid fa-plus"></i> Add Item</button>
        </div>
      </form>

      <div class="filter">
        <input type="text" class="form-input-filter" id="filter" placeholder="Filter Items" style="display: block;">
      </div>

      <ul id="item-list" class="items"><li style="display: flex;">notebook<button class="remove-item btn-link text-red"><i class="fa-solid fa-xmark"></i></button></li><li style="display: none;">ipad<button class="remove-item btn-link text-red"><i class="fa-solid fa-xmark"></i></button></li></ul>

      <button id="clear" class="btn-clear" style="display: block;">Clear All</button>
    </div>

    <script type="module" src="script.js"></script>
  

</body>"
`);
  });
});

describe('Clear All 버튼이 눌렸을 때', () => {
  beforeEach(() => {
    model.saveAllItems(['item1', 'item2']);
  });

  test('모든 아이템을 저장소에서 제거한다', () => {
    ctrl.onClickClearAll();

    expect(global.document.documentElement.innerHTML).toMatchInlineSnapshot(`
"<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer">
    <link rel="stylesheet" href="style.css">
    <title>Shopping List</title>
  </head>
  <body>
    <div class="container">
      <header>
        <img src="images/note.png" alt="">
        <h1>Shopping List</h1>
      </header>
      <form id="item-form">
        <div class="form-control">
          <input type="text" class="form-input" id="item-input" name="item" placeholder="Enter Item">
        </div>
        <div class="form-control">
          <button type="submit" class="btn" style="background-color: rgb(51, 51, 51);"><i class="fa-solid fa-plus"></i> Add Item</button>
        </div>
      </form>

      <div class="filter">
        <input type="text" class="form-input-filter" id="filter" placeholder="Filter Items" style="display: none;">
      </div>

      <ul id="item-list" class="items"></ul>

      <button id="clear" class="btn-clear" style="display: none;">Clear All</button>
    </div>

    <script type="module" src="script.js"></script>
  

</body>"
`);
  });

  test('모든 아이템을 화면에서 제거한다', () => {
    ctrl.onClickClearAll();

    expect(global.document.documentElement.innerHTML).toMatchInlineSnapshot(`
"<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer">
    <link rel="stylesheet" href="style.css">
    <title>Shopping List</title>
  </head>
  <body>
    <div class="container">
      <header>
        <img src="images/note.png" alt="">
        <h1>Shopping List</h1>
      </header>
      <form id="item-form">
        <div class="form-control">
          <input type="text" class="form-input" id="item-input" name="item" placeholder="Enter Item">
        </div>
        <div class="form-control">
          <button type="submit" class="btn" style="background-color: rgb(51, 51, 51);"><i class="fa-solid fa-plus"></i> Add Item</button>
        </div>
      </form>

      <div class="filter">
        <input type="text" class="form-input-filter" id="filter" placeholder="Filter Items" style="display: none;">
      </div>

      <ul id="item-list" class="items"></ul>

      <button id="clear" class="btn-clear" style="display: none;">Clear All</button>
    </div>

    <script type="module" src="script.js"></script>
  

</body>"
`);
  });
});

describe('Dom Content가 로드되었을 때', () => {

  beforeEach(() => {
    model.saveAllItems(['item1', 'item2']);
  });

  test('저장된 아이템을 화면에 표시하고, 입력필드가 비어있어야 허고, 아이템 편집상태가 아니어야 한다', () => {
    ctrl.onDOMContentLoad();
    
    expect(global.document.documentElement.innerHTML).toMatchInlineSnapshot(`
"<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer">
    <link rel="stylesheet" href="style.css">
    <title>Shopping List</title>
  </head>
  <body>
    <div class="container">
      <header>
        <img src="images/note.png" alt="">
        <h1>Shopping List</h1>
      </header>
      <form id="item-form">
        <div class="form-control">
          <input type="text" class="form-input" id="item-input" name="item" placeholder="Enter Item">
        </div>
        <div class="form-control">
          <button type="submit" class="btn" style="background-color: rgb(51, 51, 51);"><i class="fa-solid fa-plus"></i> Add Item</button>
        </div>
      </form>

      <div class="filter">
        <input type="text" class="form-input-filter" id="filter" placeholder="Filter Items" style="display: block;">
      </div>

      <ul id="item-list" class="items"><li>item1<button class="remove-item btn-link text-red"><i class="fa-solid fa-xmark"></i></button></li><li>item2<button class="remove-item btn-link text-red"><i class="fa-solid fa-xmark"></i></button></li></ul>

      <button id="clear" class="btn-clear" style="display: block;">Clear All</button>
    </div>

    <script type="module" src="script.js"></script>
  

</body>"
`);
  });
});
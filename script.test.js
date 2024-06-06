import * as innerHTMLForTest from './scriptTestHTMLSetup.js';
import { controller } from './script.js';
import * as elements from './elements.js';

window.alert = jest.fn();

beforeEach(() => {
  controller.onClickClearAll();
});

describe('Add Item 버튼이 눌렸을 때, 입력값이 없으면', () => {
    let newItemTitle;
    beforeEach(() => {
        newItemTitle = '';
    });

    test('아이템을 저장하지 않는다', () => {
        controller.onAddItemSubmit(newItemTitle);

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
        controller.onAddItemSubmit('item2');
        controller.onAddItemSubmit('item3');
    });

    test('아이템을 저장하고, 화면에 새로운 아이템을 표시하고, 입력값을 지운다.', () => {
        controller.onAddItemSubmit(inputValue);

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
        controller.onAddItemSubmit(inputValue);
    });

    test('아이템을 중복 저장하지 않고, 입력값을 지우지 않는다', () => {
        controller.onAddItemSubmit(inputValue);

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

describe('Update Item 버튼이 눌렸을 때', () => {
    let itemTitle;
    let updatedItemTitle;
    beforeEach(() => {
      itemTitle = 'oldItem';
      updatedItemTitle = 'updatedItem';
      // 1
      controller.onAddItemSubmit(itemTitle);
      // 2
      controller.onClickItemContents(itemTitle);
    });

    test('저장된 아이템을 제거하고, 화면에서 해당 아이템을 제거하고, 아이템 편집 상태를 해제하고, 새로운 아이템을 저장하고, 화면에 새로운 아이템을 표시하고, 입력값을 지운다', () => {
        controller.onUpdateItemSubmit(itemTitle, updatedItemTitle);

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
    controller.onAddItemSubmit(itemTitle);
    // 2
    global.confirm = jest.fn();
  });

  test('삭제 여부 확인 창을 띄운다', () => {
    controller.onClickItemDeleteButton(itemTitle);

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
    controller.onAddItemSubmit(itemTitle);
  });

  test('아이템 편집 상태를 활성화하고, 해당 아이템을 편집 모드로 표시하고, 해당되지 않는 아이템은 편집 모드로 표시하지 않고, 검색어 입력창을 편집할 아이템의 텍스트로 채운다', () => {
    controller.onClickItemContents(itemTitle);

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

describe('삭제 여부 확인 창에서 확인 버튼이 눌렸을 때, 아이템이 하나이면', () => {
  let itemTitle;

  beforeEach(() => {
    itemTitle = 'item1';
    // 1
    controller.onAddItemSubmit(itemTitle);
    // 2
    controller.onClickItemContents(itemTitle);
  });

  test('아이템을 저장소에서 제거하고, 필터링 영역을 표시하지 않고, 전체 삭제 버튼을 표시하지 않는다', () => {
    controller.onItemRemovalConfirmed(itemTitle);

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
    controller.onAddItemSubmit(itemTitle1);
    controller.onAddItemSubmit('item2');
  });

  test('아이템을 저장소에서 제거하고, 필터링 영역을 표시하고, 전체 삭제 버튼을 표시한다', () => {
    controller.onItemRemovalConfirmed(itemTitle1);

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
    controller.onAddItemSubmit('notebook');
    controller.onAddItemSubmit('ipad');
    // 2
    searchKeyword = 'note';
    searchKeywordEvent = {
      preventDefault: jest.fn(),
      target: { value: searchKeyword }
    };
  });

  test('검색 결과에 해당하는 아이템을 표시하고, 검색 결과에 해당하지 않는 아이템은 표시하지 않는다', () => {
    controller.onEditingInput(searchKeywordEvent);

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
    controller.aStorage.saveAllItems(['item1', 'item2']);
  });

  test('모든 아이템을 저장소에서 제거한다', () => {
    controller.onClickClearAll();

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
    controller.onClickClearAll();

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
    controller.aStorage.saveAllItems(['item1', 'item2']);
  });

  test('저장된 아이템을 화면에 표시하고, 입력필드가 비어있어야 허고, 아이템 편집상태가 아니어야 한다', () => {
    controller.onDOMContentLoad();
    
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
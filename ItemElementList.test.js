import * as elements from './elements.js';

let sut;
let itemList;
let textContentsList;

beforeEach(() => {
    itemList = document.createElement('ul');
    itemList.id = 'item-list';
    itemList.className = 'items';
    textContentsList = ['Apples', 'Orange Juice', 'Oreos', 'Milk'];
    itemList.innerHTML = createInnerHTML(textContentsList);

    sut = new elements.ItemElementList(itemList);
});

describe('itemWith 함수가 호출됐을 때, textContent에 해당하는 아이템이 있으면', () => {
    let textContent;
    let expectedItem;
    beforeEach(() => {
        textContent = textContentsList[0];
        expectedItem = Array.from(itemList.children)
            .find(li => li.firstChild.textContent.trim() === textContent);
    });

    test('아이템을 리턴한다', () => {
        const item = sut.itemWith(textContent);

        expect(item).toBe(expectedItem);
    });
});

describe('itemWith 함수가 호출됐을 때, textContent에 해당하는 아이템이 없으면', () => {
    let textContent;

    beforeEach(() => {
        textContent = 'non-existing-item';
    });

    test('null을 리턴한다', () => {
        const textContent = 'non-existing-item';

        const item = sut.itemWith(textContent);

        expect(item).toBeNull();
    });
});

describe('toggleEditModeForSingleItem 함수가 호출됐을 때', () => {
    let item;
    beforeEach(() => {
        item =  itemList.children[0];
    });

    test('그 아이템의 편집 모드를 활성화한다', () => {
        sut.toggleEditModeForSingleItemWith(textContentsList[0]);

        let resultItem = sut.itemWith(textContentsList[0]);
        let result = Array.from(resultItem.classList).includes(sut.EDITMODE_ELEMENT_CLASS);
        expect(result).toBeTruthy();
    });
});

function createInnerHTML(textContentsList) {
    return textContentsList.map( (textContent) =>
        createLIHTML(false, textContent)
    ).join('\n');
}

function createLIHTML(isEditMode, textContent) {
    let attribute = isEditMode ? '' : 'class="edit-mode"';

    return `
        <li ${attribute}>
        ${textContent}
        <button class="remove-item btn-link text-red">
            <i class="fa-solid fa-xmark"></i>
        </button>
        </li>
    `;
}


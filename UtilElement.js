export function createElement(tagName, className) {
  let element = null;

  element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  return element;
}

export function removeAllChildren(targetElement) {
  while (targetElement.firstChild) {
    targetElement.removeChild(targetElement.firstChild);
  }
}

export function updateStyles(element, styles) {
  for (const [property, value] of Object.entries(styles)) {
    element.style[property] = value;
  }
}

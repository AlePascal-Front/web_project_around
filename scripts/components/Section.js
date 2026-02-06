export default class Section {
  constructor({ items, renderer }, selector) {
    this._renderedItems = items;
    this._renderer = renderer;
    this._container = document.querySelector(selector);
  }

  addItem(item) {
    this._container.append(item);
  }

  renderItems() {
    this._renderedItems.forEach((item) => {
      this._renderer(item)
    });
  }
}


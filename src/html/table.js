class {
  static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
  constructor(...args) {
    let self = this;
    self._elementType = "table"
    self.base(...args)
  }
  get headers() { return this.getAttribute("border"); }
  set headers(value) { this.setAttribute("border", value); }
}
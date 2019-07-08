class {
  static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
  constructor(...args) {
    let self = this;
    self._elementType = "select"
    self.base(...args)
  }
  get disabled() { return this.getAttribute("disabled"); }
  set disabled(value) { this.setAttribute("disabled", value); }
  get form() { return this.getAttribute("form"); }
  set form(value) { this.setAttribute("form", value); }
  get size() { return this.getAttribute("size"); }
  set size(value) { this.setAttribute("size", value); }
  get multiple() { return this.getAttribute("multiple"); }
  set multiple(value) { this.setAttribute("multiple", value); }
  get autofocus() { return this.getAttribute("autofocus"); }
  set autofocus(value) { this.setAttribute("autofocus", value); }
  get required() { return this.getAttribute("required"); }
  set required(value) { this.setAttribute("required", value); }
}
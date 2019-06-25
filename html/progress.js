class {
  static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
  constructor(...args) {
    let self = this;
    self._elementType = "progress"
    self.base(...args)
  }
  get value() { return this.getAttribute("value"); }
  set value(val) { this.setAttribute("value", val); }
  get max() { return this.getAttribute("max"); }
  set max(value) { this.setAttribute("max", value); }
}
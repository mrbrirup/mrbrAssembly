class {
  static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
  constructor(...args) {
    let self = this;
    self._elementType = "meter"
    self.base(...args)

  }
  get value() { return this.getAttribute("value"); }
  set value(val) { this.setAttribute("value", val); }
  get max() { return this.getAttribute("max"); }
  set max(value) { this.setAttribute("max", value); }
  get min() { return this.getAttribute("min"); }
  set min(value) { this.setAttribute("min", value); }
  get low() { return this.getAttribute("low"); }
  set low(value) { this.setAttribute("low", value); }
  get high() { return this.getAttribute("high"); }
  set high(value) { this.setAttribute("high", value); }
  get optimum() { return this.getAttribute("optimum"); }
  set optimum(value) { this.setAttribute("optimum", value); }
}
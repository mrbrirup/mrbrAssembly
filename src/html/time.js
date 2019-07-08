class {
  static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
  constructor(...args) {
    let self = this;
    self._elementType = "time"
    self.base(...args)

  }
  get datetime() { return this.getAttribute("datetime"); }
  set datetime(value) { this.setAttribute("datetime", value); }
}
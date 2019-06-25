class {
  static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
  constructor(...args) {
    let self = this;
    self._elementType = "label"
    self.base(...args)
  }
  get for() { return this.getAttribute("for"); }
  set for(value) { this.setAttribute("for", value); }
  get form() { return this.getAttribute("form"); }
  set form(value) { this.setAttribute("form", value); }
}
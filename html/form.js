class {
  static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
  constructor(...args) {
    let self = this;
    self._elementType = "form"
    self.base(...args)
  }
  get action() { return this.getAttribute("action"); }
  set action(value) { this.setAttribute("action", value); }
  get method() { return this.getAttribute("method"); }
  set method(value) { this.setAttribute("method", value); }
  get enctype() { return this.getAttribute("enctype"); }
  set enctype(value) { this.setAttribute("enctype", value); }
  get acceptCharset() { return this.getAttribute("accept-charset"); }
  set acceptCharset(value) { this.setAttribute("accept-charset", value); }
  get novalidate() { return this.getAttribute("novalidate"); }
  set novalidate(value) { this.setAttribute("novalidate", value); }
  get target() { return this.getAttribute("target"); }
  set target(value) { this.setAttribute("target", value); }
}
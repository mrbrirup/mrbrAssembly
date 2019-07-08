class {
  static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
  constructor(...args) {
    let self = this;
    self._elementType = "keygen"
    self.base(...args)
  }

  get challenge() { return this.getAttribute("challenge"); }
  set challenge(value) { this.setAttribute("challenge", value); }
  get keytype() { return this.getAttribute("keytype"); }
  set keytype(value) { this.setAttribute("keytype", value); }
  get autofocus() { return this.getAttribute("autofocus"); }
  set autofocus(value) { this.setAttribute("autofocus", value); }
  get disabled() { return this.getAttribute("disabled"); }
  set disabled(value) { this.setAttribute("disabled", value); }
  get form() { return this.getAttribute("form"); }
  set form(value) { this.setAttribute("form", value); }
}
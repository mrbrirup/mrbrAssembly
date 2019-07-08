class {
  static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
  constructor(...args) {
    let self = this;
    self._elementType = "ol"
    self.base(...args)
  }

  get start() { return this.getAttribute("start"); }
  set start(value) { this.setAttribute("start", value); }

  get reversed() { return this.getAttribute("reversed"); }
  set reversed(value) { this.setAttribute("reversed", value); }

  get type() { return this.getAttribute("type"); }
  set type(value) { this.setAttribute("type", value); }
}
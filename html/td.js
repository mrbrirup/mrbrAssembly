class {
  static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
  constructor(...args) {
    let self = this;
    self._elementType = "td"
    self.base(...args)
  }
  get colspan() { return this.getAttribute("colspan"); }
  set colspan(value) { this.setAttribute("colspan", value); }
  get rowspan() { return this.getAttribute("rowspan"); }
  set rowspan(value) { this.setAttribute("rowspan", value); }
  get headers() { return this.getAttribute("headers"); }
  set headers(value) { this.setAttribute("headers", value); }
}

class {
  static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
  constructor(...args) {
    let self = this;
    self._elementType = "meta"
    self.base(...args)
    self.setAttribute("id", self.id);
    self.setAttribute("name", self.name);


  }
  get content() { return this.getAttribute("content"); }
  set content(value) { this.setAttribute("content" , value); }
}
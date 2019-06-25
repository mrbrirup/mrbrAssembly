class {
  static get inherits() { return ["Mrbr.Html.MetaHttpEquiv"]; }
  constructor(...args) {
    let self = this;
    self._elementType = "meta"
    self.base(...args)
    self.setAttribute("http-equiv", 'content-type')
  }
}
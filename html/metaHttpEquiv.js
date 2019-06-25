class {
  static get inherits() { return ["Mrbr.Html.Meta"]; }
  constructor(...args) {
    let self = this;
    self._elementType = "meta"
    self.base(...args)
    self.setAttribute("http-equiv", 'content-type')
  }
  get httpEquiv(){return this.getAttribute("httpEquiv");}
  set httpEquiv(value){this.setAttribute("httpEquiv" , value);}
}
class {
  static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
  constructor(...args) {
    let self = this;
    self._elementType = "style"
    self.base(...args)
  }

  get type() { return this.getAttribute("type"); }
  set type(value) { this.setAttribute("type", value); }


  get media() { return this.getAttribute("media"); }
  set media(value) { this.setAttribute("media", value); }



  get media() { return this.getAttribute("media"); }
  set media(value) { this.setAttribute("media", value); }

}
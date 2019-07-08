class {
  static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
  constructor(...args) {
    let self = this;
    self._elementType = "script"
    self.base(...args)
  }


  get type() { return this.getAttribute("type"); }
  set type(value) { this.setAttribute("type", value); }


  get language() { return this.getAttribute("language"); }
  set language(value) { this.setAttribute("language", value); }


  get src() { return this.getAttribute("src"); }
  set src(value) { this.setAttribute("src", value); }


  get defer() { return this.getAttribute("defer"); }
  set defer(value) { this.setAttribute("defer", value); }

  get async() { return this.getAttribute("async"); }
  set async(value) { this.setAttribute("async", value); }

  get charset() { return this.getAttribute("charset"); }
  set charset(value) { this.setAttribute("charset", value); }


}
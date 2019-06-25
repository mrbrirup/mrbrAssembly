class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "details"
      self.base(...args)        
    } 
    get open() { return this.getAttribute("open"); }
    set open(value) { this.setAttribute("open", value); }
  }
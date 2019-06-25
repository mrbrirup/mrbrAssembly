class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "address"
      self.base(...args)        
    } 
  }
class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "audio"
      self.base(...args)        
    } 
  }
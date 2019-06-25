class {
    static get inherits() { return ["Mrbr.Html.Meta"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "meta"
      self.base(...args)        
    }     
  }
class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "command"
      self.base(...args)        

      
      self.setAttribute("type", "radio")
            
    } 
  }
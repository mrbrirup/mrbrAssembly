class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "button"
      self.base(...args)        

      
      self.frameElement.addAttribute("type", "button")
            
    } 
  }
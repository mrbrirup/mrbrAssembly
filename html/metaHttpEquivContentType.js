class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "meta"
      self.base(...args)        
      self.element.setAttribute("id", self.id);
      self.element.setAttribute("name", self.name);
      
      self.frameElement.addAttribute("http-equiv", 'content-type')      
    } 
  }
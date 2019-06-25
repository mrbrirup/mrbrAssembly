class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "cite"
      self.base(...args)        
      self.element.setAttribute("id", self.id);
      self.element.setAttribute("name", self.name);
      
            
    } 
  }
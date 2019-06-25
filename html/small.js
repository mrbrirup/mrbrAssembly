class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "small"
      self.base(...args)        
      self.element.setAttribute("id", self.id);
      self.element.setAttribute("name", self.name);
      
            
    } 
  }
class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "menu"
      self.base(...args)        
      self.setAttribute("id", self.id);
      self.setAttribute("name", self.name);
      
            
    } 
  }
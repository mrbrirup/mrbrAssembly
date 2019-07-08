class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "html"
      self.base(...args)        
      self.setAttribute("id", self.id);
      self.setAttribute("name", self.name);
    }     
    get manifest(){return this.getAttribute("manifest");}
    set manifest(value){this.setAttribute("manifest" , value);}
  }
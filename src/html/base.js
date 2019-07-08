class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "base"
      self.base(...args)        
    } 
    get href(){return this.getAttribute("href");}
    set href(value){this.setAttribute("href", value);}
  }
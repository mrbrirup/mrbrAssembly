class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "colgroup"
      self.base(...args)        
    } 
    get span(){return this.getAttribute("span");}
    set span(value){this.setAttribute("span" , value);}
  }
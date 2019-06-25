class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "li"
      self.base(...args)        
    } 

    get value(){return this.getAttribute("value");}
    set value(val){this.setAttribute("value" , val);}
  }
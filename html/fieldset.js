class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "fieldset"
      self.base(...args)        
    } 
    get disabled() { return this.getAttribute("disabled"); }
    set disabled(value) { this.setAttribute("disabled", value); }
    get form() { return this.getAttribute("form"); }
    set form(value) { this.setAttribute("form", value); }
  }


   
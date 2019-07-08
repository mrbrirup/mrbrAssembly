class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "optgroup"
      self.base(...args)        
    } 
    get disabled() { return this.getAttribute("disabled"); }
    set disabled(value) { this.setAttribute("disabled", value); }
    get label() { return this.getAttribute("label"); }
    set label(value) { this.setAttribute("label", value); }
  }
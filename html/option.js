class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "option"
      self.base(...args)        
    } 
    get disabled() { return this.getAttribute("disabled"); }
    set disabled(value) { this.setAttribute("disabled", value); }
    get label() { return this.getAttribute("label"); }
    set label(value) { this.setAttribute("label", value); }
    get selected() { return this.getAttribute("selected"); }
    set selected(value) { this.setAttribute("selected", value); }
    get value() { return this.getAttribute("value"); }
    set value(val) { this.setAttribute("value", val); }        
  }
   
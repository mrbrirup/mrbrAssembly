class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "textarea"
      self.base(...args)        
    } 
    get disabled() { return this.getAttribute("disabled"); }
    set disabled(value) { this.setAttribute("disabled", value); }
    get form() { return this.getAttribute("form"); }
    set form(value) { this.setAttribute("form", value); }
    get readonly() { return this.getAttribute("readonly"); }
    set readonly(value) { this.setAttribute("readonly", value); }
    get maxlength() { return this.getAttribute("maxlength"); }
    set maxlength(value) { this.setAttribute("maxlength", value); }        

    get autofocus() { return this.getAttribute("autofocus"); }
    set autofocus(value) { this.setAttribute("autofocus", value); }
    get required() { return this.getAttribute("required"); }
    set required(value) { this.setAttribute("required", value); }
    get placeholder() { return this.getAttribute("placeholder"); }
    set placeholder(value) { this.setAttribute("placeholder", value); }
    get dirname() { return this.getAttribute("dirname"); }
    set dirname(value) { this.setAttribute("dirname", value); }
    get rows() { return this.getAttribute("rows"); }
    set rows(value) { this.setAttribute("rows", value); }
    get wrap() { return this.getAttribute("wrap"); }
    set wrap(value) { this.setAttribute("wrap", value); }
    get cols() { return this.getAttribute("cols"); }
    set cols(value) { this.setAttribute("cols", value); }
}
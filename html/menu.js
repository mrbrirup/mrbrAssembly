class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "menu"
      self.base(...args)        
      self.setAttribute("id", self.id);
      self.setAttribute("name", self.name);
    } 
    get type(){return this.getAttribute("type");}
    set type(value){this.setAttribute("type" , value);}
    get label(){return this.getAttribute("label");}
    set label(value){this.setAttribute("label" , value);}        
}
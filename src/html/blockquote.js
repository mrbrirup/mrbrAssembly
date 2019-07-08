class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "blockquote"
      self.base(...args)        
      
    } 
    get cite() { return this.getAttribute("cite"); }
    set cite(value) { this.setAttribute("cite", value); }
  }
class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "del"
      self.base(...args)        
    } 
    get cite(){return this.getAttribute("cite");}
    set cite(value){this.setAttribute("cite" , value);}
    get datetime() { return this.getAttribute("datetime"); }
    set datetime(value) { this.setAttribute("datetime", value); }
  }
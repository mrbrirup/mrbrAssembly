class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "meta"
      self.base(...args)        
      self.setAttribute("charset", args[0].charset ? args[0].charset : 'UTF-8')      
    } 
    
    get charset(){return this.getAttribute("charset");}
    set charset(value){this.setAttribute("charset", value);}
  }
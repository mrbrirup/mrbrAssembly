class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "a"
      self.base(...args)        
    } 
    
    get href(){return this.getAttribute("href");}
    set href(value){this.setAttribute("href" , value);}
    
    get target(){return this.getAttribute("target");}
    set target(value){this.setAttribute("target" , value);}
    
    get rel(){return this.getAttribute("rel");}
    set rel(value){this.setAttribute("rel", value);}
    
    get hreflang(){return this.getAttribute("hreflang")}
    set hreflang(value){this.setAttribute("hreflang" , value);}
    
    get media(){return this.getAttribute("media");}
    set media(value){this.setAttribute("media" , value);}
    
    get type(){return this.getAttribute("type");}
    set type(value){this.setAttribute("type" , value);}
    
  }
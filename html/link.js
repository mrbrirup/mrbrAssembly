class {
  static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
  constructor(...args) {
    let self = this;
    self._elementType = "link"
    self.base(...args)
    self.setAttribute("id", self.id);
    self.setAttribute("name", self.name);
  }

  get href() { return this.getAttribute("href"); }
  set href(value) { this.setAttribute("href", value); }

  get rel() { return this.getAttribute("rel"); }
  set rel(value) { this.setAttribute("rel" , value); }

  get hreflang() { return this.getAttribute("hreflang"); }
  set hreflang(value) { this.setAttribute("hreflang" , value); }

  get media() { return this.getAttribute("media"); }
  set media(value) { this.setAttribute("media" ,value); }


  get type() { return this.getAttribute("type"); }
  set type(value) { this.setAttribute("type" , value); }

  get sizes() { return this.getAttribute("sizes"); }
  set sizes(value) { this.setAttribute("sizes" , value); }

}
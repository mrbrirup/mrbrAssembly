/*
mrbrAssembly 
Copyright 2019 Martin Ruppersburg
Licensed under MIT (https://github.com/mrbrirup/mrbrAssembly/blob/master/licence.md)
*/
class {static get inherits(){return["Mrbr.Html.BaseHtml"]}constructor(...t){this._elementType="link",this.base(...t),this.setAttribute("id",this.id),this.setAttribute("name",this.name)}get href(){return this.getAttribute("href")}set href(t){this.setAttribute("href",t)}get rel(){return this.getAttribute("rel")}set rel(t){this.setAttribute("rel",t)}get hreflang(){return this.getAttribute("hreflang")}set hreflang(t){this.setAttribute("hreflang",t)}get media(){return this.getAttribute("media")}set media(t){this.setAttribute("media",t)}get type(){return this.getAttribute("type")}set type(t){this.setAttribute("type",t)}get sizes(){return this.getAttribute("sizes")}set sizes(t){this.setAttribute("sizes",t)}}
/*
mrbrAssembly 
Copyright 2019 Martin Ruppersburg
Licensed under MIT (https://github.com/mrbrirup/mrbrAssembly/blob/master/licence.md)
*/
class {static get inherits(){return["Mrbr.Html.BaseHtml"]}constructor(...t){this._elementType="th",this.base(...t)}get colspan(){return this.getAttribute("colspan")}set colspan(t){this.setAttribute("colspan",t)}get rowspan(){return this.getAttribute("rowspan")}set rowspan(t){this.setAttribute("rowspan",t)}get headers(){return this.getAttribute("headers")}set headers(t){this.setAttribute("headers",t)}get scope(){return this.getAttribute("scope")}set scope(t){this.setAttribute("scope",t)}}
/*
mrbrAssembly 
Copyright 2019 Martin Ruppersburg
Licensed under MIT (https://github.com/mrbrirup/mrbrAssembly/blob/master/licence.md)
*/
class {static get inherits(){return["Mrbr.Html.BaseHtml"]}constructor(...t){this._elementType="script",this.base(...t)}get type(){return this.getAttribute("type")}set type(t){this.setAttribute("type",t)}get language(){return this.getAttribute("language")}set language(t){this.setAttribute("language",t)}get src(){return this.getAttribute("src")}set src(t){this.setAttribute("src",t)}get defer(){return this.getAttribute("defer")}set defer(t){this.setAttribute("defer",t)}get async(){return this.getAttribute("async")}set async(t){this.setAttribute("async",t)}get charset(){return this.getAttribute("charset")}set charset(t){this.setAttribute("charset",t)}}
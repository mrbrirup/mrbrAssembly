/*
mrbrAssembly 
Copyright 2019 Martin Ruppersburg
Licensed under MIT (https://github.com/mrbrirup/mrbrAssembly/blob/master/licence.md)
*/
class {static get inherits(){return["Mrbr.Html.BaseHtml"]}constructor(...t){this._elementType="meta",this.base(...t),this.setAttribute("charset",t[0].charset?t[0].charset:"UTF-8")}get charset(){return this.getAttribute("charset")}set charset(t){this.setAttribute("charset",t)}}
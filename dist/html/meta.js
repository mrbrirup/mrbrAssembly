/*
mrbrAssembly 
Copyright 2019 Martin Ruppersburg
Licensed under MIT (https://github.com/mrbrirup/mrbrAssembly/blob/master/licence.md)
*/
class {static get inherits(){return["Mrbr.Html.BaseHtml"]}constructor(...t){this._elementType="meta",this.base(...t),this.setAttribute("id",this.id),this.setAttribute("name",this.name)}get content(){return this.getAttribute("content")}set content(t){this.setAttribute("content",t)}}
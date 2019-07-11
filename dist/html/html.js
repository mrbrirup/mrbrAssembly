/*
mrbrAssembly 
Copyright 2019 Martin Ruppersburg
Licensed under MIT (https://github.com/mrbrirup/mrbrAssembly/blob/master/licence.md)
*/
class {static get inherits(){return["Mrbr.Html.BaseHtml"]}constructor(...t){this._elementType="html",this.base(...t),this.setAttribute("id",this.id),this.setAttribute("name",this.name)}get manifest(){return this.getAttribute("manifest")}set manifest(t){this.setAttribute("manifest",t)}}
/*
mrbrAssembly 
Copyright 2019 Martin Ruppersburg
Licensed under MIT (https://github.com/mrbrirup/mrbrAssembly/blob/master/licence.md)
*/
class {static get inherits(){return["Mrbr.Html.BaseHtml"]}constructor(...t){this._elementType="fieldset",this.base(...t)}get disabled(){return this.getAttribute("disabled")}set disabled(t){this.setAttribute("disabled",t)}get form(){return this.getAttribute("form")}set form(t){this.setAttribute("form",t)}}
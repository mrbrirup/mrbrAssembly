/*
mrbrAssembly 
Copyright 2019 Martin Ruppersburg
Licensed under MIT (https://github.com/mrbrirup/mrbrAssembly/blob/master/licence.md)
*/
class {static get inherits(){return["Mrbr.Html.BaseHtml"]}constructor(...t){this._elementType="select",this.base(...t)}get disabled(){return this.getAttribute("disabled")}set disabled(t){this.setAttribute("disabled",t)}get form(){return this.getAttribute("form")}set form(t){this.setAttribute("form",t)}get size(){return this.getAttribute("size")}set size(t){this.setAttribute("size",t)}get multiple(){return this.getAttribute("multiple")}set multiple(t){this.setAttribute("multiple",t)}get autofocus(){return this.getAttribute("autofocus")}set autofocus(t){this.setAttribute("autofocus",t)}get required(){return this.getAttribute("required")}set required(t){this.setAttribute("required",t)}}
/*
mrbrAssembly 
Copyright 2019 Martin Ruppersburg
Licensed under MIT (https://github.com/mrbrirup/mrbrAssembly/blob/master/licence.md)
*/
class {static get inherits(){return["Mrbr.Html.BaseHtml"]}constructor(...t){this._elementType="optgroup",this.base(...t)}get disabled(){return this.getAttribute("disabled")}set disabled(t){this.setAttribute("disabled",t)}get label(){return this.getAttribute("label")}set label(t){this.setAttribute("label",t)}}
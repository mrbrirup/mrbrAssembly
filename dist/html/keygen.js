/*
mrbrAssembly 
Copyright 2019 Martin Ruppersburg
Licensed under MIT (https://github.com/mrbrirup/mrbrAssembly/blob/master/licence.md)
*/
class {static get inherits(){return["Mrbr.Html.BaseHtml"]}constructor(...t){this._elementType="keygen",this.base(...t)}get challenge(){return this.getAttribute("challenge")}set challenge(t){this.setAttribute("challenge",t)}get keytype(){return this.getAttribute("keytype")}set keytype(t){this.setAttribute("keytype",t)}get autofocus(){return this.getAttribute("autofocus")}set autofocus(t){this.setAttribute("autofocus",t)}get disabled(){return this.getAttribute("disabled")}set disabled(t){this.setAttribute("disabled",t)}get form(){return this.getAttribute("form")}set form(t){this.setAttribute("form",t)}}
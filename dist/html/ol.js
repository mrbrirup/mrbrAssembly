/*
mrbrAssembly 
Copyright 2019 Martin Ruppersburg
Licensed under MIT (https://github.com/mrbrirup/mrbrAssembly/blob/master/licence.md)
*/
class {static get inherits(){return["Mrbr.Html.BaseHtml"]}constructor(...t){this._elementType="ol",this.base(...t)}get start(){return this.getAttribute("start")}set start(t){this.setAttribute("start",t)}get reversed(){return this.getAttribute("reversed")}set reversed(t){this.setAttribute("reversed",t)}get type(){return this.getAttribute("type")}set type(t){this.setAttribute("type",t)}}
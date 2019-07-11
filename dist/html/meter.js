/*
mrbrAssembly 
Copyright 2019 Martin Ruppersburg
Licensed under MIT (https://github.com/mrbrirup/mrbrAssembly/blob/master/licence.md)
*/
class {static get inherits(){return["Mrbr.Html.BaseHtml"]}constructor(...t){this._elementType="meter",this.base(...t)}get value(){return this.getAttribute("value")}set value(t){this.setAttribute("value",t)}get max(){return this.getAttribute("max")}set max(t){this.setAttribute("max",t)}get min(){return this.getAttribute("min")}set min(t){this.setAttribute("min",t)}get low(){return this.getAttribute("low")}set low(t){this.setAttribute("low",t)}get high(){return this.getAttribute("high")}set high(t){this.setAttribute("high",t)}get optimum(){return this.getAttribute("optimum")}set optimum(t){this.setAttribute("optimum",t)}}
/*
Copyright (c) 2019 Martin Ruppersburg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
class {
    static get inherits() { return ["Mrbr.Html.BaseHtml"]; }
      constructor(...args) {
      let self = this;
      self._elementType = "textarea"
      self.base(...args)        
    } 
    get disabled() { return this.getAttribute("disabled"); }
    set disabled(value) { this.setAttribute("disabled", value); }
    get form() { return this.getAttribute("form"); }
    set form(value) { this.setAttribute("form", value); }
    get readonly() { return this.getAttribute("readonly"); }
    set readonly(value) { this.setAttribute("readonly", value); }
    get maxlength() { return this.getAttribute("maxlength"); }
    set maxlength(value) { this.setAttribute("maxlength", value); }        

    get autofocus() { return this.getAttribute("autofocus"); }
    set autofocus(value) { this.setAttribute("autofocus", value); }
    get required() { return this.getAttribute("required"); }
    set required(value) { this.setAttribute("required", value); }
    get placeholder() { return this.getAttribute("placeholder"); }
    set placeholder(value) { this.setAttribute("placeholder", value); }
    get dirname() { return this.getAttribute("dirname"); }
    set dirname(value) { this.setAttribute("dirname", value); }
    get rows() { return this.getAttribute("rows"); }
    set rows(value) { this.setAttribute("rows", value); }
    get wrap() { return this.getAttribute("wrap"); }
    set wrap(value) { this.setAttribute("wrap", value); }
    get cols() { return this.getAttribute("cols"); }
    set cols(value) { this.setAttribute("cols", value); }
}
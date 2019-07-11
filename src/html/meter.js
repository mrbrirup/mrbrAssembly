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
    self._elementType = "meter"
    self.base(...args)

  }
  get value() { return this.getAttribute("value"); }
  set value(val) { this.setAttribute("value", val); }
  get max() { return this.getAttribute("max"); }
  set max(value) { this.setAttribute("max", value); }
  get min() { return this.getAttribute("min"); }
  set min(value) { this.setAttribute("min", value); }
  get low() { return this.getAttribute("low"); }
  set low(value) { this.setAttribute("low", value); }
  get high() { return this.getAttribute("high"); }
  set high(value) { this.setAttribute("high", value); }
  get optimum() { return this.getAttribute("optimum"); }
  set optimum(value) { this.setAttribute("optimum", value); }
}
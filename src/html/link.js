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
    self._elementType = "link"
    self.base(...args)
    self.setAttribute("id", self.id);
    self.setAttribute("name", self.name);
  }
  get elementType(){return this._elementType ? this._elementType :"link" ;}
  set elementType(value){this._elementType = value;}

  get href() { return this.getAttribute("href"); }
  set href(value) { this.setAttribute("href", value); }

  get rel() { return this.getAttribute("rel"); }
  set rel(value) { this.setAttribute("rel" , value); }

  get hreflang() { return this.getAttribute("hreflang"); }
  set hreflang(value) { this.setAttribute("hreflang" , value); }

  get media() { return this.getAttribute("media"); }
  set media(value) { this.setAttribute("media" ,value); }


  get type() { return this.getAttribute("type"); }
  set type(value) { this.setAttribute("type" , value); }

  get sizes() { return this.getAttribute("sizes"); }
  set sizes(value) { this.setAttribute("sizes" , value); }

}
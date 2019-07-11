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
    static get inherits() { return ["Mrbr.Geometry.Size","Mrbr.Geometry.Point"]; }
    constructor(...args) {
        // let size = args[0].size || {x:0, y:0, width:32, height: 24};
        // this.x = size.x;
        // this.y = size.y;
        // this.width = size.width;
        // this.height = size.height;
        this.base(...args);
        //console.log("size:", size)
    }
    get right() { return this.x + this.width - 1 }
    get bottom() { return this.y + this.height - 1 }
    static PointInRectangle(point, rectangle) {
        return (point.x >= rectangle.x && point.x <= rectangle.right && point.y >= rectangle.y && point.y <= rectangle.bottom)
    }
    set size(value) {
        if (this.typeMatch(value, Mrbr.Geometry.Size)) {
            this.width = value.width;
            this.height = value.height;
        }
    }
    get size(){
        return new Mrbr.Geometry.Size(this.width, this.height)
    }
    set position(value) { 
        if (this.typeMatch(value,Mrbr.Geometry.Point)) {
            this.x = value.x;
            this.y = value.y;
        }        
    }   
    get position(){
        return new Mrbr.Geometry.Point(this.x, this.y);
    }
}
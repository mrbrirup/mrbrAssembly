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
    static get inherits() { return ["Mrbr.System.Object"]; }
    static get using() { return []; }
    static get manifest() { return []; }
    static get extends() { return [Error]; }
    constructor(...args) {
        this.base(...args)
        let self = this;
        if (args[0].error) {
            Object.getOwnPropertyNames(args[0].error).forEach(key => {
                self[key] = args[0].error[key];
            })
        }
        this._source = args[0].source;
        this._info = args[0].info;
        this._innerExceptions = [];
    }
    get source(){return this._source;}
    set source(value){this._source = value;}
    get info(){return this._info;}
    set info(value){this._info = value;}
    get innerExceptions(){return this._innerExceptions;}
    set innerExceptions(value){this._innerExceptions = value;}
}
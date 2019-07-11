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
    constructor(...args) {
        this._name = args[0].name;
    }
    get name() { return this._name; }
    set name(value) { this._name = value; }
    typeMatch(...args){
        if(args === undefined || args.length === 0 ){
            throw "Nothing to compare";
        }
        else if(args.length === 1){
            if (!args[0].hasOwnProperty("mrbrAssemblyTypeName")) {
               return false;
            }
            return this.mrbrAssemblyTypeName === args[0].mrbrAssemblyTypeName;            
        }
        else{
            if(!args[0].constructor.hasOwnProperty("mrbrAssemblyTypeName") || !args[1].hasOwnProperty("mrbrAssemblyTypeName")){
                return false;
            }
            return args[0].mrbrAssemblyTypeName === args[1].mrbrAssemblyTypeName;
        }
    }
    isTypeOf(checkObject) {
        return this.typeMatch(this, checkObject)
    }
    canTypeMatch(whatIsThis, canItBeThis ){
        if(!whatIsThis || !canItBeThis){
            throw "Nothing to compare";
        }
        const whatIsThisBases = whatIsThis.bases();
        if(!whatIsThisBases && whatIsThisBases.length === 0){
            return false;
        }
        return whatIsThisBases.includes(canItBeThis.mrbrAssemblyTypeName);                    
    }
    canBeTypeOf(checkObject){
        return this.canTypeMatch(this, checkObject);
    }
}
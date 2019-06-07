class {
    static get inherits() {return ["Mrbr.System.Object"];}
    static get using() { return []; }
    static get manifest() { return []; }
    constructor(width, height) {
        this._width = width === undefined ? 0 : width ;
        this._height = height  === undefined ? 0: height ;
    }
    get width(){return this._width;}
    set width(value){this._width = value;}     
    get height(){return this._height;}
    set height(value){this._height = value;}
}
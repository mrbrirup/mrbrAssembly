class {
    static get inherits() {return ["Mrbr.System.Object"];}
    static get using() { return []; }
    static get manifest() { return []; }
    constructor(...args) {
        this._width = args[0].width;
        this._height = args[0].height;
    }
    get width(){return this._width;}
    set width(value){this._width = value;}     
    get height(){return this._height;}
    set height(value){this._height = value;}
}
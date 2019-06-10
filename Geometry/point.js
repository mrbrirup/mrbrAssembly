class {
    static get inherits() {return ["Mrbr.System.Object"];}
    static get using() { return []; }
    static get manifest() { return []; }
    constructor(...args) {
        this._x = args[0].x
        this._y = args[0].y
    }
    get x(){return this._x;}
    set x(value){this._x = value;} 
    get y(){return this._y;}
    set y(value){this._y = value;}
}
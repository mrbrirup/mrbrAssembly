class {
    static get inherits() {return ["Mrbr.System.Object"];}
    static get using() { return []; }
    static get manifest() { return []; }
    constructor(x,y) {
        this._x = x === undefined ? 0 : x;
        this._y = y === undefined ? 0 : y ;
    }
    get x(){return this._x;}
    set x(value){this._x = value;} 
    get y(){return this._y;}
    set y(value){this._y = value;}
}
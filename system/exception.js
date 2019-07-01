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
    }
    get source(){return this._source;}
    set source(value){this._source = value;}
    get info(){return this._info;}
    set info(value){this._info = value;}
}
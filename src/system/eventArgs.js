class {
    static get inherits() { return ["Mrbr.System.Object"]; }
    static get using() { return []; }
    static get manifest() { return []; }
    constructor(...args) {
        this.base(...args)
        this._source = {};
        this._eventArgs = {};
        if (args.length > 0 && args[0].source) { this._source = args[0].source }
        if (args.length > 0 && args[0].eventArgs) { this._eventArgs = args[0].eventArgs }
    }
    get source() { return this._source; }
    set source(value) { this._source = value; }
    get eventArgs() { return this._eventArgs; }
    set eventArgs(value) { this._eventArgs = value; }
}    
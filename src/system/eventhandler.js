class {
    static get inherits() { return ["Mrbr.System.Object"]; }
    static get using() { return []; }
    static get manifest() { return []; }
    constructor(...args) {
        this.base(...args)
        this._target = (args && args[0] && args[0].target) ? args[0].target : this;
        this._events = {};
    }
    get events() { return this._events; }
    set events(value) { this._events = value; }
    get target() { return this._target }
    set target(value) { this._target = value; }
    add(eventName, fn, options) {
        const self = this,
            handleId = Mrbr.System.EventHandler.handleId();
        let useCapture = (options && options.useCapture) ? options.useCapture : false,
        target = (options && options.target) ? options.target : self.target;
        target.addEventListener(eventName, fn, useCapture)
        self.events[handleId] = { eventName: eventName, fn: fn, useCapture: useCapture, target: target }
        return handleId;
    }
    remove(handleId) {
        const self = this;
        if(!self.events.hasOwnProperty(handleId)){return null;}
        const handle = self.events[handleId];
        handle.target.removeEventListener(handle.eventName, handle.fn);
        delete self.events[handleId];
        return null;
    }
    removeAll() {
        const self = this;
        Object.keys(self).forEach(key => self.remove(key));
    }
    static handleId(prefix) {
        return (prefix ? prefix : "") + (new Date().getTime().toString() + Math.random().toFixed(16).replace('.', ''));
    }
}
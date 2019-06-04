class {
    constructor(options) {
        this.ctor(options);
    }
    get events() { return this._events; }
    set events(value) { this._events = value; }
    on(event, listener) {
        const self = this,
            ev = self.events;
        if (typeof ev[event] !== 'object') {
            ev[event] = [];
        }
        ev[event].push(listener);
        return () => self.removeListener(event, listener);
    }
    removeListener(event, listener) {
        const self = this,
            ev = self.events;
        if (typeof ev[event] === 'object') {
            const idx = ev[event].indexOf(listener);
            if (idx > -1) {
                ev[event].splice(idx, 1);
            }
        }
    }
    emit(event, ...args) {
        const self = this,
            ev = self.events;
        if (typeof ev[event] === 'object') {
            ev[event].forEach(listener => listener.apply(self, args));
        }
    }
    once(event, listener) {
        const self = this,
            remove = self.on(event, (...args) => {
                remove();
                listener.apply(self, args);
            });
    }
}
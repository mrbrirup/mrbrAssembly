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
        this.base(...args);
        this._events = [];
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
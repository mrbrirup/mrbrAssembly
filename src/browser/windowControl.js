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
    static get inherits() {
        return [
            "Mrbr.System.Object",
            "Mrbr.System.EventEmitter"
        ]
    }
    static get manifest() { return [new Mrbr.System.ManifestEntry(Mrbr.System.ManifestEntry.FileTypes.Class, "Mrbr.System.Timers")] }
    constructor(...args) {
        var self = this;
        self.base(...args);
        const fnDebounce = Mrbr.System.Timers.debounce(self.window_resize.bind(self), 50, false);
        window.addEventListener('resize', fnDebounce);
    }
    dispose() { var self = this; window.removeEventListener('resize', self.window_resize.bind(self)); }
    static get width() { return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; }
    static get height() { return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; }
    static get size() { return { width: Mrbr.Browser.WindowControl.width, height: CanvasUI.Controls.WindowControl.height }; }

    window_resize(event) {
        var ctrlWin = Mrbr.Browser.WindowControl, self = this;
        self.emit(Mrbr.Browser.WindowControl.eventNames.resize, self, { width: ctrlWin.width, height: ctrlWin.height })
    }
    static get eventNames() {
        return {
            "resize": "windowControl_resize"
        }
    }
}

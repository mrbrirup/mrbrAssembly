class {
    static get inherits() { return []; }
    static get using() { return []; }
    static get manifest() { return []; }
    constructor(...args) {
        this.base(...args)
    }
    static debounce(func, wait, immediate, timeout) {
        return function () {
            const context = this, args = arguments;
            const later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
}
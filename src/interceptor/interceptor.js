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
    //static get inherits() { return ["Mrbr.System.Object"]; }
    static get using() { return []; }
    static get manifest() { return []; }
    constructor(...args) {
        this.base(...args)
        this._pre = [];
        this._post = []
    }
    wrap(fnPre, fnPost, context) {
        this.pre(fnPre, context)
        this.post(fnPost, context);
    }
    pre(fnPre, context) {
        this._pre.push({ fn: fnPre, ctx: context });
    }
    post(fnPost, context) {
        this._post.unshift({ fn: fnPost, ctx: context });
    }
    intercept(fn, context, ...args) {
        const self = this,
            self_pre = self._pre,
            self_post = self._post,
            preCount = self_pre.length,
            postCount = self_post.length;
        for (let preCounter = 0; preCounter < preCount; preCounter++) {
            const pre = self_pre[preCounter]
            let result = pre.fn.apply(pre.ctx !== undefined ? pre.ctx : self, args);
            if (result !== undefined) { args.push(result); }
        }
        let result = fn.apply(context !== undefined ? context : self, args);
        if (result !== undefined) { args.push(result); }
        for (let postCounter = 0; postCounter < postCount; postCounter++) {
            const post = self_post[postCounter];
            let result = post.fn.apply(post.ctx !== undefined ? post.ctx : self, args)
            if (result !== undefined) { args.push(result); }
        }
        return args;
    }
}
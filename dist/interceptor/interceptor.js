/*mrbrAssembly 
Copyright 2019 Martin Ruppersburg
Licensed under MIT (https://github.com/mrbrirup/mrbrAssembly/blob/master/licence.md)*/class {static get using(){return[]}static get manifest(){return[]}constructor(...t){this._pre=[],this._post=[]}wrap(t,s,p){this.pre(t,p),this.post(s,p)}pre(t,s){this._pre.push({fn:t,ctx:s})}post(t,s){this._post.unshift({fn:t,ctx:s})}intercept(t,s,...p){const e=this,i=e._pre,o=e._post,n=i.length,r=o.length;for(let t=0;t<n;t++){const s=i[t];let o=s.fn.apply(void 0!==s.ctx?s.ctx:e,p);void 0!==o&&p.push(o)}let c=t.apply(void 0!==s?s:e,p);void 0!==c&&p.push(c);for(let t=0;t<r;t++){const s=o[t];let i=s.fn.apply(void 0!==s.ctx?s.ctx:e,p);void 0!==i&&p.push(i)}return p}}
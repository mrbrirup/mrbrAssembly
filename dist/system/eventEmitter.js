/*mrbrAssembly 
Copyright 2019 Martin Ruppersburg
Licensed under MIT (https://github.com/mrbrirup/mrbrAssembly/blob/master/licence.md)*/class {constructor(){this._events=[]}get events(){return this._events}set events(e){this._events=e}on(e,t){const s=this,n=s.events;return"object"!=typeof n[e]&&(n[e]=[]),n[e].push(t),()=>s.removeListener(e,t)}removeListener(e,t){const s=this.events;if("object"==typeof s[e]){const n=s[e].indexOf(t);n>-1&&s[e].splice(n,1)}}emit(e,...t){const s=this,n=s.events;"object"==typeof n[e]&&n[e].forEach(e=>e.apply(s,t))}once(e,t){const s=this,n=s.on(e,(...e)=>{n(),t.apply(s,e)})}}
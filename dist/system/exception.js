/*
mrbrAssembly 
Copyright 2019 Martin Ruppersburg
Licensed under MIT (https://github.com/mrbrirup/mrbrAssembly/blob/master/licence.md)
*/
class {static get inherits(){return["Mrbr.System.Object"]}static get using(){return[]}static get manifest(){return[]}static get extends(){return[Error]}constructor(...t){this.base(...t);let e=this;t[0].error&&Object.getOwnPropertyNames(t[0].error).forEach(r=>{e[r]=t[0].error[r]}),this._source=t[0].source,this._info=t[0].info,this._innerExceptions=[]}get source(){return this._source}set source(t){this._source=t}get info(){return this._info}set info(t){this._info=t}get innerExceptions(){return this._innerExceptions}set innerExceptions(t){this._innerExceptions=t}}
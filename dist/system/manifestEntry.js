/*
mrbrAssembly 
Copyright 2019 Martin Ruppersburg
Licensed under MIT (https://github.com/mrbrirup/mrbrAssembly/blob/master/licence.md)
*/
class {constructor(e,t){this.fileType=e,this.entryName=t}get fileType(){return this._fileType}set fileType(e){this._fileType=e}get entryName(){return this._entryName}set entryName(e){this._entryName=e}static get FileTypes(){return{Class:"class",Script:"script",File:"file",Interface:"interface",Config:"config",ScriptElement:"scriptElement",LinkedScript:"linkedScript",Style:"styleElement",LinkedStyle:"linkedStyle",Component:"component"}}}
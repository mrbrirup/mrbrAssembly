/*
mrbrAssembly 
Copyright 2019 Martin Ruppersburg
Licensed under MIT (https://github.com/mrbrirup/mrbrAssembly/blob/master/licence.md)
*/
class {constructor(...e){this._name=e[0].name}get name(){return this._name}set name(e){this._name=e}typeMatch(...e){if(void 0===e||0===e.length)throw"Nothing to compare";return 1===e.length?!!e[0].hasOwnProperty("mrbrAssemblyTypeName")&&this.mrbrAssemblyTypeName===e[0].mrbrAssemblyTypeName:!(!e[0].constructor.hasOwnProperty("mrbrAssemblyTypeName")||!e[1].hasOwnProperty("mrbrAssemblyTypeName"))&&e[0].mrbrAssemblyTypeName===e[1].mrbrAssemblyTypeName}isTypeOf(e){return this.typeMatch(this,e)}canTypeMatch(e,r){if(!e||!r)throw"Nothing to compare";const t=e.bases();return!(!t&&0===t.length)&&t.includes(r.mrbrAssemblyTypeName)}canBeTypeOf(e){return this.canTypeMatch(this,e)}}
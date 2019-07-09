var Mrbr=Mrbr||{};Mrbr.System=Mrbr.System||{},Mrbr.System.Assembly=class{constructor(){Mrbr.System.Assembly._fileReplacements=[{replace:new RegExp("^Mrbr\\."),with:"/"},{replace:new RegExp("\\.","g"),with:"/"}]}static get using(){return["Mrbr.System.ManifestEntry","Mrbr.System.Interface"]}static toObject(...e){var t=Mrbr.System.Assembly.defaultContext;const n=e.length,r=e[n-1],s=Mrbr.System.Assembly;let o;if(o=1===n?t:e[0],void 0!==s.objectCache[r])return s.objectCache[r];const i=e[n-1].split(".");let l=o;for(let e,t=0,n=i.length;t<n;t++)l=void 0!==l[e=i[t]]?l[e]:l[e]={};return Mrbr.System.Assembly[r]=l,l}static get defaultContext(){return Mrbr.System.Assembly._defaultContext}static set defaultContext(e){Mrbr.System.Assembly._defaultContext=e}static get objectCache(){return Mrbr.System.Assembly._objectCache}static isObject(...e){return void 0!==ObjectUtils.toObject(...e)}static fetchFile(e){const t=Mrbr.System.Assembly.loader;if(t.hasOwnProperty(e)){let n=t[e];return!0===n.loaded?Promise.resolve():n.promise}{let n,r,s=new Promise((e,t)=>{n=e,r=t});return fetch(e,{method:"GET"}).then(s=>s.text().then(r=>{t[e].result=r,t[e].loaded=!0,delete t[e].promise,n(r)}).catch(function(e){r(e)})).catch(function(e){r(e)}),t[e]={promise:s,result:void 0,loaded:!1},s}}static loadXmlHttpFile(e){const t=Mrbr.System.Assembly.loader;if(t.hasOwnProperty(e)){let n=t[e];return!0===n.loaded?Promise.resolve():n.promise}{let n,r,s=new Promise((e,t)=>{n=e,r=t});const o=new XMLHttpRequest;return o.open("GET",e,!0),o.send(""),o.onreadystatechange=function(){4===o.readyState&&(o.status>=200&&o.status<300?(t[e].result=o.responseText,t[e].loaded=!0,delete t[e].promise,n(o.responseText)):r(new Error(o.statusText)))},t[e]={promise:s,result:void 0,loaded:!1},s}}static loadFile(e){}static get typePropertyName(){return"mrbrAssemblyTypeName"}static addTypeNameScript(e){const t=Mrbr.System.Assembly;return`\nObject.defineProperty(${e}.prototype, '${t.typePropertyName}', { get: function() {return ${e}.${t.typePropertyName};}});\n${e}.${t.typePropertyName} = "${e}";`}static get fileReplacements(){return Mrbr.System.Assembly._fileReplacements}static set fileReplacements(e){Mrbr.System.Assembly._fileReplacements=e}static resolveNamespaceToFile(e){let t=e;for(let e,n=0,r=Mrbr.System.Assembly._fileReplacements,s=r.length;n<s;n++)e=r[n],t=`${t.split(e.replace).join(e.with)}`;return t}static nop(){}static setArrayPolyFills(){Object.getOwnPropertyDescriptor(Array.prototype,"distinct")||(Array.prototype.distinct=function(){return this.filter((e,t,n)=>n.indexOf(e)===t)}),Array.prototype.tokenSort=function(){return this.sort(function(e,t){return e.start-t.start})},Mrbr.System.Assembly.setArrayPolyFills=Mrbr.System.Assembly.nop}static get loader(){return Mrbr.System.Assembly._loader}static loadComponent(e){const t=Mrbr.System.Assembly,n=t.toObject,r=Mrbr.System.Assembly.resolveNamespaceToFile;t.loadClasses,t.setInheritance,t.addClassCtor,t.loadManifest;let s=r(e)+".js";return new Promise(function(r,o){t.loadFile(s).then(function(s){n(e)instanceof Function||(Function(`${e} = ${s};\ncustomElements.define('${e.toLowerCase().split(".").join("-")}', ${e});`)(),t.objectCache[e]=n(e)),r()}).catch(function(e){o(e)})})}static loadClass(e){let t=[e],n=e;const r=Mrbr.System.Assembly,s=r.toObject,o=Mrbr.System.Assembly.resolveNamespaceToFile,i=r.loadClasses,l=r.setInheritance,a=r.addClassCtor,c=r.loadManifest;return n=o(e)+".js",new Promise(function(o,m){r.loadFile(n).then(function(t){let n;(n=s(e))instanceof Function||(Function(`${e} = ${t};\n${r.addTypeNameScript(e)};\n`)(),r.objectCache[e]=n=s(e))}).catch(function(t){t instanceof Error&&m({name:"Exception",error:t,source:`${r.mrbrAssemblyTypeName}:loadClass`,info:`className: ${e}`}),m(t)}).then(function(){return new Promise(function(t,n){let r=s(e).manifest;null==r||0===r.length?t():c(r).then(function(){t()}).catch(function(e){n(e)})})}).catch(function(e){m(e)}).then(function(){let n=0,r=-1,c=[];return new Promise(function(o,l){const a=s(e),m=function(){r=n;const e=[],s=[a.using,a.inherits,a.newClasses];for(let t=0,n=s.length;t<n;t++){let n=s[t];if(void 0!==n)for(let t=0,r=n.length;t<r;t++){let r=n[t];e.includes(r)||e.push(r)}}n=e.length,t=t.concat(e).distinct(),i(e).then(function(e){let t=void 0===(c=e)?0:c.length;(n+=t)!=r?m():o()}).catch(function(e){l()})};m()}).catch(function(e){m(e)}).then(function(e){const n=[];if(void 0!==t&&t.length>0)for(let e,r=0,o=t.length;r<o;r++)if((e=s(t[r]))instanceof Function){const t=new Promise(function(t,n){l(e.inherits,e).then(function(n){l(e.extends,e).then(function(n){a(e),t()})}).catch(function(e){n()})});n.push(t)}Promise.all(n).then(e=>{o()})}).catch(function(e){m(e)})})})}static loopLoadClasses(){}static loadManifest(e){if(void 0===e)return Promise.resolve();const t=Mrbr.System.Assembly,n=Mrbr.System.ManifestEntry.FileTypes,r=t.loadClass,s=t.loadScript,o=t.loadScriptElement,i=t.loadFile,l=t.loadStyleElement,a=t.createLinkedStyleElement,c=(e=Array.isArray(e)?e:[e]).length;let m=new Array(c);for(let d,u=0;u<c;u++)switch((d=e[u]).fileType){case n.Class:m[u]=new Promise(function(e,t){r(d.entryName).then(t=>e()).catch(function(e){t(e)})});break;case n.Component:m[u]=new Promise(function(e,n){t.loadComponent(d.entryName).then(t=>e()).catch(function(e){n(e)})});break;case n.Script:m[u]=new Promise(function(e,t){s(d.entryName).then(t=>e()).catch(function(e){t(e)})});break;case n.File:m[u]=new Promise(function(e,t){i(d.entryName).then(t=>e()).catch(function(e){t(e)})});break;case n.ScriptElement:m[u]=new Promise(function(e,t){o(d.entryName).then(t=>e()).catch(function(e){t(e)})});break;case n.Style:m[u]=new Promise(function(e,n){d.entryName.toLowerCase().endsWith(".css")?l(d.entryName).then(t=>e()).catch(function(e){n(e)}):l(`${t.resolveNamespaceToFile(d.entryName)}.css`).then(t=>e()).catch(function(e){n(e)})});break;case n.LinkedStyle:m[u]=new Promise(function(e,n){d.entryName.toLowerCase().endsWith(".css")?a(d.entryName).then(t=>e()).catch(function(e){n(e)}):a(`${t.resolveNamespaceToFile(d.entryName)}.css`).then(t=>e()).catch(function(e){n(e)})})}return Promise.all(m)}static loadScript(e){const t=Mrbr.System.Assembly;return new Promise(function(n,r){t.loadFile(e).then(e=>{Function(e)(),n()}).catch(function(e){r(e)})})}static loadScripts(e){if(void 0===e)return Promise.resolve();const t=this.loadFile,n=(e=Array.isArray(e)?e:[e]).lengthl,r=new Array(n);for(let s,o=0;o<n;o++)s=filenames[o],r[o]=new Promise(function(n,r){t(e).then(e=>n()).catch(function(e){r(e)})});return Promise.all(r)}static get ctorTokeniser(){return this._ctorTokeniser}static set ctorTokeniser(e){this._ctorTokeniser=e}static addClassCtor(e){if(void 0!==Object.getOwnPropertyDescriptor(e.prototype,"ctor"))return e;Mrbr.System.Assembly._ctorTokeniser||(Mrbr.System.Assembly._ctorTokeniser=new Mrbr.Utils.Parser.Tokeniser(Mrbr.System.Assembly.loader[Mrbr.System.Assembly.resolveNamespaceToFile("Mrbr.Utils.Parser.tokenCtor")+".json"].result));Mrbr.Utils.Parser.Tokeniser;const t=e.prototype.constructor.toString(),n=Mrbr.System.Assembly.ctorTokeniser.tokenise(t),r=Mrbr.Utils.Parser.Token,s=n.length,o=r.Groups,i=[];let l,a,c=[],m=!0,d=0,u=0,y=0,f=0,h=0,b=0,p=0;for(;m&&d<s;)(l=n[d]).group===o.Keyword&&"constructor"===l.type?m=!1:d++;for(m=!0;m&&d<s;)(l=n[d]).group===o.Block&&"("===l.value?(y=d,u=l.levels.parens,m=!1):d++;for(m=!0;m&&d<s;)(l=n[d]).group===o.Block&&")"===l.value&&l.levels.parens===u?(f=d,m=!1):d++;if(f>y){for(let e=y+1;e<=f-1;e++)","===(l=n[e]).value&&l.levels.parens===u?(i.push(c.join("")),c=[]):c.push(l.value);c.length>0&&i.push(c.join(""))}for(m=!0;m&&d<s;)(l=n[d]).group===o.Block&&"{"===l.value?(h=d,p=l.levels.braces,m=!1):d++;for(m=!0;m&&d<s;)(l=n[d]).group===o.Block&&"}"===l.value&&l.levels.braces===p?(b=d,m=!1):d++;if(b>h&&void 0===Object.getOwnPropertyDescriptor(e.prototype,"ctor")){a=new Array(b-1);for(let e=h+1;e<=b-1;e++)a[e]=n[e].value;Object.defineProperty(e.prototype,"ctor",{value:0===i.length?Function(`\n${a.join("").trim()}\n`):Function(i,`\n${a.join("").trim()+`/* comment ctor ${e.prototype.mrbrAssemblyTypeName} */`}\n`),configurable:!1,enumerable:!0,writable:!1})}return void 0===Object.getOwnPropertyDescriptor(e.prototype,"base")&&Object.defineProperty(e.prototype,"base",{value:function(...t){void 0!==t&&0!==t.length||((t=[])[0]={}),t[0].called=t[0].called||[];const n=this,r=t[0].called,s=n.constructor.prototype;r.push(e.prototype.mrbrAssemblyTypeName.replace(/\./g,"_")+"_ctor");for(let e in s)!r.includes(e)&&e.endsWith("_ctor")&&"ctor"!==e&&(r.push(e),n[e](...t))},configurable:!1,enumerable:!0,writable:!1,name:"base"}),void 0===Object.getOwnPropertyDescriptor(e.prototype,"bases")&&Object.defineProperty(e.prototype,"bases",{value:function(){if(void 0!==e.prototype._bases)return e.prototype._bases;const t=[this.constructor.mrbrAssemblyTypeName];return Mrbr.System.Assembly.listClassInheritance(t,this.constructor),e.prototype._bases=t,e.prototype._bases},configurable:!1,enumerable:!0,writable:!1,name:"bases"}),e}static listClassInheritance(e,t){const n=Mrbr.System.Assembly;if(t.inherits&&t.mrbrAssemblyTypeName)for(let r=0,s=t.inherits.length,o=t.inherits;r<s;r++){let t=o[r];e.includes(t)||(e.push(t),n.listClassInheritance(e,n.toObject(t)))}}static loadClasses(e){if(void 0===e||0===e.length)return Promise.resolve();const t=Mrbr.System.Assembly,n=e.length,r=new Array(n);e=Array.isArray(e)?e:[e];for(let s,o=0;o<n;o++)s=e[o],r[o]=new Promise(function(e,n){t.loadClass(s).then(function(t){e(s)}).catch(function(e){n(e)})});return Promise.all(r)}static loadConfigFile(e){const t=Mrbr.System.Assembly;return new Promise(function(n,r){t.loadFile(e).then(r=>{t.loader[e].config=JSON.parse(r),n()}).catch(function(e){r(e)})})}static loadConfigFiles(e){if(void 0===e||0===classes.length)return Promise.resolve();const t=Mrbr.System.Assembly,n=(e=Array.isArray(e)?e:[e]).length,r=new Array(n);for(let s,o=0;o<n;o++)s=e[o],r[o]=new Promise(function(e,n){t.loadConfigFile(s).then(function(t){e(s)}).catch(function(e){n(e)})});return Promise.all(r)}static loadStyleElement(e){const t=Mrbr.System.Assembly;return new Promise(function(n,r){t.loadFile(e).then(e=>{let t=document.createElement("style");t.type="text/css",t.styleSheet?t.styleSheet.cssText=e:t.appendChild(document.createTextNode(e)),document.head.appendChild(t),n()}).catch(function(e){r(e)})})}static loadStyleElements(e){if(void 0===e||0===e.length)return Promise.resolve();const t=Mrbr.System.Assembly,n=(e=Array.isArray(e)?e:[e]).length,r=new Array(n);for(let s,o=0;o<n;o++)s=e[fileNameCounter],r[fileNameCounter]=new Promise(function(e,n){t.loadStyleElement(filename).then(function(t){e(filename)}).catch(function(e){n(e)})});return Promise.all(r)}static loadScriptElement(e){const t=Mrbr.System.Assembly;return new Promise(function(n,r){t.loadFile(e).then(t=>{let r=document.createElement("script");r.id=e,r.text=t,document.head.appendChild(r),n()}).catch(function(e){r(e)})})}static loadScriptElements(e){if(void 0===e||0===e.length)return Promise.resolve();const t=Mrbr.System.Assembly,n=(e=Array.isArray(e)?e:[e]).length,r=new Array(n);for(let e,s=0;fileNamesCounter<n;s++)e=e[s],r[s]=new Promise(function(e,n){t.loadScriptElement(filename).then(function(t){e(filename)}).catch(function(e){n(e)})});return Promise.all(r)}static createLinkedScriptElement(e){let t=document.createElement("script");return t.id=e,t.src=e,document.head.appendChild(t),Promise.resolve()}static createLinkedScriptElements(e){if(void 0===filenames||0===filenames.length)return Promise.resolve();const t=Mrbr.System.Assembly;e=Array.isArray(filenames)?filenames:[filenames];let n=new Array(filenames.length);for(let r=0,s=e.length,o=filenames[r];r<s;r++)n[r]=new Promise(function(e,n){t.createLinkedScriptElement(o).then(function(t){e(o)}).catch(function(e){n(e)})});return Promise.all(n)}static createLinkedStyleElement(e){let t=document.createElement("link");return t.type="text/css",t.rel="stylesheet",t.href=e,document.head.appendChild(t),Promise.resolve()}static createLinkedStyleElements(e){if(void 0===filenames||0===filenames.length)return Promise.resolve();const t=Mrbr.System.Assembly;e=Array.isArray(filenames)?filenames:[filenames];let n=new Array(filenames.length);for(let r=0,s=e.length,o=filenames[r];r<s;r++)n[r]=new Promise(function(e,n){t.createLinkedStyleElement(o).then(function(t){e(o)}).catch(function(e){n(e)})});return Promise.all(n)}static loadInterface(e){let t=e;const n=Mrbr.System.Assembly,r=n.toObject,s=Mrbr.System.Assembly.resolveNamespaceToFile,o=n.loadClasses,i=n.loadInterfaces,l=n.loadManifest;return t=s(e),t+=".json",new Promise(function(s,a){n.loadFile(t).then(function(t){let c=r(e);void 0===c.mrbrInterfaceName&&((c=Object.assign(c,JSON.parse(t))).mrbrInterfaceName=e);let m=[];c.inherits&&c.inherits.length>0&&m.push(i(c.inherits)),c.using&&c.using.length>0&&m.push(o(c.using)),c.interfaces&&c.interfaces.length>0&&m.push(i(c.interfaces)),c.manifest&&c.manifest.length>0&&m.push(l(c.manifest)),Promise.all(m).then(()=>{n.setInterfaceInheritance(c.inherits,e),s()}).catch(function(e){a(e)})})})}static loadInterfaces(e){if(void 0===e||0===e.length)return Promise.resolve();const t=Mrbr.System.Assembly;e=Array.isArray(e)?e:[e];let n=new Array(e.length);for(let r=0,s=e.length,o=e[r];r<s;r++)n[r]=new Promise(function(e,n){t.loadInterface(o).then(function(t){e(o)}).catch(function(e){n(e)})});return Promise.all(n)}static setInterfaceInheritance(e,t){if(void 0===e)return;e=Array.isArray(e)?e:[e];const n=Mrbr.System.Assembly,r=n.toObject(t);r.inherited||(r.inherited=[]);for(let t,s=0,o=e.length,i=n.toObject(t);s<o;s++)t=e[s],r.inherited.includes(t)||(r.inherited.push(t),i.inherited&&(r.inherited=r.inherited.concat(i.inherited)),i.properties&&(r.properties=Object.assign(r.properties,i.properties)),i.methods&&(r.methods=Object.assign(r.methods,i.methods)))}static setInheritance(e,t){return void 0===e?Promise.resolve():Mrbr.System.Inheritance.applyInheritance(e,t)}static initialised(e){const t=Mrbr.System.Assembly;return e&&void 0!==e.loadFile?Mrbr.System.Assembly.loadFile=e.loadFile:(window&&window.fetch,Mrbr.System.Assembly.loadFile=Mrbr.System.Assembly.loadXmlHttpFile),e&&e.defaultContext?Mrbr.System.Assembly._defaultContext=e.defaultContext:"undefined"==typeof window?Mrbr.System.Assembly._defaultContext=globalThis:window?Mrbr.System.Assembly._defaultContext=window:Mrbr.System.Assembly._defaultContext=void 0,null!=e&&void 0!==e.assemblyResolvers&&null!==e.assemblyResolvers&&(t.fileReplacements=e.assemblyResolvers),t._loader={},t._objectCache={},t.setArrayPolyFills(),new Promise(function(e,n){t.loadFile(Mrbr.System.Assembly.resolveNamespaceToFile("Mrbr.Utils.Parser.tokenCtor")+".json").then(()=>t.loadClass("Mrbr.Utils.Parser.Tokeniser")).catch(e=>console.log(e)).then(()=>t.loadClass("Mrbr.System.ManifestEntry")).then(()=>t.loadClass("Mrbr.System.Inheritance")).then(()=>t.loadClass("Mrbr.System.Exception")).then(function(){return Function(t.addTypeNameScript("Mrbr.System.Assembly"))(),t.loadClasses(t.using)}).then(function(){e()}).catch(function(e){n(e)})})}static onReady(e,t){let n,r=function(){document.removeEventListener?(document.removeEventListener("DOMContentLoaded",r),document.removeEventListener("load",r),window.removeEventListener("load",r),window.removeEventListener("DOMContentLoaded",r)):(document.detachEvent("onreadystatechange",r),window.detachEvent("onload",r),window.detachEvent("load",r),document.detachEvent("load",r)),n()};return new Promise(function(t,s){n=t,Mrbr.System.Assembly.initialised(e).then(function(){document.onreadystatechange=function(){"complete"===document.readyState&&r()},"complete"===document.readyState?t("complete"):document.addEventListener?(document.addEventListener("DOMContentLoaded",r),window.addEventListener("load",r),window.addEventListener("DOMContentLoaded",r),document.addEventListener("load",r)):(document.attachEvent("onreadystatechange",r),window.attachEvent("onload",r),document.attachEvent("load",r),window.attachEvent("load",r))})})}static createNamespaceManifest(e,t,n){if(void 0===e||void 0===t||void 0===n||0===n.length)return[];const r=n.length;let s=new Array(r),o=Mrbr.System.ManifestEntry;for(let i=0;i<r;i++)s[i]=new o(t,`${e}.${n[i]}`);return s}};
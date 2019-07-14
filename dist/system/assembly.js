/*mrbrAssembly 
Copyright 2019 Martin Ruppersburg
Licensed under MIT (https://github.com/mrbrirup/mrbrAssembly/blob/master/licence.md)*/var Mrbr=Mrbr||{};Mrbr.System=Mrbr.System||{},Mrbr.System.Assembly=class{constructor(){Mrbr.System.Assembly._fileReplacements=[{replace:new RegExp("^Mrbr\\."),with:"/"},{replace:new RegExp("\\.","g"),with:"/"}]}static get using(){return["Mrbr.System.ManifestEntry","Mrbr.System.Interface"]}static toObject(...e){var t=Mrbr.System.Assembly.defaultContext;const r=e.length,n=e[r-1],s=Mrbr.System.Assembly;let o;if(o=1===r?t:e[0],void 0!==s.objectCache[n])return s.objectCache[n];const i=e[r-1].split(".");let c=o;for(let e,t=0,r=i.length;t<r;t++)c=void 0!==c[e=i[t]]?c[e]:c[e]={};return Mrbr.System.Assembly[n]=c,c}static get defaultContext(){return Mrbr.System.Assembly._defaultContext}static set defaultContext(e){Mrbr.System.Assembly._defaultContext=e}static get objectCache(){return Mrbr.System.Assembly._objectCache}static isObject(...e){return void 0!==ObjectUtils.toObject(...e)}static fetchFile(...e){const t=e[0].url,r=Mrbr.System.Assembly,n=r.loader,s=r.loadedFile;if(n.hasOwnProperty(t)){let e=n[t];return!0===e.loaded?Promise.resolve():e.promise}{let e,o,i=new Promise((t,r)=>{e=t,o=r});return fetch(t,{method:"GET"}).then(i=>i.text().then(o=>{n[t].result=o,n[t].loaded=!0,delete n[t].promise;const i={url:t,text:o};o=void 0===r._fileInterceptor?s(i):r.fileInterceptor.intercept(s,void 0,i)[1],e(o)}).catch(function(e){o(e)})).catch(function(e){o(e)}),n[t]={promise:i,result:void 0,loaded:!1},i}}static loadXmlHttpFile(e){const t=Mrbr.System.Assembly.loader;if(t.hasOwnProperty(e)){let r=t[e];return!0===r.loaded?Promise.resolve():r.promise}{let r,n,s=new Promise((e,t)=>{r=e,n=t});const o=new XMLHttpRequest;return o.open("GET",e,!0),o.send(""),o.onreadystatechange=function(){if(4===o.readyState)if(o.status>=200&&o.status<300){t[e].result=o.responseText,t[e].loaded=!0,delete t[e].promise;const n={url:e,text:o.responseText},s=void 0===assembly._fileInterceptor?assemblyLoadedFile(n):assembly.fileInterceptor.intercept(assemblyLoadedFile,void 0,n)[1];r(s)}else n(new Error(o.statusText))},t[e]={promise:s,result:void 0,loaded:!1},s}}static loadFile(e){}static get typePropertyName(){return"mrbrAssemblyTypeName"}static addTypeNameScript(e){const t=Mrbr.System.Assembly;return`\nObject.defineProperty(${e}.prototype, '${t.typePropertyName}', { get: function() {return ${e}.${t.typePropertyName};}});\n${e}.${t.typePropertyName} = "${e}";`}static get fileReplacements(){return Mrbr.System.Assembly._fileReplacements}static set fileReplacements(e){Mrbr.System.Assembly._fileReplacements=e}static resolveNamespaceToFile(e){let t=e;for(let e,r=0,n=Mrbr.System.Assembly._fileReplacements,s=n.length;r<s;r++)e=n[r],t=`${t.split(e.replace).join(e.with)}`;return t}static nop(){}static setArrayPolyFills(){Object.getOwnPropertyDescriptor(Array.prototype,"distinct")||(Array.prototype.distinct=function(){return this.filter((e,t,r)=>r.indexOf(e)===t)}),Array.prototype.tokenSort=function(){return this.sort(function(e,t){return e.start-t.start})},Mrbr.System.Assembly.setArrayPolyFills=Mrbr.System.Assembly.nop}static get loader(){return Mrbr.System.Assembly._loader}static loadComponent(e){const t=Mrbr.System.Assembly,r=t.toObject,n=Mrbr.System.Assembly.resolveNamespaceToFile,s=(t.loadClasses,t.setInheritance,t.addClassCtor,t.loadManifest,t.createComponent);let o=n(e)+".js";return new Promise(function(n,i){const c={url:o};t.loadFile(c).then(function(o){if(!(r(e)instanceof Function)){const n={componentName:e,result:o,assembly:t,assemblyToObject:r};void 0===t._componentInterceptor?s(n):t.componentInterceptor.intercept(s,void 0,n)}n()}).catch(function(e){i(e)})})}static createClass(...e){const t=e[0],r=t.className,n=t.result,s=t.assembly,o=t.assemblyToObject;Function(`${r} = ${n};\n${s.addTypeNameScript(r)};\n`)(),s.objectCache[r]=o(r)}static createComponent(...e){const t=e[0],r=t.componentName,n=t.result,s=t.assembly,o=t.assemblyToObject;Function(`${r} = ${n};\ncustomElements.define('${r.toLowerCase().split(".").join("-")}', ${r});`)(),s.objectCache[r]=o(r)}static createScript(...e){const t=e[0].scriptText;Function(t)()}static loadedFile(...e){return e[0].text}static createScriptElement(...e){const t=e[0],r=t.fileName,n=t.scriptText;let s=document.createElement("script");return s.id=r,s.text=n,document.head.appendChild(s),src}static createStyle(...e){const t=e[0],r=t.url,n=t.cssText;let s=document.createElement("style");return s.id=r,s.type="text/css",s.styleSheet?s.styleSheet.cssText=n:s.appendChild(document.createTextNode(n)),document.head.appendChild(s),s}static createLinkedStyle(...e){const t=e[0].url;let r=document.createElement("link");return r.id=t,r.type="text/css",r.rel="stylesheet",r.href=t,document.head.appendChild(r),r}static createConfig(...e){const t=e[0].configText;return assembly.loader[configFileName].config=JSON.parse(t),assembly.loader[configFileName].config}static get classInterceptor(){return Mrbr.System.Assembly._classInterceptor}static set classInterceptor(e){Mrbr.System.Assembly._classInterceptor=e}static get componentInterceptor(){return Mrbr.System.Assembly._componentInterceptor}static set componentInterceptor(e){Mrbr.System.Assembly._componentInterceptor=e}static get scriptInterceptor(){return Mrbr.System.Assembly._scriptInterceptor}static set scriptInterceptor(e){Mrbr.System.Assembly._scriptInterceptor=e}static get fileInterceptor(){return Mrbr.System.Assembly._fileInterceptor}static set fileInterceptor(e){Mrbr.System.Assembly._fileInterceptor=e}static get scriptElementInterceptor(){return Mrbr.System.Assembly._scriptElementInterceptor}static set scriptElementInterceptor(e){Mrbr.System.Assembly._scriptElementInterceptor=e}static get styleInterceptor(){return Mrbr.System.Assembly._styleInterceptor}static set styleInterceptor(e){Mrbr.System.Assembly._styleInterceptor=e}static get linkedStyleInterceptor(){return Mrbr.System.Assembly._linkedStyleInterceptor}static set linkedStyleInterceptor(e){Mrbr.System.Assembly._linkedStyleInterceptor=e}static get configInterceptor(){return Mrbr.System.Assembly._configInterceptor}static set configInterceptor(e){Mrbr.System.Assembly._configInterceptor=e}static loadClass(...e){const t=e[0];let r,n=[r="string"==typeof t?t:t.className],s=r;const o=Mrbr.System.Assembly,i=o.toObject,c=Mrbr.System.Assembly.resolveNamespaceToFile,l=o.loadClasses,a=o.setInheritance,m=o.addClassCtor,d=o.loadManifest,y=o.createClass;return s=c(r)+".js",new Promise(function(e,t){const c={url:s};o.loadFile(c).then(function(e){let t;if(!((t=i(r))instanceof Function)){const t={className:r,result:e,assembly:o,assemblyToObject:i};void 0===o._classInterceptor?y(t):o.classInterceptor.intercept(y,void 0,t)}}).catch(function(e){e instanceof Error&&t({name:"Exception",error:e,source:`${o.mrbrAssemblyTypeName}:loadClass`,info:`className: ${r}`}),t(e)}).then(function(){return new Promise(function(e,t){let n=i(r).manifest;null==n||0===n.length?e():d(n).then(function(){e()}).catch(function(e){t(e)})})}).catch(function(e){t(e)}).then(function(){let s=0,o=-1,c=[];return new Promise(function(e,t){const a=i(r),m=function(){o=s;const r=[],i=[a.using,a.inherits,a.newClasses];for(let e=0,t=i.length;e<t;e++){let t=i[e];if(void 0!==t)for(let e=0,n=t.length;e<n;e++){let n=t[e];r.includes(n)||r.push(n)}}s=r.length,n=n.concat(r).distinct(),l(r).then(function(t){let r=void 0===(c=t)?0:c.length;(s+=r)!=o?m():e()}).catch(function(e){t()})};m()}).catch(function(e){t(e)}).then(function(t){const r=[];if(void 0!==n&&n.length>0)for(let e,t=0,s=n.length;t<s;t++)if((e=i(n[t]))instanceof Function){const t=new Promise(function(t,r){a(e.inherits,e).then(function(r){a(e.extends,e).then(function(r){m(e),t()})}).catch(function(e){r()})});r.push(t)}Promise.all(r).then(t=>{e()})}).catch(function(e){t(e)})})})}static loadManifest(e){if(void 0===e)return Promise.resolve();const t=Mrbr.System.Assembly,r=Mrbr.System.ManifestEntry.FileTypes,n=t.loadClass,s=t.loadScript,o=t.loadScriptElement,i=t.loadFile,c=t.loadStyleElement,l=t.createLinkedStyleElement,a=(e=Array.isArray(e)?e:[e]).length;let m=new Array(a);for(let d,y=0;y<a;y++)switch((d=e[y]).fileType){case r.Class:m[y]=new Promise(function(e,t){const r={className:d.entryName};n(r).then(t=>e()).catch(function(e){t(e)})});break;case r.Component:m[y]=new Promise(function(e,r){const n={url:d.entryName};t.loadComponent(n).then(t=>e()).catch(function(e){r(e)})});break;case r.Script:m[y]=new Promise(function(e,t){const r={url:d.entryName};s(r).then(t=>e()).catch(function(e){t(e)})});break;case r.File:m[y]=new Promise(function(e,t){const r={url:d.entryName};i(r).then(t=>e()).catch(function(e){t(e)})});break;case r.ScriptElement:m[y]=new Promise(function(e,t){const r={url:d.entryName};o(r).then(t=>e()).catch(function(e){t(e)})});break;case r.Style:m[y]=new Promise(function(e,r){if(d.entryName.toLowerCase().endsWith(".css")){const t={url:d.entryName};c(t).then(t=>e()).catch(function(e){r(e)})}else{const n={url:`${t.resolveNamespaceToFile(d.entryName)}.css`};c(n).then(t=>e()).catch(function(e){r(e)})}});break;case r.LinkedStyle:m[y]=new Promise(function(e,r){if(d.entryName.toLowerCase().endsWith(".css")){const t={url:d.entryName};l(t).then(t=>e()).catch(function(e){r(e)})}else{const n={url:`${t.resolveNamespaceToFile(d.entryName)}.css`};l(n).then(t=>e()).catch(function(e){r(e)})}})}return Promise.all(m)}static loadScript(e){const t=Mrbr.System.Assembly,r=t.createScript;return new Promise(function(n,s){const o={url:e};t.loadFile(o).then(s=>{const o={fileName:e,scriptText:s};void 0===t._scriptInterceptor?r(o):t.scriptInterceptor.intercept(r,void 0,o),n()}).catch(function(e){s(e)})})}static loadScripts(e){if(void 0===e)return Promise.resolve();e=Array.isArray(e)?e:[e];const t=this.loadFile,r=e.length,n=new Array(r);for(let e,s=0;s<r;s++)e=filenames[s],n[s]=new Promise(function(r,n){t({url:e}).then(e=>r()).catch(function(e){n(e)})});return Promise.all(n)}static get ctorTokeniser(){return this._ctorTokeniser}static set ctorTokeniser(e){this._ctorTokeniser=e}static addClassCtor(e){if(void 0!==Object.getOwnPropertyDescriptor(e.prototype,"ctor"))return e;Mrbr.System.Assembly._ctorTokeniser||(Mrbr.System.Assembly._ctorTokeniser=new Mrbr.Utils.Parser.Tokeniser(Mrbr.System.Assembly.loader[Mrbr.System.Assembly.resolveNamespaceToFile("Mrbr.Utils.Parser.tokenCtor")+".json"].result));Mrbr.Utils.Parser.Tokeniser;const t=e.prototype.constructor.toString(),r=Mrbr.System.Assembly.ctorTokeniser.tokenise(t),n=Mrbr.Utils.Parser.Token,s=r.length,o=n.Groups,i=[];let c,l,a=[],m=!0,d=0,y=0,u=0,p=0,f=0,b=0,h=0,S=o.Keyword;for(;m&&d<s;)(c=r[d]).group===S&&"constructor"===c.type?m=!1:d++;m=!0;let v=o.Block;for(;m&&d<s;)(c=r[d]).group===v&&"("===c.value?(u=d,y=c.levels.parens,m=!1):d++;for(m=!0;m&&d<s;)(c=r[d]).group===v&&")"===c.value&&c.levels.parens===y?(p=d,m=!1):d++;if(p>u){for(let e=u+1;e<=p-1;e++)","===(c=r[e]).value&&c.levels.parens===y?(i.push(a.join("")),a=[]):a.push(c.value);a.length>0&&i.push(a.join(""))}for(m=!0;m&&d<s;)(c=r[d]).group===v&&"{"===c.value?(f=d,h=c.levels.braces,m=!1):d++;for(m=!0;m&&d<s;)(c=r[d]).group===v&&"}"===c.value&&c.levels.braces===h?(b=d,m=!1):d++;if(b>f&&void 0===Object.getOwnPropertyDescriptor(e.prototype,"ctor")){l=new Array(b-1);for(let e=f+1;e<=b-1;e++)l[e]=r[e].value;Object.defineProperty(e.prototype,"ctor",{value:0===i.length?Function(`\n${l.join("").trim()}\n`):Function(i,`\n${l.join("").trim()+`/* comment ctor ${e.prototype.mrbrAssemblyTypeName} */`}\n`),configurable:!1,enumerable:!0,writable:!1})}return void 0===Object.getOwnPropertyDescriptor(e.prototype,"base")&&Object.defineProperty(e.prototype,"base",{value:function(...t){void 0!==t&&0!==t.length||((t=[])[0]={}),t[0].called=t[0].called||[];const r=this,n=t[0].called,s=r.constructor.prototype;n.push(e.prototype.mrbrAssemblyTypeName.replace(/\./g,"_")+"_ctor");for(let e in s)!n.includes(e)&&e.endsWith("_ctor")&&"ctor"!==e&&(n.push(e),r[e](...t))},configurable:!1,enumerable:!0,writable:!1,name:"base"}),void 0===Object.getOwnPropertyDescriptor(e.prototype,"bases")&&Object.defineProperty(e.prototype,"bases",{value:function(){if(void 0!==e.prototype._bases)return e.prototype._bases;const t=[this.constructor.mrbrAssemblyTypeName];return Mrbr.System.Assembly.listClassInheritance(t,this.constructor),e.prototype._bases=t,e.prototype._bases},configurable:!1,enumerable:!0,writable:!1,name:"bases"}),e}static listClassInheritance(e,t){const r=Mrbr.System.Assembly;if(t.inherits&&t.mrbrAssemblyTypeName)for(let n=0,s=t.inherits.length,o=t.inherits;n<s;n++){let t=o[n];e.includes(t)||(e.push(t),r.listClassInheritance(e,r.toObject(t)))}}static loadClasses(e){if(void 0===e||0===e.length)return Promise.resolve();const t=Mrbr.System.Assembly,r=e.length,n=new Array(r);e=Array.isArray(e)?e:[e];for(let s,o=0;o<r;o++)s=e[o],n[o]=new Promise(function(e,r){t.loadClass(s).then(function(t){e(s)}).catch(function(e){r(e)})});return Promise.all(n)}static loadConfigFile(...e){const t=e[0].url,r=Mrbr.System.Assembly,n=r.createConfig;return new Promise(function(e,s){const o={url:t};r.loadFile(o).then(s=>{const o={configText:s};void 0===r._configInterceptor?n(o):r.configInterceptor.intercept(n,void 0,o),r.loader[t].config=JSON.parse(s),e()}).catch(function(e){s(e)})})}static loadConfigFiles(e){if(void 0===e||0===classes.length)return Promise.resolve();e=Array.isArray(e)?e:[e];const t=Mrbr.System.Assembly,r=e.length,n=new Array(r);for(let s,o=0;o<r;o++)s=e[o],n[o]=new Promise(function(e,r){const n={url:s};t.loadConfigFile(n).then(function(t){e(n)}).catch(function(e){r(e)})});return Promise.all(n)}static loadStyleElement(...e){const t=e[0].url,r=Mrbr.System.Assembly,n=r.createStyle;return new Promise(function(e,s){const o={url:t};r.loadFile(o).then(s=>{const o={url:t,cssText:s};void 0===r._styleInterceptor?n(o):r.styleInterceptor.intercept(n,void 0,o),e()}).catch(function(e){s(e)})})}static loadStyleElements(e){if(void 0===e||0===e.length)return Promise.resolve();e=Array.isArray(e)?e:[e];const t=Mrbr.System.Assembly,r=e.length,n=new Array(r);for(let s,o=0;o<r;o++)s=e[fileNameCounter],n[fileNameCounter]=new Promise(function(e,r){const n={url:filename};t.loadStyleElement(n).then(function(t){e(n)}).catch(function(e){r(e)})});return Promise.all(n)}static loadScriptElement(...e){const t=e[0].url,r=Mrbr.System.Assembly,n=r.createScriptElement;return new Promise(function(e,s){const o={url:t};r.loadFile(o).then(s=>{const o={fileName:t,scriptText:s};void 0===r._scriptElementInterceptor?n(o):r.scriptElementInterceptor.intercept(n,void 0,o),e()}).catch(function(e){s(e)})})}static loadScriptElements(e){if(void 0===e||0===e.length)return Promise.resolve();e=Array.isArray(e)?e:[e];const t=Mrbr.System.Assembly,r=e.length,n=new Array(r);for(let e,s=0;fileNamesCounter<r;s++)e=e[s],n[s]=new Promise(function(e,r){t.loadScriptElement(filename).then(function(t){e(filename)}).catch(function(e){r(e)})});return Promise.all(n)}static createLinkedScriptElement(...e){const t=e[0].url;let r=document.createElement("script");return r.id=t,r.src=t,document.head.appendChild(r),Promise.resolve()}static createLinkedScriptElements(e){if(void 0===filenames||0===filenames.length)return Promise.resolve();const t=Mrbr.System.Assembly;e=Array.isArray(filenames)?filenames:[filenames];let r=new Array(filenames.length);for(let n=0,s=e.length,o=filenames[n];n<s;n++)r[n]=new Promise(function(e,r){t.createLinkedScriptElement(o).then(function(t){e(o)}).catch(function(e){r(e)})});return Promise.all(r)}static createLinkedStyleElement(...e){const t=e[0].url,r=Mrbr.System.Assembly,n=r.createLinkedStyle,s={url:t};return void 0===r._linkedStyleInterceptor?n(s):r.linkedStyleInterceptor.intercept(n,void 0,s),Promise.resolve()}static createLinkedStyleElements(e){if(void 0===filenames||0===filenames.length)return Promise.resolve();const t=Mrbr.System.Assembly;e=Array.isArray(filenames)?filenames:[filenames];let r=new Array(filenames.length);for(let n=0,s=e.length,o=filenames[n];n<s;n++)r[n]=new Promise(function(e,r){t.createLinkedStyleElement(o).then(function(t){e(o)}).catch(function(e){r(e)})});return Promise.all(r)}static loadInterface(e){let t=e;const r=Mrbr.System.Assembly,n=r.toObject,s=Mrbr.System.Assembly.resolveNamespaceToFile,o=r.loadClasses,i=r.loadInterfaces,c=r.loadManifest;return t=s(e),t+=".json",new Promise(function(s,l){const a={url:t};r.loadFile(a).then(function(t){let a=n(e);void 0===a.mrbrInterfaceName&&((a=Object.assign(a,JSON.parse(t))).mrbrInterfaceName=e);let m=[];a.inherits&&a.inherits.length>0&&m.push(i(a.inherits)),a.using&&a.using.length>0&&m.push(o(a.using)),a.interfaces&&a.interfaces.length>0&&m.push(i(a.interfaces)),a.manifest&&a.manifest.length>0&&m.push(c(a.manifest)),Promise.all(m).then(()=>{r.setInterfaceInheritance(a.inherits,e),s()}).catch(function(e){l(e)})})})}static loadInterfaces(e){if(void 0===e||0===e.length)return Promise.resolve();const t=Mrbr.System.Assembly;e=Array.isArray(e)?e:[e];let r=new Array(e.length);for(let n=0,s=e.length,o=e[n];n<s;n++)r[n]=new Promise(function(e,r){t.loadInterface(o).then(function(t){e(o)}).catch(function(e){r(e)})});return Promise.all(r)}static setInterfaceInheritance(e,t){if(void 0===e)return;e=Array.isArray(e)?e:[e];const r=Mrbr.System.Assembly,n=r.toObject(t);n.inherited||(n.inherited=[]);for(let t,s=0,o=e.length,i=r.toObject(t);s<o;s++)t=e[s],n.inherited.includes(t)||(n.inherited.push(t),i.inherited&&(n.inherited=n.inherited.concat(i.inherited)),i.properties&&(n.properties=Object.assign(n.properties,i.properties)),i.methods&&(n.methods=Object.assign(n.methods,i.methods)))}static setInheritance(e,t){return void 0===e?Promise.resolve():Mrbr.System.Inheritance.applyInheritance(e,t)}static initialised(e){const t=Mrbr.System.Assembly;if(e&&void 0!==e.loadFile?t.loadFile=e.loadFile:"undefined"==typeof fetch?t.loadFile=t.loadXmlHttpFile:t.loadFile=t.fetchFile,e&&e.defaultContext)t._defaultContext=e.defaultContext;else if("undefined"==typeof window)if("undefined"!=typeof globalThis)t._defaultContext=globalThis;else{if("undefined"==typeof global)throw"No global";t._defaultContext=global}else window?t._defaultContext=window:t._defaultContext=void 0;return null!=e&&void 0!==e.assemblyResolvers&&null!==e.assemblyResolvers&&(t.fileReplacements=e.assemblyResolvers),t._loader={},t._objectCache={},t.setArrayPolyFills(),new Promise(function(e,r){t.loadFile({url:Mrbr.System.Assembly.resolveNamespaceToFile("Mrbr.Utils.Parser.tokenCtor")+".json"}).then(()=>t.loadClass("Mrbr.Utils.Parser.Tokeniser")).then(()=>t.loadClass("Mrbr.System.Object")).then(()=>t.loadClass("Mrbr.Interceptor.Interceptor")).then(()=>{const e=Mrbr.Interceptor.Interceptor;t._classInterceptor=new e,t._componentInterceptor=new e,t._scriptInterceptor=new e,t._fileInterceptor=new e,t._scriptElementInterceptor=new e,t._styleInterceptor=new e,t._linkedStyleInterceptor=new e,t._configInterceptor=new e}).catch(e=>console.log(e)).then(()=>t.loadClass("Mrbr.System.ManifestEntry")).then(()=>t.loadClass("Mrbr.System.Inheritance")).then(()=>t.loadClass("Mrbr.System.Exception")).then(function(){return Function(t.addTypeNameScript("Mrbr.System.Assembly"))(),t.loadClasses(t.using)}).then(function(){e()}).catch(function(e){r(e)})})}static onReady(e,t){let r,n=function(){document.removeEventListener?(document.removeEventListener("DOMContentLoaded",n),document.removeEventListener("load",n),window.removeEventListener("load",n),window.removeEventListener("DOMContentLoaded",n)):(document.detachEvent("onreadystatechange",n),window.detachEvent("onload",n),window.detachEvent("load",n),document.detachEvent("load",n)),r()};return new Promise(function(t,s){r=t,Mrbr.System.Assembly.initialised(e).then(function(){document.onreadystatechange=function(){"complete"===document.readyState&&n()},"complete"===document.readyState?t("complete"):document.addEventListener?(document.addEventListener("DOMContentLoaded",n),window.addEventListener("load",n),window.addEventListener("DOMContentLoaded",n),document.addEventListener("load",n)):(document.attachEvent("onreadystatechange",n),window.attachEvent("onload",n),document.attachEvent("load",n),window.attachEvent("load",n))})})}static createNamespaceManifest(e,t,r){if(void 0===e||void 0===t||void 0===r||0===r.length)return[];const n=r.length;let s=new Array(n),o=Mrbr.System.ManifestEntry;for(let i=0;i<n;i++)s[i]=new o(t,`${e}.${r[i]}`);return s}};
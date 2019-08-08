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
/**
 *  Create a base namespace for the Assembly class
 */
var Mrbr = Mrbr || {};
Mrbr.System = Mrbr.System || {}
/**
 * Assembly class for   defining Namespaces, 
 *                       loading classes,
*                       setting inheritence, 
*                       loading requirements,
*                       maintaining loaded file list. 
*/
Mrbr.System.Assembly = class {
    /**
     *  Currently all functions are static.
     */
    constructor() {
        Mrbr.System.Assembly._fileReplacements = [
            { replace: new RegExp("^Mrbr\\."), with: "/" },
            { replace: new RegExp("\\.", "g"), with: "/" }
        ];
        //const mTokeniser = Mrbr.Utils.Parser.Tokeniser;
        //tokenString = classType.prototype.constructor.toString();
    }
    /**
     * Load classes required by assembly function
     */
    //static get using() { return ["Mrbr.System.ManifestEntry", "Mrbr.System.Interface"] }
    /**
     * 
     * @param  {...any} args    create a namespaced object 
     *                           ...any =   two arguments 
     *                                      {object}    argument[0] =   container object
     *                                      {string}    argument[1] =   new namespaced object
     *                           ...any =   one arguments 
     *                                      {string}    argument[0] =   new namespaced object created in Window                                                   
     * @returns {object}        either a new namespaced object or the existing object
     */
    static toObject(...args) {
        var defaultContext = Mrbr.System.Assembly.defaultContext;
        const argCount = args.length,
            objectName = args[argCount - 1],
            assembly = Mrbr.System.Assembly;
        let target;
        if ((argCount === 1)) { target = defaultContext }
        else { target = args[0]; }
        if (assembly.objectCache[objectName] !== undefined) { return assembly.objectCache[objectName] }
        const nsParts = args[argCount - 1].split(".");
        let currentObject = target;
        for (let nsCounter = 0, partName, nsPartsLength = nsParts.length; nsCounter < nsPartsLength; nsCounter++) {
            partName = nsParts[nsCounter];
            currentObject = currentObject[partName] !== undefined ? currentObject[partName] : currentObject[partName] = {};
        }
        Mrbr.System.Assembly[objectName] = currentObject
        return currentObject;
    }

    static get defaultContext() { return Mrbr.System.Assembly._defaultContext; }
    static set defaultContext(value) { Mrbr.System.Assembly._defaultContext = value; }
    static get objectCache() {
        return Mrbr.System.Assembly._objectCache
    }
    /**
     * @deprecated
     * @param  {...any} args 
     */
    static isObject(...args) {
        return ObjectUtils.toObject(...args) !== undefined
    }

    static fetchFile(...args) {
        let prms = args[0],
            url,
            fileAlias,
            formattedUrl;
        if (typeof prms === 'string') {
            fileAlias = prms;
            url = prms;
            formattedUrl = url;
        }
        else if (typeof prms === 'object') {
            url = prms.url;
            formattedUrl = prms.formatUrl ? prms.formatUrl : url;
            fileAlias = prms.alias ? prms.alias : url;
        }
        else if (Mrbr.System.Object.typeMatch(prms, "Mrbr.System.ManifestEntry")) {
            fileAlias = prms.alias;
            formattedUrl = prms.formatUrl;
            url = prms.url;
        }
        else {
            throw "Unknown class entry request"
        }



        const assembly = Mrbr.System.Assembly,
            loader = assembly.loader,
            assemblyLoadedFile = assembly.loadedFile;
        if (loader[url]) {
            let loadUrlObject = loader[url];
            if (loadUrlObject.loaded === true) {
                return Promise.resolve();
            }
            else {
                return loadUrlObject.promise;
            }
        }
        else {
            let resolver,
                rejecter,
                prm = new Promise((resolve, reject) => {
                    resolver = resolve;
                    rejecter = reject;
                });
            loader[url] = { promise: prm, result: undefined, loaded: false };
            fetch(formattedUrl, {
                method: 'GET'
            })
                .then(response => response.text()
                    .then(text => {
                        loader[url].result = text;
                        loader[url].loaded = true;
                        delete loader[url].promise
                        const prm = { url: url, text: text }
                        text = assembly._fileInterceptor === undefined ? assemblyLoadedFile(prm) : assembly.fileInterceptor.intercept(assemblyLoadedFile, undefined, prm)[1]
                        resolver(text);
                    })
                    .catch(function (error) { rejecter(error) }))
                .catch(function (error) { rejecter(error) })
            //if (fileAlias !== url) {                loader[fileAlias] = loader[url];            }
            return prm;
        }
    }

    /**
     * 
     * @param {string} url load a file from a url
     * @returns {Promise} promise for when file has loaded or existing promise of file if it is loading or has loaded
     */
    static loadXmlHttpFile(url) {
        const loader = Mrbr.System.Assembly.loader;
        if (loader.hasOwnProperty(url)) {
            let loadUrlObject = loader[url];
            if (loadUrlObject.loaded === true) {
                return Promise.resolve();
            }
            else {
                return loadUrlObject.promise;
            }
        }
        else {

            let resolver,
                rejecter,
                prm = new Promise((resolve, reject) => {
                    resolver = resolve;
                    rejecter = reject;
                });
            const xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", url, true);
            xmlHttp.send("");
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState === 4) {
                    if (xmlHttp.status >= 200 && xmlHttp.status < 300) {
                        loader[url].result = xmlHttp.responseText;
                        loader[url].loaded = true;
                        delete loader[url].promise
                        const prm = { url: url, text: xmlHttp.responseText }
                        const text = assembly._fileInterceptor === undefined ? assemblyLoadedFile(prm) : assembly.fileInterceptor.intercept(assemblyLoadedFile, undefined, prm)[1]
                        resolver(text);
                    } else {
                        rejecter(new Error(xmlHttp.statusText));
                    }
                }
            }
            loader[url] = { promise: prm, result: undefined, loaded: false };
            return prm;
        }
    }
    static loadFile(filename) { }
    static loadFiles(files) {
        if (files === undefined) { return Promise.resolve(); }
        if (!Array.isArray(files)) { files = [files] }
        const fileCount = files.length,
            retval = new Array(fileCount),
            assemblyLoadFile = Mrbr.System.Assembly.loadFile;
        for (let fileCounter = 0; fileCounter < fileCount; fileCounter++) {
            retval[fileCounter] = assemblyLoadFile(files[fileCounter]);
        }
        return Promise.all(retval);
    }
    /**
     * Property name added to each loaded class returns full namespaced object name
     */
    static get typePropertyName() { return "mrbrAssemblyTypeName" }
    /**
     * 
     * @param {string} className script source to run to add  full namespaced object name to loaded class
     */
    static addTypeNameScript(className) {
        const assembly = Mrbr.System.Assembly;
        return `\nObject.defineProperty(${className}.prototype, '${assembly.typePropertyName}', { get: function() {return ${className}.${assembly.typePropertyName};}});\n${className}.${assembly.typePropertyName} = "${className}";`
    }
    /**
     * Default Collection of replacements of namespaces to files
     */
    static get fileReplacements() {
        return Mrbr.System.Assembly._fileReplacements;
    }
    static set fileReplacements(value) {
        Mrbr.System.Assembly._fileReplacements = value;
    }
    static resolveNamespaceToFile(className) {
        let fileName = className;
        for (let replacementCounter = 0, replacements = Mrbr.System.Assembly._fileReplacements, replacementCount = replacements.length, replacement; replacementCounter < replacementCount; replacementCounter++) {
            replacement = replacements[replacementCounter];
            fileName = `${fileName.split(replacement.replace).join(replacement.with)}`
        }
        return fileName;
    }
    /**
     * non-operation for when function only needs to be called once, replaced on prototype and called instead
     */
    static nop() { }
    /**
     * polyfill for array distinct
     */
    static setArrayPolyFills() {
        if (!Object.getOwnPropertyDescriptor(Array.prototype, "distinct")) {
            Array.prototype.distinct = function () {
                return this.filter((value, index, arr) => {
                    return arr.indexOf(value) === index;
                });
            }
        }
        Array.prototype.tokenSort = function () {
            return this.sort(function (token1, token2) { return token1.start - token2.start; })
        }
        Mrbr.System.Assembly.setArrayPolyFills = Mrbr.System.Assembly.nop;
    }
    /**
     * Static object of all files loaded through Assembly
     */
    static get loader() { return Mrbr.System.Assembly._loader; }
    static loadComponent(...args) {
        let componentName,
            componentAlias,
            isManifestEntry = false;
        const prms = args[0];

        if (typeof prms === 'string') {
            componentAlias = prms;
            componentName = prms;
        }
        else if (typeof prms === 'object') {
            componentName = prms.entryName;
            componentAlias = prms.alias ? prms.alias : prms.entryName;
        }
        else if (Mrbr.System.Object.typeMatch(prms, "Mrbr.System.ManifestEntry")) {
            componentAlias = prms.alias;
            componentName = prms.entryName;
            isManifestEntry = true;
        }
        else {
            throw "Unknown component entry request"
        }

        const assembly = Mrbr.System.Assembly,
            assemblyToObject = assembly.toObject,
            makeFileReplacements = Mrbr.System.Assembly.resolveNamespaceToFile,
            assemblyLoadClasses = assembly.loadClasses,
            assemblySetInheritance = assembly.setInheritance,
            assemblyAddClassCtor = assembly.addClassCtor,
            assemblyLoadManifest = assembly.loadManifest,
            assemblyCreateComponent = assembly.createComponent;
        let fileName = makeFileReplacements(componentName) + ".js";
        return new Promise(function (resolve, reject) {
            let manifestEntry;
            if (isManifestEntry) {
                prms.url = fileName;
                prms.alias = componentAlias;
                manifestEntry = prms;
            }
            else {
                manifestEntry = new Mrbr.System.ManifestEntry(Mrbr.System.ManifestEntry.FileTypes.Component, componentName, componentAlias, fileName);
            }
            //const prmfn = isManifestEntry = true ? Mrbr.System.Manifest{ url: fileName, alias: componentAlias }
            assembly.loadFile(manifestEntry)
                .then(function (result) {
                    if (!(assemblyToObject(componentName) instanceof Function)) {
                        const prm = { componentName: componentName, result: result, assembly: assembly, assemblyToObject: assemblyToObject };
                        assembly._componentInterceptor === undefined ? assemblyCreateComponent(prm) : assembly.componentInterceptor.intercept(assemblyCreateComponent, undefined, prm);
                    }
                    if (!(assemblyToObject(componentAlias) instanceof Function)) {
                        const prm = { componentName: componentAlias, result: result, assembly: assembly, assemblyToObject: assemblyToObject };
                        assembly._componentInterceptor === undefined ? assemblyCreateComponent(prm) : assembly.componentInterceptor.intercept(assemblyCreateComponent, undefined, prm);
                    }
                    resolve();
                })
                .catch(function (error) {
                    reject(error);
                })
        })
    }
    static createClass(...args) {
        const prms = args[0],
            className = prms.className,
            result = prms.result,
            assembly = prms.assembly,
            assemblyToObject = prms.assemblyToObject;
        Function(`${className} = ${result};\n${assembly.addTypeNameScript(className)};\n`)();
        assembly.objectCache[className] = assemblyToObject(className);
    }
    static createComponent(...args) {
        const prms = args[0],
            componentName = prms.componentName,
            result = prms.result,
            assembly = prms.assembly,
            assemblyToObject = prms.assemblyToObject;
        Function(`${componentName} = ${result};\ncustomElements.define('${componentName.toLowerCase().split(".").join("-")}', ${componentName});`)();
        assembly.objectCache[componentName] = assemblyToObject(componentName);
    }
    static createScript(...args) {
        const prms = args[0],
            scriptText = prms.scriptText;
        Function(scriptText)();
    }
    static loadedFile(...args) {
        const prms = args[0],
            text = prms.text;
        return text;
    }
    static createScriptElement(...args) {
        const prms = args[0],
            fileName = prms.fileName,
            sourceText = prms.scriptText;
        let scr = document.createElement("script");
        scr.id = fileName;
        scr.text = sourceText;
        document.head.appendChild(scr);
        return src;
    }
    static createStyle(...args) {
        const prms = args[0],
            fileName = prms.url,
            cssText = prms.cssText;
        let css = document.createElement("style");
        css.id = fileName;
        css.type = 'text/css';
        if (css.styleSheet) {
            css.styleSheet.cssText = cssText;
        } else {
            css.appendChild(document.createTextNode(cssText));
        }
        document.head.appendChild(css);
        return css;
    }
    static createLinkedStyle(...args) {
        const prms = args[0],
            fileName = prms.url;
        let css = document.createElement('link');
        css.id = fileName
        css.type = 'text/css';
        css.rel = 'stylesheet';
        css.href = fileName;
        document.head.appendChild(css);
        return css;
    }


    static createConfig(...args) {
        const prms = args[0],
            configText = prms.configText;
        assembly.loader[configFileName].config = JSON.parse(configText);
        return assembly.loader[configFileName].config;
    }

    static get classInterceptor() { return Mrbr.System.Assembly._classInterceptor; }
    static set classInterceptor(value) { Mrbr.System.Assembly._classInterceptor = value; }
    static get componentInterceptor() { return Mrbr.System.Assembly._componentInterceptor; }
    static set componentInterceptor(value) { Mrbr.System.Assembly._componentInterceptor = value; }
    static get scriptInterceptor() { return Mrbr.System.Assembly._scriptInterceptor; }
    static set scriptInterceptor(value) { Mrbr.System.Assembly._scriptInterceptor = value; }
    static get fileInterceptor() { return Mrbr.System.Assembly._fileInterceptor; }
    static set fileInterceptor(value) { Mrbr.System.Assembly._fileInterceptor = value; }
    static get scriptElementInterceptor() { return Mrbr.System.Assembly._scriptElementInterceptor; }
    static set scriptElementInterceptor(value) { Mrbr.System.Assembly._scriptElementInterceptor = value; }
    static get styleInterceptor() { return Mrbr.System.Assembly._styleInterceptor; }
    static set styleInterceptor(value) { Mrbr.System.Assembly._styleInterceptor = value; }
    static get linkedStyleInterceptor() { return Mrbr.System.Assembly._linkedStyleInterceptor; }
    static set linkedStyleInterceptor(value) { Mrbr.System.Assembly._linkedStyleInterceptor = value; }
    static get configInterceptor() { return Mrbr.System.Assembly._configInterceptor; }
    static set configInterceptor(value) { Mrbr.System.Assembly._configInterceptor = value; }

    /**
     * 
     * @param {string} className    load file from namespaced object name
     *                              Mrbr.System.Inheritance loads file /system/inheritance.js
     *                              load associated files, inherited and usings
     * @returns {Promise}           when class and all associated files are loaded
     */
    static loadClass(...args) {
        const prms = args[0];
        let classAlias;
        let className,
            isManifestEntry = false;
        if (typeof prms === 'string') {
            classAlias = prms;
            className = prms;
        }
        else if (typeof prms === 'object') {
            className = prms.entryName;// prms.className;
            classAlias = prms.alias ? prms.alias : prms.entryName;
        }
        else if (Mrbr.System.Object.typeMatch(prms, "Mrbr.System.ManifestEntry")) {
            classAlias = prms.alias;
            className = prms.entryName;//className;
            isManifestEntry = true;
        }
        else {
            throw "Unknown class entry request"
        }
        let classNames = [className],
            fileName = className;
        const assembly = Mrbr.System.Assembly,
            assemblyToObject = assembly.toObject,
            makeFileReplacements = Mrbr.System.Assembly.resolveNamespaceToFile,
            assemblyLoadClasses = assembly.loadClasses,
            assemblySetInheritance = assembly.setInheritance,
            assemblyAddClassCtor = assembly.addClassCtor,
            assemblyLoadManifest = assembly.loadManifest,
            assemblyCreateClass = assembly.createClass;
        fileName = makeFileReplacements(className) + ".js"
        return new Promise(function (resolve, reject) {
            let manifestEntry;
            if (isManifestEntry) {
                prms.url = fileName;
                prms.alias = classAlias;
                manifestEntry = prms;
            }
            else if (typeof Mrbr.System.ManifestEntry !== 'undefined') {
                manifestEntry = new Mrbr.System.ManifestEntry(Mrbr.System.ManifestEntry.FileTypes.Class, className, classAlias, fileName);
            }
            else {
                manifestEntry = {
                    fileType: "class",
                    entryName: className,
                    alias: classAlias,
                    url: fileName,
                    formatUrl: fileName.toLowerCase()
                }
            }
            //const prmfn = { url: fileName, alias: classAlias }
            assembly.loadFile(manifestEntry)
                .then(function (result) {
                    let obj;
                    if (!((obj = assemblyToObject(className)) instanceof Function)) {
                        const prm = { className: className, result: result, assembly: assembly, assemblyToObject: assemblyToObject };
                        assembly._classInterceptor === undefined ? assemblyCreateClass(prm) : assembly.classInterceptor.intercept(assemblyCreateClass, undefined, prm)
                    }
                    if (!((obj = assemblyToObject(classAlias)) instanceof Function)) {
                        const prm = { className: classAlias, result: result, assembly: assembly, assemblyToObject: assemblyToObject };
                        assembly._classInterceptor === undefined ? assemblyCreateClass(prm) : assembly.classInterceptor.intercept(assemblyCreateClass, undefined, prm)
                    }
                })
                .catch(function (error) {
                    if (error instanceof Error) {
                        //reject(new Mrbr.System.Exception({ name: "Exception", error: error, source: `${assembly.mrbrAssemblyTypeName}:loadClass`, info: `className: ${className}` }))
                        reject({ name: "Exception", error: error, source: `${assembly.mrbrAssemblyTypeName}:loadClass`, info: `className: ${classAlias}` })
                    }
                    reject(error)
                })
                .then(function () {
                    return new Promise(function (resolveLoadingManifest, rejectLoadingManifest) {
                        let obj = assemblyToObject(className),
                            loadManifest = obj.manifest;
                        if (loadManifest === undefined || loadManifest === null || loadManifest.length === 0) {
                            resolveLoadingManifest();
                        }
                        else {
                            assemblyLoadManifest(loadManifest)
                                .then(function () {
                                    resolveLoadingManifest()
                                })
                                .catch(function (error) {
                                    rejectLoadingManifest(error)
                                });
                        }
                    })
                })
                .catch(function (error) {
                    reject(error)
                })
                .then(function () {
                    let toloadCount = 0,
                        lastToloadCount = -1,
                        newClasses = [];
                    return new Promise(function (resolveLoadClasses, rejectLoadClasses) {
                        const obj = assemblyToObject(className),
                            loopLoadClasses = function () {
                                lastToloadCount = toloadCount;
                                const toload = [],
                                    objLoads = [
                                        obj.using,
                                        obj.inherits,
                                        obj.newClasses
                                    ]
                                for (let objLoadsCounter = 0, objLoadsCount = objLoads.length; objLoadsCounter < objLoadsCount; objLoadsCounter++) {
                                    let objLoadsEntry = objLoads[objLoadsCounter];
                                    if (objLoadsEntry === undefined) { continue; }
                                    for (let objLoadsEntryCounter = 0, objLoadsEntryCount = objLoadsEntry.length; objLoadsEntryCounter < objLoadsEntryCount; objLoadsEntryCounter++) {
                                        let objLoadEntry = objLoadsEntry[objLoadsEntryCounter]
                                        if (toload.includes(objLoadEntry)) { continue; }
                                        toload.push(objLoadEntry)
                                    }
                                }
                                toloadCount = toload.length;
                                classNames = classNames.concat(toload).distinct();
                                assemblyLoadClasses(toload)
                                    .then(function (result) {
                                        newClasses = result;
                                        let count = ((newClasses === undefined) ? 0 : newClasses.length)
                                        toloadCount += count;
                                        if (toloadCount != lastToloadCount) {
                                            loopLoadClasses();
                                        }
                                        else {
                                            resolveLoadClasses();
                                        }
                                    })
                                    .catch(function (error) {
                                        rejectLoadClasses();
                                    });
                            }
                        loopLoadClasses();
                    })
                        .catch(function (error) {
                            reject(error)
                        })
                        .then(function (result1) {
                            const arrCtors = [];
                            if (classNames !== undefined && classNames.length > 0) {
                                for (let classNameCounter = 0, classNameCount = classNames.length, obj; classNameCounter < classNameCount; classNameCounter++) {
                                    if ((obj = assemblyToObject(classNames[classNameCounter])) instanceof Function) {
                                        const prm1 = new Promise(function (prm1resolve, prm1reject) {
                                            assemblySetInheritance(obj.inherits, obj)
                                                .then(function (res) {
                                                    assemblySetInheritance(obj.extends, obj)
                                                        .then(function (res2) {
                                                            assemblyAddClassCtor(obj);
                                                            prm1resolve()
                                                        })
                                                })
                                                .catch(function (error) {
                                                    prm1reject()
                                                })
                                        })
                                        arrCtors.push(prm1);
                                    }
                                };
                            }
                            Promise.all(arrCtors)
                                .then(r2 => {
                                    resolve()
                                })
                        })
                        .catch(function (error) {
                            reject(error)
                        })
                });
        })
    }
    /**
     * 
     * @param {ManifestEntry[]} manifest load an array of manifest entries, script or classes
     */
    static loadManifest(manifest) {
        if (manifest === undefined) { return Promise.resolve() }
        const assembly = Mrbr.System.Assembly,
            fileTypes = Mrbr.System.ManifestEntry.FileTypes,
            assemblyLoadClass = assembly.loadClass,
            assemblyLoadScript = assembly.loadScript,
            assemblyLoadScriptElement = assembly.loadScriptElement,
            assemblyLoadFile = assembly.loadFile,
            assemblyLoadStyle = assembly.loadStyleElement,
            assemblyLinkedStyle = assembly.createLinkedStyleElement;
        manifest = (Array.isArray(manifest) ? manifest : [manifest])
        const manifestCount = manifest.length;
        let arrManifest = new Array(manifestCount);
        for (let manifestCounter = 0, manifestEntry; manifestCounter < manifestCount; manifestCounter++) {
            manifestEntry = manifest[manifestCounter];
            switch (manifestEntry.fileType) {
                case fileTypes.Class:
                    arrManifest[manifestCounter] = new Promise(function (resolve, reject) {
                        //const prmfn = { className: manifestEntry.entryName }
                        const prmfn = manifestEntry
                        assemblyLoadClass(prmfn)
                            .then(result => resolve())
                            .catch(function (error) {
                                reject(error)
                            });
                    })
                    break;
                case fileTypes.Component:
                    arrManifest[manifestCounter] = new Promise(function (resolve, reject) {
                        const prmfn = manifestEntry;// { componentName: manifestEntry.entryName }
                        assembly.loadComponent(prmfn)
                            .then(result => resolve())
                            .catch(function (error) {
                                reject(error)
                            });
                    })
                    break;
                case fileTypes.Script:
                    arrManifest[manifestCounter] = new Promise(function (resolve, reject) {
                        const prmfn = { url: manifestEntry.entryName }
                        assemblyLoadScript(prmfn)
                            .then(result => resolve())
                            .catch(function (error) {
                                reject(error)
                            });
                    })
                    break;
                case fileTypes.File:
                    arrManifest[manifestCounter] = new Promise(function (resolve, reject) {
                        const prmfn = { url: manifestEntry.entryName }
                        assemblyLoadFile(prmfn).then(result => resolve())
                            .catch(function (error) {
                                reject(error)
                            });
                    })
                    break;
                case fileTypes.ScriptElement:
                    arrManifest[manifestCounter] = new Promise(function (resolve, reject) {
                        const prmfn = { url: manifestEntry.entryName }
                        assemblyLoadScriptElement(prmfn).then(result => resolve())
                            .catch(function (error) {
                                reject(error)
                            });
                    })
                    break;
                case fileTypes.Style:
                    arrManifest[manifestCounter] = new Promise(function (resolve, reject) {
                        if (manifestEntry.entryName.toLowerCase().endsWith(".css")) {
                            const prmfn = { url: manifestEntry.entryName.toLowerCase(), formatUrl: manifestEntry.entryName.toLowerCase() }
                            assemblyLoadStyle(prmfn).then(result => resolve())
                                .catch(function (error) {
                                    reject(error)
                                });
                        }
                        else {
                            const prmfn = { url: `${assembly.resolveNamespaceToFile(manifestEntry.entryName)}.css`.toLowerCase(), formatUrl: `${assembly.resolveNamespaceToFile(manifestEntry.entryName)}.css`.toLowerCase() }
                            assemblyLoadStyle(prmfn).then(result => resolve())
                                .catch(function (error) {
                                    reject(error)
                                });
                        }
                    });
                    break;
                case fileTypes.LinkedStyle:
                    arrManifest[manifestCounter] = new Promise(function (resolve, reject) {
                        if (manifestEntry.entryName.toLowerCase().endsWith(".css")) {
                            const prm = { url: manifestEntry.entryName.toLowerCase(), formatUrl: manifestEntry.entryName.toLowerCase() }
                            assemblyLinkedStyle(prm).then(result => resolve()).catch(function (error) {
                                reject(error)
                            });
                        }
                        else {
                            const prm = { url: `${assembly.resolveNamespaceToFile(manifestEntry.entryName)}.css`.toLowerCase(), formatUrl: `${assembly.resolveNamespaceToFile(manifestEntry.entryName)}.css`.toLowerCase() }
                            assemblyLinkedStyle(prm).then(result => resolve()).catch(function (error) {
                                reject(error)
                            });
                        }
                    });
                    break;
            }
        }
        return Promise.all(arrManifest);
    }
    /**
     * 
     * @param {string} fileName load script from filename
     * @returns {Promise} Promise for script being loaded
     */
    static loadScript(fileName) {
        const assembly = Mrbr.System.Assembly,
            assemblyCreateScript = assembly.createScript;
        return new Promise(function (resolve, reject) {
            const prmfn = { url: fileName }
            assembly.loadFile(prmfn)
                .then(result => {
                    const prm = { fileName: fileName, scriptText: result };
                    assembly._scriptInterceptor === undefined ? assemblyCreateScript(prm) : assembly.scriptInterceptor.intercept(assemblyCreateScript, undefined, prm)
                    resolve();
                })
                .catch(function (error) {
                    reject(error)
                });
        });
    }
    /**
     * 
     * @param {string or string[]} fileNames load array of scripts from filenames
     * @returns {Promise.all} Promises for all loading scripts
     */
    static loadScripts(fileNames) {
        if (fileNames === undefined) { return Promise.resolve(); }
        fileNames = Array.isArray(fileNames) ? fileNames : [fileNames];
        const assembly = this,
            assemblyLoadFile = assembly.loadFile,
            fileNamesCount = fileNames.length,
            arrFileNames = new Array(fileNamesCount);
        for (let fileNameCounter = 0, filename; fileNameCounter < fileNamesCount; fileNameCounter++) {
            filename = filenames[fileNameCounter];
            arrFileNames[fileNameCounter] = new Promise(function (resolve, reject) {
                const prmfn = { url: filename }
                assemblyLoadFile(prmfn).then(result => resolve())
                    .catch(function (error) {
                        reject(error)
                    })
            })
        }
        return Promise.all(arrFileNames);
    }
    static get ctorTokeniser() { return this._ctorTokeniser; }
    static set ctorTokeniser(value) { this._ctorTokeniser = value; }
    /**
     * 
     * @param {class} classType  copies source code from Class constructor to a class' function ctor
     * If ctor already exists, created by user at design time or from previous load then it will not be created again
     * Parses class and finds constructor in source code. Creates a duplicate Function called ctor on class with same arguments and source code
     * @returns {class} returns passed in classType
     */
    static addClassCtor(classType) {

        if (Object.getOwnPropertyDescriptor(classType.prototype, "ctor") !== undefined) { return classType; }
        if (!Mrbr.System.Assembly._ctorTokeniser) {
            Mrbr.System.Assembly._ctorTokeniser = new Mrbr.Utils.Parser.Tokeniser(Mrbr.System.Assembly.loader[Mrbr.System.Assembly.resolveNamespaceToFile("Mrbr.Utils.Parser.tokenCtor") + ".json"].result);
        }
        const mTokeniser = Mrbr.Utils.Parser.Tokeniser,
            tokenString = classType.prototype.constructor.toString(),
            tokeniser = Mrbr.System.Assembly.ctorTokeniser,
            tokens = tokeniser.tokenise(tokenString),
            Token = Mrbr.Utils.Parser.Token,
            tokensLength = tokens.length,
            TokenGroups = Token.Groups,
            fnArgs = [];
        let fnArguments = [],
            searching = true,
            counter = 0,
            argumentLevel = 0,
            argumentStart = 0,
            argumentEnd = 0,
            bodyStart = 0,
            bodyEnd = 0,
            bodyLevel = 0,
            currToken,
            arrBody;
        //  find text for start of constructor is source text
        let tokenGroupsKeyword = TokenGroups.Keyword;
        while (searching && counter < tokensLength) {
            currToken = tokens[counter]
            if (currToken.group === tokenGroupsKeyword && currToken.type === 'constructor') {
                searching = false;
            }
            else {
                counter++;
            }
        }
        //  Find start of parenthesis for arguments
        searching = true;
        let tokenGroupsBlock = TokenGroups.Block
        while (searching && counter < tokensLength) {
            currToken = tokens[counter];
            if (currToken.group === tokenGroupsBlock && currToken.value === "(") {
                argumentStart = counter;
                argumentLevel = currToken.levels.parens;
                searching = false;
            }
            else {
                counter++;
            }
        }
        //  Find end of parenthesis for arguments
        searching = true;
        while (searching && counter < tokensLength) {
            currToken = tokens[counter];
            if (currToken.group === tokenGroupsBlock && currToken.value === ")" && currToken.levels.parens === argumentLevel) {
                argumentEnd = counter;
                searching = false;
            }
            else {
                counter++;
            }
        }
        // Convert Tokens to arguments list
        if (argumentEnd > argumentStart) {
            for (let counter = argumentStart + 1; counter <= argumentEnd - 1; counter++) {
                currToken = tokens[counter]
                if (currToken.value === "," && currToken.levels.parens === argumentLevel) {
                    fnArgs.push(fnArguments.join(""))
                    fnArguments = [];
                }
                else {
                    fnArguments.push(currToken.value)
                }
            }
            if (fnArguments.length > 0) {
                fnArgs.push(fnArguments.join(""))
            }
        }
        // find start of constructor body text
        searching = true;
        while (searching && counter < tokensLength) {
            currToken = tokens[counter];
            if (currToken.group === tokenGroupsBlock && currToken.value === "{") {
                bodyStart = counter;
                bodyLevel = currToken.levels.braces;
                searching = false;
            }
            else {
                counter++;
            }
        }
        // find end of constructor body text
        searching = true;
        while (searching && counter < tokensLength) {
            currToken = tokens[counter];
            if (currToken.group === tokenGroupsBlock && currToken.value === "}" && currToken.levels.braces === bodyLevel) {
                bodyEnd = counter;
                searching = false;
            }
            else {
                counter++;
            }
        }
        //  Create callable version of classType's constructor.
        //  Allows inheritance to call ctor on all inheritable classes
        //  Allows multiple inheritance calls instead of calling super when using extends
        //try {
        if (bodyEnd > bodyStart && (Object.getOwnPropertyDescriptor(classType.prototype, "ctor") === undefined)) {
            arrBody = new Array(bodyEnd - 1);
            for (let counter = bodyStart + 1; counter <= bodyEnd - 1; counter++) {
                arrBody[counter] = tokens[counter].value;
            }
            Object.defineProperty(classType.prototype, "ctor", {
                value: fnArgs.length === 0 ? Function(`\n${arrBody.join("").trim()}\n`) : Function(fnArgs, `\n${arrBody.join("").trim() + `/* comment ctor ${classType.prototype.mrbrAssemblyTypeName} */`}\n`),
                configurable: false,
                enumerable: true,
                writable: false
            })
        }
        if (Object.getOwnPropertyDescriptor(classType.prototype, "base") === undefined) {
            Object.defineProperty(classType.prototype, "base", {
                value: function (...args) {
                    if (args === undefined || args.length === 0) {
                        args = [];
                        args[0] = {}
                    }
                    args[0].called = args[0].called || [];
                    const self = this,
                        called = args[0].called,
                        constructorsToCall = [],
                        assembly = Mrbr.System.Assembly,
                        assemblyToObject = assembly.toObject,
                        assemblyCallInteritance = assembly.callInheritance;
                    called.push(`${classType.prototype.mrbrAssemblyTypeName.split(".").join("_")}_ctor`);
                    assemblyCallInteritance(classType, called, constructorsToCall, assemblyCallInteritance, assemblyToObject)
                    for (let constructorCounter = 0, constructorCount = constructorsToCall.length; constructorCounter < constructorCount; constructorCounter++) {
                        self[constructorsToCall[constructorCounter]](...args);
                    }
                },
                configurable: false,
                enumerable: true,
                writable: false,
                name: "base"
            })
        }
        if (Object.getOwnPropertyDescriptor(classType.prototype, "bases") === undefined) {
            Object.defineProperty(classType.prototype, "bases", {
                value: function () {
                    if (classType.prototype._bases !== undefined) { return classType.prototype._bases }
                    const self = this,
                        keys = [self.constructor.mrbrAssemblyTypeName]
                    Mrbr.System.Assembly.listClassInheritance(keys, self.constructor);
                    classType.prototype._bases = keys;
                    return classType.prototype._bases;
                },
                configurable: false,
                enumerable: true,
                writable: false,
                name: "bases"
            });
        }
        return classType;
    }

    static callInheritance(inhClassType, called, constructorsToCall, callInheritance, assemblyToObject) {
        const propName = `${inhClassType.prototype.mrbrAssemblyTypeName.split(".").join("_")}_ctor`,
            inhClassTypeInherits = inhClassType.inherits;
        if (inhClassTypeInherits !== undefined && inhClassTypeInherits.length > 0) {
            for (let inheritorCounter = 0, inheritCount = inhClassTypeInherits.length; inheritorCounter < inheritCount; inheritorCounter++) {
                callInheritance(assemblyToObject(inhClassTypeInherits[inheritorCounter]), called, constructorsToCall, callInheritance, assemblyToObject);
            }
        }
        if (called.includes(propName)) { return; }
        called.push(propName);
        constructorsToCall.push(propName)
    }

    static listClassInheritance(keys, obj) {
        const assembly = Mrbr.System.Assembly;
        if (obj.inherits && obj.mrbrAssemblyTypeName) {
            for (let inheritCounter = 0, inheritCount = obj.inherits.length, inherits = obj.inherits; inheritCounter < inheritCount; inheritCounter++) {
                let inherit = inherits[inheritCounter];
                if (!keys.includes(inherit)) {
                    keys.push(inherit)
                    assembly.listClassInheritance(keys, assembly.toObject(inherit));
                }
            }
        }
    }
    /**
     * 
     * @param {string or string[]} classes className or classNames to load
     * single className is converted to an Array of classes
     * @returns {Promise.all} Promises of all loading classes
     */
    static loadClasses(classes) {
        if (classes === undefined || classes.length === 0) { return Promise.resolve(); }
        const assembly = Mrbr.System.Assembly,
            classCount = classes.length,
            arrClasses = new Array(classCount);
        classes = Array.isArray(classes) ? classes : [classes];
        for (let classesCounter = 0, className; classesCounter < classCount; classesCounter++) {
            className = classes[classesCounter];
            arrClasses[classesCounter] = new Promise(function (resolve, reject) {
                assembly
                    .loadClass(className)
                    .then(function (result) { resolve(className) })
                    .catch(function (error) {
                        reject(error);
                    });
            })
        }
        return Promise.all(arrClasses);
    }
    static loadConfigFile(...args) {
        const prms = args[0],
            configFileName = prms.url,
            assembly = Mrbr.System.Assembly,
            assemblyCreateConfig = assembly.createConfig;
        return new Promise(function (resolve, reject) {
            const prmfn = { url: configFileName }
            assembly.loadFile(prmfn)
                .then(result => {
                    const prm = { configText: result }
                    assembly._configInterceptor === undefined ? assemblyCreateConfig(prm) : assembly.configInterceptor.intercept(assemblyCreateConfig, undefined, prm);
                    assembly.loader[configFileName].config = JSON.parse(result)
                    resolve();
                })
                .catch(function (error) {
                    reject(error)
                });
        });
    }
    static loadConfigFiles(configFiles) {
        if (configFiles === undefined || classes.length === 0) { return Promise.resolve(); }
        configFiles = Array.isArray(configFiles) ? configFiles : [configFiles];
        const assembly = Mrbr.System.Assembly,
            configsCount = configFiles.length,
            configPromises = new Array(configsCount)
        for (let configCounter = 0, configFile; configCounter < configsCount; configCounter++) {
            configFile = configFiles[configCounter];
            configPromises[configCounter] = new Promise(function (resolve, reject) {
                const prmfn = { url: configFile }
                assembly
                    .loadConfigFile(prmfn)
                    .then(function (result) { resolve(prmfn) })
                    .catch(function (error) {
                        reject(error)
                    })
            })
        }
        return Promise.all(configPromises);
    }
    static loadStyleElement(...args) {
        const prms = args[0],
            fileName = prms.url,
            assembly = Mrbr.System.Assembly,
            assemblyCreateStyle = assembly.createStyle;
        return new Promise(function (resolve, reject) {
            const prmfn = { url: fileName }
            assembly.loadFile(prmfn)
                .then(result => {
                    const prm = { url: fileName, cssText: result };
                    assembly._styleInterceptor === undefined ? assemblyCreateStyle(prm) : assembly.styleInterceptor.intercept(assemblyCreateStyle, undefined, prm);
                    resolve();
                })
                .catch(function (error) {
                    reject(error)
                });
        });
    }
    static loadStyleElements(filenames) {
        if (filenames === undefined || filenames.length === 0) { return Promise.resolve(); }
        filenames = Array.isArray(filenames) ? filenames : [filenames];
        const assembly = Mrbr.System.Assembly,
            fileNamesCount = filenames.length,
            fileNamePromises = new Array(fileNamesCount);
        for (let fileNamesCounter = 0, fileName; fileNamesCounter < fileNamesCount; fileNamesCounter++) {
            fileName = filenames[fileNameCounter];
            fileNamePromises[fileNameCounter] = new Promise(function (resolve, reject) {
                const prmfn = { url: filename }
                assembly
                    .loadStyleElement(prmfn)
                    .then(function (result) { resolve(prmfn) })
                    .catch(function (error) {
                        reject(error)
                    })
            })
        }
        return Promise.all(fileNamePromises);
    }

    static loadScriptElement(...args) {
        const prms = args[0],
            fileName = prms.url,
            assembly = Mrbr.System.Assembly,
            assemblyCreateScriptElement = assembly.createScriptElement;
        return new Promise(function (resolve, reject) {
            const prmfn = { url: fileName }
            assembly.loadFile(prmfn)
                .then(result => {
                    const prm = { fileName: fileName, scriptText: result }
                    assembly._scriptElementInterceptor === undefined ? assemblyCreateScriptElement(prm) : assembly.scriptElementInterceptor.intercept(assemblyCreateScriptElement, undefined, prm)
                    resolve();
                })
                .catch(function (error) {
                    reject(error)
                });
        });
    }
    static loadScriptElements(filenames) {
        if (filenames === undefined || filenames.length === 0) { return Promise.resolve(); }
        filenames = Array.isArray(filenames) ? filenames : [filenames];
        const assembly = Mrbr.System.Assembly,
            fileNameCount = filenames.length,
            fileNamePromises = new Array(fileNameCount);
        for (let fileNameCounter = 0, fileName; fileNamesCounter < fileNameCount; fileNameCounter++) {
            fileName = fileName[fileNameCounter];
            fileNamePromises[fileNameCounter] = new Promise(function (resolve, reject) {
                assembly
                    .loadScriptElement(filename)
                    .then(function (result) { resolve(filename) })
                    .catch(function (error) {
                        reject(error)
                    })
            })
        }
        return Promise.all(fileNamePromises);
    }
    static createLinkedScriptElement(...args) {
        const prms = args[0],
            fileName = prms.url;
        let scr = document.createElement("script");
        scr.id = fileName;
        scr.src = fileName;
        document.head.appendChild(scr);
        return Promise.resolve();
    }
    static createLinkedScriptElements(fileNames) {
        if (filenames === undefined || filenames.length === 0) { return Promise.resolve(); }
        const assembly = Mrbr.System.Assembly;
        fileNames = Array.isArray(filenames) ? filenames : [filenames];
        let loadLinkedScriptElements = new Array(filenames.length);
        for (let scriptCounter = 0, scriptCount = fileNames.length, filename = filenames[scriptCounter]; scriptCounter < scriptCount; scriptCounter++) {
            loadLinkedScriptElements[scriptCounter] = new Promise(function (resolve, reject) {
                assembly
                    .createLinkedScriptElement(filename)
                    .then(function (result) { resolve(filename) })
                    .catch(function (error) {
                        reject(error)
                    })
            })
        }
        return Promise.all(loadLinkedScriptElements);
    }

    static createLinkedStyleElement(...args) {
        const prms = args[0],
            fileName = prms.url,
            assembly = Mrbr.System.Assembly,
            assemblyCreateLinkedStyle = assembly.createLinkedStyle,
            prm = { url: fileName };
        assembly._linkedStyleInterceptor === undefined ? assemblyCreateLinkedStyle(prm) : assembly.linkedStyleInterceptor.intercept(assemblyCreateLinkedStyle, undefined, prm)
        return Promise.resolve();
    }

    static createLinkedStyleElements(fileNames) {
        if (filenames === undefined || filenames.length === 0) { return Promise.resolve(); }
        const assembly = Mrbr.System.Assembly;
        fileNames = Array.isArray(filenames) ? filenames : [filenames];
        let loadLinkedStyleElements = new Array(filenames.length);
        for (let styleCounter = 0, styleCount = fileNames.length, filename = filenames[styleCounter]; styleCounter < styleCount; styleCounter++) {
            loadLinkedStyleElements[styleCounter] = new Promise(function (resolve, reject) {
                assembly
                    .createLinkedStyleElement(filename)
                    .then(function (result) { resolve(filename) })
                    .catch(function (error) {
                        reject(error)
                    })
            })
        }
        return Promise.all(loadLinkedStyleElements);
    }

    static loadInterface(interfaceName) {
        let interfaceNames = [interfaceName],
            fileName = interfaceName;
        const assembly = Mrbr.System.Assembly,
            assemblyToObject = assembly.toObject,
            makeFileReplacements = Mrbr.System.Assembly.resolveNamespaceToFile,
            assemblyLoadClasses = assembly.loadClasses,
            assemblyLoadInterfaces = assembly.loadInterfaces,
            assemblyLoadManifest = assembly.loadManifest;
        fileName = makeFileReplacements(interfaceName)
        fileName += ".json"
        return new Promise(function (resolve, reject) {
            const prmfn = { url: fileName }
            assembly.loadFile(prmfn)
                .then(function (result) {
                    let obj = assemblyToObject(interfaceName);
                    if (obj.mrbrInterfaceName === undefined) {
                        obj = Object.assign(obj, JSON.parse(result));
                        obj.mrbrInterfaceName = interfaceName
                    }
                    let loadInterfaceRequirements = []
                    if (obj.inherits && obj.inherits.length > 0) { loadInterfaceRequirements.push(assemblyLoadInterfaces(obj.inherits)); }
                    if (obj.using && obj.using.length > 0) { loadInterfaceRequirements.push(assemblyLoadClasses(obj.using)) }
                    if (obj.interfaces && obj.interfaces.length > 0) { loadInterfaceRequirements.push(assemblyLoadInterfaces(obj.interfaces)) }
                    if (obj.manifest && obj.manifest.length > 0) { loadInterfaceRequirements.push(assemblyLoadManifest(obj.manifest)) }
                    Promise.all(loadInterfaceRequirements).then(() => {
                        assembly.setInterfaceInheritance(obj.inherits, interfaceName)
                        resolve();
                    })
                        .catch(function (error) {
                            reject(error)
                        })
                });
        })
    }
    static loadInterfaces(interfaceNames) {
        if (interfaceNames === undefined || interfaceNames.length === 0) { return Promise.resolve(); }
        const assembly = Mrbr.System.Assembly;
        interfaceNames = (Array.isArray(interfaceNames) ? interfaceNames : [interfaceNames])
        let loadInterfacesPromises = new Array(interfaceNames.length)
        for (let interfaceCounter = 0, interfaceCount = interfaceNames.length, interfaceName = interfaceNames[interfaceCounter]; interfaceCounter < interfaceCount; interfaceCounter++) {
            loadInterfacesPromises[interfaceCounter] = new Promise(function (resolve, reject) {
                assembly
                    .loadInterface(interfaceName)
                    .then(function (result) { resolve(interfaceName) })
                    .catch(function (error) {
                        reject(error)
                    })
            })
        }
        return Promise.all(loadInterfacesPromises);
    }
    static setInterfaceInheritance(sources, targetName) {
        if (sources === undefined) { return; }
        sources = Array.isArray(sources) ? sources : [sources];
        const assembly = Mrbr.System.Assembly,
            target = assembly.toObject(targetName);
        if (!target.inherited) { target.inherited = [] }
        for (let sourcesCounter = 0, sourcesCount = sources.length, sourceName, source = assembly.toObject(sourceName); sourcesCounter < sourcesCount; sourcesCounter++) {
            sourceName = sources[sourcesCounter]
            if (target.inherited.includes(sourceName)) { continue; }
            target.inherited.push(sourceName)
            if (source.inherited) { target.inherited = target.inherited.concat(source.inherited); }
            if (source.properties) { target.properties = Object.assign(target.properties, source.properties) }
            if (source.methods) { target.methods = Object.assign(target.methods, source.methods) }
        }
    }
    /**
     * Set inheritance for target from all sources classes
     * @param {string[]} sources Array of sources to apply as base classes to target  
     * @param {class} target Target object for inheritance
     * @returns {class} Target object passed back
     */
    static setInheritance(sources, target) {
        if (sources === undefined) { return Promise.resolve(); }
        return Mrbr.System.Inheritance.applyInheritance(sources, target);
        //return target;
    }
    /**
     * Load the required classes and usings for Mrbr.System.Assembly
     * Specific requirement for this class only
     * Additional application scripts should be run after Assembly Initialise Promise is resolved 
     * @returns {Promise} resolves when all files are loaded
     */
    static initialised(config) {

        const assembly = Mrbr.System.Assembly;
        if (config && config.loadFile !== undefined) {
            assembly.loadFile = config.loadFile
        }
        else if (typeof fetch === 'undefined') {
            assembly.loadFile = assembly.loadXmlHttpFile
        }
        else {
            assembly.loadFile = assembly.fetchFile
        }
        if (config && config.defaultContext) {
            assembly._defaultContext = config.defaultContext;
        }
        else if (typeof window === 'undefined') {
            if (typeof globalThis !== 'undefined') {
                assembly._defaultContext = globalThis;
            }
            else if (typeof global !== 'undefined') {
                assembly._defaultContext = global;
            }
            else {
                throw "No global"
            }
        }
        else if (window) {
            assembly._defaultContext = window;
        }
        else {
            assembly._defaultContext = undefined;
        }
        if (config !== undefined && config !== null) {
            if (config.assemblyResolvers !== undefined && config.assemblyResolvers !== null) {
                assembly.fileReplacements = config.assemblyResolvers;
            }
        }
        assembly._loader = {};
        assembly._objectCache = {};
        assembly.setArrayPolyFills();
        return new Promise(function (resolve, reject) {
            assembly
                .loadFiles(
                    [
                        { url: Mrbr.System.Assembly.resolveNamespaceToFile("Mrbr.Utils.Parser.tokenCtor") + ".json", formatUrl: (Mrbr.System.Assembly.resolveNamespaceToFile("Mrbr.Utils.Parser.tokenCtor") + ".json").toLowerCase() },
                        { url: Mrbr.System.Assembly.resolveNamespaceToFile("Mrbr.Utils.Parser.Tokeniser") + ".js", formatUrl: (Mrbr.System.Assembly.resolveNamespaceToFile("Mrbr.Utils.Parser.Tokeniser") + ".js").toLowerCase() },
                        { url: Mrbr.System.Assembly.resolveNamespaceToFile("Mrbr.System.Object") + ".js", formatUrl: (Mrbr.System.Assembly.resolveNamespaceToFile("Mrbr.System.Object") + ".js").toLowerCase() },
                        { url: Mrbr.System.Assembly.resolveNamespaceToFile("Mrbr.Interceptor.Interceptor") + ".js", formatUrl: (Mrbr.System.Assembly.resolveNamespaceToFile("Mrbr.Interceptor.Interceptor") + ".js").toLowerCase() },
                        { url: Mrbr.System.Assembly.resolveNamespaceToFile("Mrbr.System.ManifestEntry") + ".js", formatUrl: (Mrbr.System.Assembly.resolveNamespaceToFile("Mrbr.System.ManifestEntry") + ".js").toLowerCase() },
                        { url: Mrbr.System.Assembly.resolveNamespaceToFile("Mrbr.System.Inheritance") + ".js", formatUrl: (Mrbr.System.Assembly.resolveNamespaceToFile("Mrbr.System.Inheritance") + ".js").toLowerCase() },
                        { url: Mrbr.System.Assembly.resolveNamespaceToFile("Mrbr.System.Exception") + ".js", formatUrl: (Mrbr.System.Assembly.resolveNamespaceToFile("Mrbr.System.Exception") + ".js").toLowerCase() }
                    ])
                .then(() => assembly.loadClass({ entryName: "Mrbr.Utils.Parser.Tokeniser".toLowerCase(), alias: "Mrbr.Utils.Parser.Tokeniser" }))
                .then(() => assembly.loadClass({ entryName: "Mrbr.System.Object".toLowerCase(), alias: "Mrbr.System.Object" }))
                .then(() => assembly.loadClass({ entryName: "Mrbr.Interceptor.Interceptor".toLowerCase(), alias: "Mrbr.Interceptor.Interceptor" }))
                .then(() => {
                    const mii = Mrbr.Interceptor.Interceptor;
                    assembly._classInterceptor = new mii()
                    assembly._componentInterceptor = new mii()
                    assembly._scriptInterceptor = new mii()
                    assembly._fileInterceptor = new mii()
                    assembly._scriptElementInterceptor = new mii()
                    assembly._styleInterceptor = new mii()
                    assembly._linkedStyleInterceptor = new mii()
                    assembly._configInterceptor = new mii()
                })
                .catch(error => console.log(error))
                .then(() => assembly.loadClass({ entryName: "Mrbr.System.ManifestEntry".toLowerCase(), alias: "Mrbr.System.ManifestEntry" }))
                .then(() => assembly.loadClass({ entryName: "Mrbr.System.Inheritance".toLowerCase(), alias: "Mrbr.System.Inheritance" }))
                .then(() => assembly.loadClass({ entryName: "Mrbr.System.Exception".toLowerCase(), alias: "Mrbr.System.Exception" }))
                .then(function () {
                    Function(assembly.addTypeNameScript("Mrbr.System.Assembly"))();
                    return assembly.loadClasses(assembly.using)
                })
                .then(function () {
                    resolve();
                })
                .catch(function (error) {
                    reject(error)
                })
        })
    }
    /**
     * When run in the Browser provides an onReady function.
     * Once Assembly.initialised is resolved events are set for when browser DOM is "ready"
     * @returns {Promise} DOM is "ready"
     */
    static onReady(config, fn) {
        let fnResolve;
        let fnReady = function () {
            if (document.removeEventListener) {
                document.removeEventListener("DOMContentLoaded", fnReady);
                document.removeEventListener("load", fnReady);
                window.removeEventListener("load", fnReady);
                window.removeEventListener("DOMContentLoaded", fnReady);
            } else {
                document.detachEvent("onreadystatechange", fnReady);
                window.detachEvent("onload", fnReady);
                window.detachEvent("load", fnReady);
                document.detachEvent("load", fnReady);
            }
            fnResolve()
        }
        let handlers = [];
        return new Promise(function (resolve, reject) {
            fnResolve = resolve;
            Mrbr.System.Assembly
                .initialised(config)
                .then(function () {
                    document.onreadystatechange = function () {
                        if (document.readyState === 'complete') {
                            fnReady();
                        }
                    }
                    if (document.readyState === "complete") {
                        resolve("complete");
                    }
                    else {
                        if (document.addEventListener) {
                            document.addEventListener("DOMContentLoaded", fnReady);
                            window.addEventListener("load", fnReady);
                            window.addEventListener("DOMContentLoaded", fnReady);
                            document.addEventListener("load", fnReady);
                        } else {
                            document.attachEvent("onreadystatechange", fnReady);
                            window.attachEvent("onload", fnReady);
                            document.attachEvent("load", fnReady);
                            window.attachEvent("load", fnReady);
                        }
                    }
                })
        })
    }
    static createNamespaceManifest(ns, entryType, entries) {
        if (ns === undefined || entryType === undefined || entries === undefined || entries.length === 0) { return []; }
        const entriesCount = entries.length
        let retVal = new Array(entriesCount),
            entry = Mrbr.System.ManifestEntry;
        for (let entryCounter = 0; entryCounter < entriesCount; entryCounter++) { retVal[entryCounter] = new entry(entryType, `${ns}.${entries[entryCounter]}`); }
        return retVal;
    }
}
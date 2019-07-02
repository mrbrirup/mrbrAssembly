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
    }
    /**
     * Load classes required by assembly function
     */
    static get using() { return ["Mrbr.System.ManifestEntry", "Mrbr.System.Interface"] }
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
        const argCount = args.length,
            target = (argCount === 1) ? window : args[0],
            objectName = args[args.length - 1],
            assembly = Mrbr.System.Assembly;
        if (assembly.objectCache.hasOwnProperty(objectName)) { return assembly.objectCache[objectName] }
        const nsParts = args[args.length - 1].split(".");
        let currentObject = target;
        for (let nsCounter = 0, partName, nsPartsLength = nsParts.length; nsCounter < nsPartsLength; nsCounter++) {
            partName = nsParts[nsCounter];
            if (currentObject[partName] === undefined) {
                currentObject[partName] = {}
            }
            currentObject = currentObject[partName];
        }
        Mrbr.System.Assembly[objectName] = currentObject
        return currentObject;
    }
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

    static fetchFile(url) {
        const loader = Mrbr.System.Assembly.loader;
        if (loader.hasOwnProperty(url)) {
            return loader[url].promise;
        }
        else {
            let resolver,
                rejecter,
                prm = new Promise((resolve, reject) => {
                    resolver = resolve;
                    rejecter = reject;
                });
            fetch(url, {
                method: 'GET'
            })
                .then(response => response.text()
                    .then(text => { loader[url].result = text; resolver(text); })
                    .catch(function (error) { rejecter(error) }))
                .catch(function (error) { rejecter(error) })
            loader[url] = { promise: prm, result: undefined };
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
            return loader[url].promise;
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
                if (xmlHttp.readyState === 4 && (xmlHttp.status >= 200 && xmlHttp.status < 300)) {
                    loader[url].result = xmlHttp.responseText;
                    resolver(xmlHttp.responseText);
                } else {
                    rejecter(error);
                }
            }
            loader[url] = { promise: prm, result: undefined };
            return prm;
        }
    }
    static loadFile(filename) { }
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
    static loadComponent(componentName) {
        // let classNames = [className],
        //     fileName = className;
        const assembly = Mrbr.System.Assembly,
            assemblyToObject = assembly.toObject,
            makeFileReplacements = Mrbr.System.Assembly.resolveNamespaceToFile,
            assemblyLoadClasses = assembly.loadClasses,
            assemblySetInheritance = assembly.setInheritance,
            assemblyAddClassCtor = assembly.addClassCtor,
            assemblyLoadManifest = assembly.loadManifest;
        let fileName = makeFileReplacements(componentName) + ".js";
        return new Promise(function (resolve, reject) {
            assembly.loadFile(fileName)
                .then(function (result) {
                    let obj;
                    if (!((obj = assemblyToObject(componentName)) instanceof Function)) {
                        let elementName = componentName.toLowerCase().split(".").join("-");
                        let txt = `${componentName} = ${result};\ncustomElements.define('${elementName}', ${componentName});` 
                        console.log(txt)
                        Function(txt)();
                        assembly.objectCache[componentName] = obj = assemblyToObject(componentName);
                        resolve();
                    }
                })
                .catch(function(error){
                    reject(error);
                })
        })
    }
    /**
     * 
     * @param {string} className    load file from namespaced object name
     *                              Mrbr.System.Inheritance loads file /system/inheritance.js
     *                              load associated files, inherited and usings
     * @returns {Promise}           when class and all associated files are loaded
     */
    static loadClass(className) {
        let classNames = [className],
            fileName = className;
        const assembly = Mrbr.System.Assembly,
            assemblyToObject = assembly.toObject,
            makeFileReplacements = Mrbr.System.Assembly.resolveNamespaceToFile,
            assemblyLoadClasses = assembly.loadClasses,
            assemblySetInheritance = assembly.setInheritance,
            assemblyAddClassCtor = assembly.addClassCtor,
            assemblyLoadManifest = assembly.loadManifest;
        fileName = makeFileReplacements(className) + ".js"
        return new Promise(function (resolve, reject) {
            assembly.loadFile(fileName)
                .then(function (result) {
                    let obj;
                    if (!((obj = assemblyToObject(className)) instanceof Function)) {
                        Function(`${className} = ${result};\n${assembly.addTypeNameScript(className)};\n`)();
                        assembly.objectCache[className] = obj = assemblyToObject(className);
                    }
                })
                .catch(function (error) {
                    if (error instanceof Error) {
                        reject(new Mrbr.System.Exception({ name: "Exception", error: error, source: `${assembly.mrbrAssemblyTypeName}:loadClass`, info: `className: ${className}` }))
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
                        let obj = assemblyToObject(className),
                            loopLoadClasses = function () {
                                lastToloadCount = toloadCount;
                                let toload = ([].concat(obj.using ? obj.using : [], obj.inherits ? obj.inherits : [], newClasses)).distinct();
                                toloadCount = toload.length;
                                classNames = classNames.concat(toload).distinct()
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
                                        assemblySetInheritance(obj.inherits, obj)
                                        assemblySetInheritance(obj.extends, obj)
                                        assemblyAddClassCtor(obj);
                                    }
                                };
                            }
                            resolve();
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
                        assemblyLoadClass(manifestEntry.entryName)
                            .then(result => resolve())
                            .catch(function (error) {
                                reject(error)
                            });
                    })
                    break;
                case fileTypes.Component:
                    arrManifest[manifestCounter] = new Promise(function (resolve, reject) {
                        assembly.loadComponent(manifestEntry.entryName)
                            .then(result => resolve())
                            .catch(function (error) {
                                reject(error)
                            });
                    })
                    break;
                case fileTypes.Script:
                    arrManifest[manifestCounter] = new Promise(function (resolve, reject) {
                        assemblyLoadScript(manifestEntry.entryName)
                            .then(result => resolve())
                            .catch(function (error) {
                                reject(error)
                            });
                    })
                    break;
                case fileTypes.File:
                    arrManifest[manifestCounter] = new Promise(function (resolve, reject) {
                        assemblyLoadFile(manifestEntry.entryName).then(result => resolve())
                            .catch(function (error) {
                                reject(error)
                            });
                    })
                    break;
                case fileTypes.ScriptElement:
                    arrManifest[manifestCounter] = new Promise(function (resolve, reject) {
                        assemblyLoadScriptElement(manifestEntry.entryName).then(result => resolve())
                            .catch(function (error) {
                                reject(error)
                            });
                    })
                    break;
                case fileTypes.Style:
                    arrManifest[manifestCounter] = new Promise(function (resolve, reject) {
                        if (manifestEntry.entryName.toLowerCase().endsWith(".css")) {
                            assemblyLoadStyle(manifestEntry.entryName).then(result => resolve())
                                .catch(function (error) {
                                    reject(error)
                                });
                        }
                        else {
                            assemblyLoadStyle(`${assembly.resolveNamespaceToFile(manifestEntry.entryName)}.css`).then(result => resolve())
                                .catch(function (error) {
                                    reject(error)
                                });
                        }
                    });
                    break;
                case fileTypes.LinkedStyle:
                    arrManifest[manifestCounter] = new Promise(function (resolve, reject) {
                        if (manifestEntry.entryName.toLowerCase().endsWith(".css")) {
                            assemblyLinkedStyle(manifestEntry.entryName).then(result => resolve()).catch(function (error) {
                                reject(error)
                            });
                        }
                        else {
                            assemblyLinkedStyle(`${assembly.resolveNamespaceToFile(manifestEntry.entryName)}.css`).then(result => resolve()).catch(function (error) {
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
        const assembly = Mrbr.System.Assembly;
        return new Promise(function (resolve, reject) {
            assembly.loadFile(fileName)
                .then(result => {
                    Function(result)()
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
        const assembly = this,
            assemblyLoadFile = assembly.loadFile;
        fileNames = Array.isArray(fileNames) ? fileNames : [fileNames];
        const fileNamesCount = fileNames.lengthl
        const arrFileNames = new Array(fileNamesCount);
        for (let fileNameCounter = 0, filename; fileNameCounter < fileNamesCount; fileNameCounter++) {
            filename = filenames[fileNameCounter];
            arrFileNames[fileNameCounter] = new Promise(function (resolve, reject) {
                assemblyLoadFile(fileNames).then(result => resolve())
                    .catch(function (error) {
                        reject(error)
                    })
            })
        }
        return Promise.all(arrFileNames);
    }
    /**
     * 
     * @param {class} classType  copies source code from Class constructor to a class' function ctor
     * If ctor already exists, created by user at design time or from previous load then it will not be created again
     * Parses class and finds constructor in source code. Creates a duplicate Function called ctor on class with same arguments and source code
     * @returns {class} returns passed in classType
     */
    static addClassCtor(classType) {

        if (Object.getOwnPropertyDescriptor(classType.prototype, "ctor") !== undefined) { return classType; }

        const mTokeniser = Mrbr.Utils.Parser.Tokeniser,
            tokenString = classType.prototype.constructor.toString(),
            tokeniser = new mTokeniser(Mrbr.System.Assembly.loader[Mrbr.System.Assembly.resolveNamespaceToFile("Mrbr.Utils.Parser.tokenTypes") + ".json"].result),
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
        while (searching && counter < tokensLength) {
            currToken = tokens[counter]
            if (currToken.group === TokenGroups.Keyword && currToken.type === 'constructor') {
                searching = false;
            }
            else {
                counter++;
            }
        }
        //  Find start of parenthesis for arguments
        searching = true;
        while (searching && counter < tokensLength) {
            currToken = tokens[counter];
            if (currToken.group === TokenGroups.Block
                && currToken.value === "(") {
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
            if (currToken.group === TokenGroups.Block
                && currToken.value === ")"
                && currToken.levels.parens === argumentLevel) {
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
            if (currToken.group === TokenGroups.Block
                && currToken.value === "{") {
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
            if (currToken.group === TokenGroups.Block
                && currToken.value === "}"
                && currToken.levels.braces === bodyLevel) {
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
            arrBody = [];//bodyStart + 1 - bodyEnd - 1]
            for (let counter = bodyStart + 1; counter <= bodyEnd - 1; counter++) {
                //arrBody[counter - bodyStart + 1] = tokens[counter].value
                arrBody.push(tokens[counter].value)
            }
            Object.defineProperty(classType.prototype, "ctor", {
                value: fnArgs.length === 0 ? Function(`\n${arrBody.join("").trim()}\n`) : Function(fnArgs, `\n${arrBody.join("").trim() + `/* comment ctor ${classType.prototype.mrbrAssemblyTypeName} */`}\n`),
                configurable: false,
                enumerable: true,
                writable: false//,
                //name: "ctor"
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
                        selfConstructorPrototype = self.constructor.prototype;
                    //keys = Object.keys(self.constructor.prototype),
                    //keysCount = keys.length;
                    called.push(classType.prototype.mrbrAssemblyTypeName.replace(/\./g, "_") + "_ctor");
                    //for (let keyCounter = 0; keyCounter < keysCount; keyCounter++) {
                    for (let property in selfConstructorPrototype) {
                        //let property = keys[keyCounter];
                        if (called.includes(property) || !property.endsWith("_ctor") || property === "ctor") {
                            continue;
                        }
                        called.push(property);
                        self[property](...args);
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

                        //let ex = new Mrbr.System.Exception({ name: "Exception", error: error })                        
                        reject(error);
                    });
            })
        }
        return Promise.all(arrClasses);
    }
    static loadConfigFile(configFileName) {
        const assembly = Mrbr.System.Assembly;
        return new Promise(function (resolve, reject) {
            assembly.loadFile(configFileName)
                .then(result => {
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
        const assembly = Mrbr.System.Assembly;
        configFiles = Array.isArray(configFiles) ? configFiles : [configFiles];
        const configsCount = configFiles.length,
            configPromises = new Array(configsCount)
        for (let configCounter = 0, configFile; configCounter < configsCount; configCounter++) {
            configFile = configFiles[configCounter];
            configPromises[configCounter] = new Promise(function (resolve, reject) {
                assembly
                    .loadConfigFile(configFile)
                    .then(function (result) { resolve(configFile) })
                    .catch(function (error) {


                        reject(error)
                    })
            })
        }
        return Promise.all(configPromises);
    }
    static loadStyleElement(fileName) {
        const assembly = Mrbr.System.Assembly;
        return new Promise(function (resolve, reject) {
            assembly.loadFile(fileName)
                .then(result => {
                    let css = document.createElement("style");
                    css.type = 'text/css';
                    if (css.styleSheet) {
                        css.styleSheet.cssText = result;
                    } else {
                        css.appendChild(document.createTextNode(result));
                    }
                    document.head.appendChild(css);
                    resolve();
                })
                .catch(function (error) {


                    reject(error)
                });
        });
    }
    static loadStyleElements(filenames) {
        if (filenames === undefined || filenames.length === 0) { return Promise.resolve(); }
        const assembly = Mrbr.System.Assembly;
        filenames = Array.isArray(filenames) ? filenames : [filenames];
        const fileNamesCount = filenames.length,
            fileNamePromises = new Array(fileNamesCount);
        for (let fileNamesCounter = 0, fileName; fileNamesCounter < fileNamesCount; fileNamesCounter++) {
            fileName = filenames[fileNameCounter];
            fileNamePromises[fileNameCounter] = new Promise(function (resolve, reject) {
                assembly
                    .loadStyleElement(filename)
                    .then(function (result) { resolve(filename) })
                    .catch(function (error) {


                        reject(error)
                    })
            })
        }
        return Promise.all(fileNamePromises);
    }

    static loadScriptElement(fileName) {
        const assembly = Mrbr.System.Assembly;
        return new Promise(function (resolve, reject) {
            assembly.loadFile(fileName)
                .then(result => {
                    var scr = document.createElement("script");
                    scr.id = fileName;
                    scr.text = result;
                    document.head.appendChild(scr);
                    resolve();
                })
                .catch(function (error) {


                    reject(error)
                });
        });
    }
    static loadScriptElements(filenames) {
        if (filenames === undefined || filenames.length === 0) { return Promise.resolve(); }
        const assembly = Mrbr.System.Assembly;
        filenames = Array.isArray(filenames) ? filenames : [filenames];
        const fileNameCount = filenames.length,
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
    static createLinkedScriptElement(fileName) {
        var scr = document.createElement("script");
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

    static createLinkedStyleElement(fileName) {
        var css = document.createElement('link');
        css.type = 'text/css';
        css.rel = 'stylesheet';
        css.href = fileName;
        document.head.appendChild(css);
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
            assembly.loadFile(fileName)
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
        if (sources === undefined) { return; }
        Mrbr.System.Inheritance.applyInheritance(sources, target);
        return target;
    }
    /**
     * Load the required classes and usings for Mrbr.System.Assembly
     * Specific requirement for this class only
     * Additional application scripts should be run after Assembly Initialise Promise is resolved 
     * @returns {Promise} resolves when all files are loaded
     */
    static initialised(config) {
        const assembly = Mrbr.System.Assembly;
        if (fetch) {
            Mrbr.System.Assembly.loadFile = Mrbr.System.Assembly.fetchFile
        }
        else {
            Mrbr.System.Assembly.loadFile = Mrbr.System.Assembly.loadXmlHttpFile
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
                .loadFile(Mrbr.System.Assembly.resolveNamespaceToFile("Mrbr.Utils.Parser.tokenTypes") + ".json")
                .then(() => assembly.loadClass("Mrbr.Utils.Parser.Tokeniser"))
                .then(() => assembly.loadClass("Mrbr.System.ManifestEntry"))
                .then(() => assembly.loadClass("Mrbr.System.Inheritance"))
                .then(() => assembly.loadClass("Mrbr.System.Exception"))
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
                window.removeEventListener("load", fnReady);
            } else {
                document.detachEvent("onreadystatechange", fnReady);
                window.detachEvent("onload", fnReady);
                window.detachEvent("load", fnReady);
            }
            fnResolve()
            //fn();
        }
        let handlers = [];
        return new Promise(function (resolve, reject) {
            fnResolve = resolve;
            Mrbr.System.Assembly
                .initialised(config)
                .then(function () {
                    if (document.readyState === "complete") {
                        resolve("complete");
                        //fn();
                    }
                    else {
                        if (document.addEventListener) {
                            document.addEventListener("DOMContentLoaded", fnReady);
                            window.addEventListener("load", fnReady);
                        } else {
                            document.attachEvent("onreadystatechange", fnReady);
                            window.attachEvent("onload", fnReady);
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
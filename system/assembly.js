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
    static get using() { return ["Mrbr.System.ManifestEntry"] }
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
            nsParts = args[args.length - 1].split(".");
        let currentObject = target;
        for (let nsCounter = 0, partName, nsPartsLength = nsParts.length; nsCounter < nsPartsLength; nsCounter++) {
            partName = nsParts[nsCounter];
            if (currentObject[partName] === undefined) {
                currentObject[partName] = {}
            }
            currentObject = currentObject[partName];
        }
        return currentObject;
    }
    /**
     * @deprecated
     * @param  {...any} args 
     */
    static isObject(...args) {
        return ObjectUtils.toObject(...args) !== undefined
    }
    /**
     * 
     * @param {string} url load a file from a url
     * @returns {Promise} promise for when file has loaded or existing promise of file if it is loading or has loaded
     */
    static loadFile(url) {
        const loader = Mrbr.System.Assembly.loader;
        if (loader.hasOwnProperty(url)) {
            return loader[url].promise;
        }
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, true);
        xmlHttp.send("");
        let prm = new Promise(function (resolve, reject) {
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState === 4) {
                    if (xmlHttp.status >= 200 && xmlHttp.status < 300) {
                        loader[url].result = xmlHttp.responseText;
                        resolve(xmlHttp.responseText);
                    } else {
                        reject();
                    }
                }
            };
        })
        loader[url] = { promise: prm, result: undefined };
        return prm;
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
        return `
        Object.defineProperty(${className}.prototype, 
            '${assembly.typePropertyName}', { get: function() {return ${className}.${assembly.typePropertyName};}})
            ${className}.${assembly.typePropertyName} = "${className}";
            ` }
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
        Mrbr.System.Assembly._fileReplacements.forEach(replacement => {
            fileName = `${fileName.replace(replacement.replace, replacement.with)}`
        });
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
            fileReplacements = Mrbr.System.Assembly.fileReplacements,
            makeFileReplacements = Mrbr.System.Assembly.resolveNamespaceToFile,

            assemblyLoadClasses = assembly.loadClasses,
            assemblySetInheritance = assembly.setInheritance,
            assemblyAddClassCtor = assembly.addClassCtor,
            assemblyLoadManifest = assembly.loadManifest;
        fileName = makeFileReplacements(className)
        fileName += ".js"
        return new Promise(function (resolve, reject) {
            assembly.loadFile(fileName)
                .then(function (result) {
                    let obj;
                    if (!((obj = assemblyToObject(className)) instanceof Function)) {
                        try {
                            Function(`${className} = ${result};\n${assembly.addTypeNameScript(className)};\n`)();
                            //var fn = new Function(`${className} = ${result};\n${assembly.addTypeNameScript(className)};\n`);
                            //fn.call(window)
                            obj = assemblyToObject(className);
                        }
                        catch (e) {
                            console.log(e)
                        }
                    }
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
                                });
                        }
                    })
                })
                .then(function () {
                    let toloadCount = 0,
                        lastToloadCount = -1,
                        newClasses = [];
                    new Promise(function (resolveLoadClasses, rejectLoadClasses) {
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
                                    });
                            }
                        loopLoadClasses();
                    })
                        .then(function (result1) {
                            try {
                                if (classNames !== undefined && classNames.length > 0) {
                                    for (let classNameCounter = 0, classNameCount = classNames.length, obj; classNameCounter < classNameCount; classNameCounter++) {
                                        if ((obj = assemblyToObject(classNames[classNameCounter])) instanceof Function) {
                                            assemblySetInheritance(obj.inherits, obj)
                                            assemblyAddClassCtor(obj);
                                        }
                                    };
                                }
                            }
                            catch (e) {
                                console.log(e);
                            }
                            resolve();
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
            assemblyLoadFile = assembly.loadFile;
        return Promise.all((Array.isArray(manifest) ? manifest : [manifest])
            .map(function (manifestEntry) {
                switch (manifestEntry.fileType) {
                    case fileTypes.Class:
                        return new Promise(function (resolve, reject) {
                            assemblyLoadClass(manifestEntry.entryName).then(result => resolve());
                        })
                    case fileTypes.Script:
                        return new Promise(function (resolve, reject) {
                            assemblyLoadScript(manifestEntry.entryName).then(result => resolve());
                        })
                    case fileTypes.File:
                        return new Promise(function (resolve, reject) {
                            assemblyLoadFile(manifestEntry.entryName).then(result => resolve());
                        })

                }
            }));
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
                    var scr = document.createElement("script");
                    scr.id = fileName;
                    scr.text = result;
                    document.head.appendChild(scr);
                    resolve();
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
        return Promise.all((Array.isArray(fileNames) ? fileNames : [fileNames])
            .map(function (fileNames) {
                return new Promise(function (resolve, reject) {
                    assemblyLoadFile(fileNames).then(result => resolve());
                })
            }));
    }
    /**
     * 
     * @param {class} classType  copies source code from Class constructor to a class' function ctor
     * If ctor already exists, created by user at design time or from previous load then it will not be created again
     * Parses class and finds constructor in source code. Creates a duplicate Function called ctor on class with same arguments and source code
     * @returns {class} returns passed in classType
     */
    static addClassCtor(classType) {
        if (Object.getOwnPropertyDescriptor(classType.prototype, "ctor")) { return classType; }
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
            body = "",
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
        try {
            if (bodyEnd > bodyStart) {
                arrBody = [];//bodyStart + 1 - bodyEnd - 1]
                for (let counter = bodyStart + 1; counter <= bodyEnd - 1; counter++) {
                    //arrBody[counter - bodyStart + 1] = tokens[counter].value
                    arrBody.push(tokens[counter].value)
                }
                Object.defineProperty(classType.prototype, "ctor", {
                    value: fnArgs.length === 0 ? Function(`\n${arrBody.join("").trim()}\n`) : Function(fnArgs, `\n${arrBody.join("").trim()}\n`),
                    configurable: false,
                    enumerable: true,
                    writable: false,
                    name: "ctor"
                })
            }
            if (Object.getOwnPropertyDescriptor(classType.prototype, "base") === undefined) {
                Object.defineProperty(classType.prototype, "base", {
                    value: function (...args) {
                        args[0].called = args[0].called || [];
                        const self = this,
                            called = args[0].called,
                            keys = Object.keys(self.constructor.prototype),
                            keysCount = keys.length;
                        for (let keyCounter = 0; keyCounter < keysCount; keyCounter++) {
                            let property = keys[keyCounter];
                            if (called.includes(property) || !property.endsWith("_ctor")) {
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
        }
        catch (e) {
            console.log(e)
        }
        return classType;
    }
    /**
     * 
     * @param {string or string[]} classes className or classNames to load
     * single className is converted to an Array of classes
     * @returns {Promise.all} Promises of all loading classes
     */
    static loadClasses(classes) {
        if (classes === undefined || classes.length === 0) { return Promise.resolve(); }
        const assembly = Mrbr.System.Assembly;
        let loadClassesPromises = (Array.isArray(classes) ? classes : [classes])
            .map(function (className) {
                return new Promise(function (resolve, reject) {
                    assembly
                        .loadClass(className)
                        .then(function (result) { resolve(className) });
                })
            })
        if (loadClassesPromises === undefined || loadClassesPromises.length === 0) {
            return Promise.resolved([]);
        }
        else {
            return Promise.all(loadClassesPromises);
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
        if (config !== undefined && config !== null) {
            if (config.assemblyResolvers !== undefined && config.assemblyResolvers !== null) {
                assembly.fileReplacements = config.assemblyResolvers;
            }
        }
        assembly._loader = {};
        assembly.setArrayPolyFills();
        return new Promise(function (resolve, reject) {
            assembly
                .loadFile(Mrbr.System.Assembly.resolveNamespaceToFile("Mrbr.Utils.Parser.tokenTypes") + ".json")
                .then(() => assembly.loadClass("Mrbr.Utils.Parser.Tokeniser"))
                .then(() => assembly.loadClass("Mrbr.System.ManifestEntry"))
                .then(() => assembly.loadClass("Mrbr.System.Inheritance"))
                .then(function () {
                    Function(assembly.addTypeNameScript("Mrbr.System.Assembly"))();
                    return assembly.loadClasses(assembly.using)
                })
                .then(function () {
                    resolve();
                })
            // .catch(res => {
            //     // console.log(res)
            // });
        })
    }
    /**
     * When run in the Browser provides an onReady function.
     * Once Assembly.initialised is resolved events are set for when browser DOM is "ready"
     * @returns {Promise} DOM is "ready"
     */
    static onReady(config) {
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
        }
        let handlers = [];
        return new Promise(function (resolve, reject) {
            fnResolve = resolve;
            Mrbr.System.Assembly
                .initialised(config)
                .then(() => {
                    if (document.readyState === "complete") {
                        resolve("complete");
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
                });
        });
    }
} 
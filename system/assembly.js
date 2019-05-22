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
    constructor() { }
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
    static using = ["Mrbr.System.ManifestEntry"]
    static toObject(...args) {
        let argCount = args.length,
            target = (argCount === 1) ? window : args[0],
            nsParts = args[args.length - 1].split("."),
            currentObject = target,
            nsCounter = 0, partName, nsPartsLength = nsParts.length;
        for (; nsCounter < nsPartsLength; nsCounter++) {
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
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, true);
        xmlHttp.send("");
        let prm = new Promise((resolve, reject) => {
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
    static typePropertyName = "mrbrAssemblyTypeName"
    /**
     * 
     * @param {string} className script source to run to add  full namespaced object name to loaded class
     */
    static addTypeNameScript(className) { const assembly = Mrbr.System.Assembly; return `${className}.${assembly.typePropertyName} = "${className}";Object.defineProperty(${className}.prototype, '${assembly.typePropertyName}', { get: function() {return ${className}.${assembly.typePropertyName};}});` }
    /**
     * Default Collection of replacements of namespaces to files
     */
    static fileReplacments = [
        { replace: /^Mrbr\./, with: "/" },
        { replace: /\./g, with: "/" }
    ];
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
        Mrbr.System.Assembly.setArrayPolyFills = Mrbr.System.Assembly.nop;
    }
    /**
     * Static object of all files loaded through Assembly
     */
    static loader = {};
    /**
     * 
     * @param {string} className    load file from namespaced object name
     *                              Mrbr.System.Inheritance loads file /system/inheritance.js
     *                              load associated files, inherited and usings
     * @returns {Promise}           when class and all associated files are loaded
     */
    static loadClass(className) {
        let fnResolve,
            fnReject,
            classNames = [className],
            fileName = className
        const assembly = Mrbr.System.Assembly,
            assemblyToObject = assembly.toObject,
            fileReplacments = Mrbr.System.Assembly.fileReplacments,
            prm = new Promise(function (resolve, reject) {
                fnResolve = resolve;
                fnReject = reject;
            }),
            assemblyLoadClasses = assembly.loadClasses,
            assemblySetInheritance = assembly.setInheritance,
            assemblyAddClassCtor = assembly.addClassCtor;
        fileReplacments.forEach(replacement => {
            fileName = `${fileName.replace(replacement.replace, replacement.with)}`
        });
        fileName += ".js"
        assembly.loadFile(fileName)
            .then(async function (result) {
                let obj = assemblyToObject(className);
                if (!(obj instanceof Function)) {
                    Function(`${result};${assembly.addTypeNameScript(className)}`)();
                    obj = assemblyToObject(className);
                }
                let toloadCount = 0,
                    lastToloadCount = -1,
                    newClasses = [];
                while (toloadCount != lastToloadCount) {
                    lastToloadCount = toloadCount;
                    let toload = ([].concat(obj.using ? obj.using : [], obj.inherits ? obj.inherits : [], newClasses)).distinct();
                    toloadCount = toload.length;
                    classNames = classNames.concat(toload).distinct()
                    newClasses = await assemblyLoadClasses(toload);
                    toloadCount += newClasses === undefined ? 0 : newClasses.length;
                }
                classNames.forEach(function (cls) {
                    let obj = assemblyToObject(cls);
                    if (obj instanceof Function) {
                        assemblySetInheritance(obj.inherits, obj)
                        assemblyAddClassCtor(assemblyToObject(cls));
                    }
                });
                fnResolve();
            });
        return prm;
    }
    /**
     * 
     * @param {ManifestEntry[]} manifest load an array of manifest entries, script or classes n.    
     */
    static loadManifest(manifest) {
        if (manifest === undefined) { return Promise.resolve() }
        const assembly = Mrbr.System.Assembly,
            fileTypes = Mrbr.System.ManifestEntry.FileTypes,
            assemblyLoadClass = assembly.loadClass,
            assemblyLoadScript = assembly.loadScript;
        return Promise.all((Array.isArray(manifest) ? manifest : [manifest])
            .map(function (manifestEntry) {
                switch (manifestEntry.fileType) {
                    case fileTypes.Class:
                        return new Promise((resolve, reject) => {
                            assemblyLoadClass(manifestEntry.entryName).then(result => resolve());
                        })
                    case fileTypes.Script:
                        return new Promise((resolve, reject) => {
                            assemblyLoadScript(manifestEntry.entryName).then(result => resolve());
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
        return new Promise((resolve, reject) => {
            assembly.loadFile(fileName)
                .then(result => {
                    Function(result)();
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
     * List of functions to find constructor in class source code
     * Called in sequence to find "constructor", (arguments) and {code}
     * Used to create constructor inheritance as className_ctor for each inherited class
     * Replaces super() for calling single base class
     * e.g. class_1_ctor(), class_2_ctor()
     */
    static getConstructor = [
        function (arg) { return (arg.token.type === arg.keyword && arg.token.value(arg.text) === "constructor") },
        function (arg) { if (arg.token.type === arg.parseableBlock && arg.token.value(arg.text) === "(") { arg.tokenArgs.start = arg.token.start; arg.paranthesisLevel = arg.token.paranthesisLevel; return true } else { return false; } },
        function (arg) { if (arg.token.type === arg.parseableBlock && arg.token.value(arg.text) === ")" && arg.paranthesisLevel === arg.token.paranthesisLevel) { arg.tokenArgs.end = arg.token.end; return true } else { return false; } },
        function (arg) { if (arg.token.type === arg.parseableBlock && arg.token.value(arg.text) === "{") { arg.tokenBody.start = arg.tokens[arg.count + 1].start; arg.bodyLevel = arg.token.level; return true; } else { return false; } },
        function (arg) { if (arg.token.type === arg.parseableBlock && arg.token.value(arg.text) === "}" && arg.bodyLevel === arg.token.level) { arg.tokenBody.end = arg.tokens[arg.count - 1].end; return true; } else { return false; } }
    ]
    /**
     * 
     * @param {class} classType  copies source code from Class constructor to a class' function ctor
     * If ctor already exists, created by user at design time or from previous load then it will not be created again
     * Parses class and finds constructor in source code. Creates a duplicate Function called ctor on class with same arguments and source code
     * @returns {class} returns passed in classType
     */
    static addClassCtor(classType) {
        if (Object.getOwnPropertyDescriptor(classType.prototype, "ctor")) { return classType; }
        let func,
            tokenCounter = 0,
            fnPos = 0;
        const mTokeniser = Mrbr.Utils.Parser.Tokeniser,
            tokenString = classType.prototype.constructor.toString(),
            tokeniser = new mTokeniser(tokenString),
            tokens = tokeniser.Tokenise(),
            Token = Mrbr.Utils.Parser.Token,
            TokenTypes = Token.TokenTypes,
            tokenCount = tokens.length,
            fn = Mrbr.System.Assembly.getConstructor,
            passObj = {
                token: undefined,
                parseableBlock: TokenTypes.ParseableBlock,
                keyword: TokenTypes.Keyword,
                text: tokenString,
                tokenArgs: new Token(),
                paranthesisLevel: 0,
                tokenBody: new Token(),
                bodyLevel: 0,
                count: tokenCounter,
                tokens: tokens
            };
        func = fn[0];
        for (; tokenCounter < tokenCount; tokenCounter++) {
            passObj.token = tokens[tokenCounter];
            passObj.count = tokenCounter;
            if (func(passObj)) {
                func = fn[++fnPos];
                if (fnPos === fn.length) { break; }
            }
        }
        if (passObj.tokenBody.end && passObj.tokenArgs.end) {
            try {
                var fnProperty;
                if (passObj.tokenArgs.value(tokenString) === "()") {
                    fnProperty = Function(`${passObj.tokenBody.value(tokenString)}`);
                }
                else {
                    var params = passObj.tokenArgs.value(tokenString);
                    fnProperty = Function(`${params.substring(1, params.length - 1)}`, `${passObj.tokenBody.value(tokenString)}`);
                }
                Object.defineProperty(classType.prototype, "ctor", {
                    value: fnProperty,
                    configurable: false,
                    enumerable: true,
                    writable: false,
                    name: "ctor"
                })
            }
            catch (e) {
                console.log(e);
                console.log(passObj.tokenBody)
                console.log(passObj.tokenArgs)
                console.log(`${passObj.tokenArgs.value(tokenString)}`)
                console.log(`${passObj.tokenBody.value(tokenString)}`)
                throw e;
            }
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
        return Promise.all((Array.isArray(classes) ? classes : [classes])
            .map(function (className) {
                return new Promise(function (resolve, reject) {
                    assembly.loadClass(className).then(result => resolve(className));
                })
            }));
    }
    /**
     * 
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
     */
    static initialised() {
        const assembly = Mrbr.System.Assembly;
        assembly.setArrayPolyFills();
        return new Promise((resolve, reject) => {
            assembly
                .loadClass("Mrbr.Utils.Parser.Tokeniser")
                .then(function () { return assembly.loadClass("Mrbr.System.Inheritance") })
                .then(function () {
                    Function(assembly.addTypeNameScript("Mrbr.System.Assembly"))();
                    return assembly.loadClasses(assembly.using)
                })
                .then(function () { resolve(); });
        })
    }
}

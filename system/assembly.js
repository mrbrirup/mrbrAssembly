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
        let argCount = args.length,
            target = (argCount === 1) ? window : args[0],
            nsParts = args[args.length - 1].split("."),
            currentObject = target;
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
        let loader = Mrbr.System.Assembly.loader;
        if (loader.hasOwnProperty(url)) {
            return loader[url].promise;
        }
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, true);
        xmlHttp.send("");
        let prm = new Promise(function (resolve, reject) {
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState === 4) {
                    if (xmlHttp.status == 200) {
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
    static get fileReplacments() {
        return [
            { replace: new RegExp("^Mrbr\\."), with: "/" },
            { replace: new RegExp("\\.", "g"), with: "/" }
        ];
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
            fileReplacements = Mrbr.System.Assembly.fileReplacments,
            assemblyLoadClasses = assembly.loadClasses,
            assemblySetInheritance = assembly.setInheritance,
            assemblyAddClassCtor = assembly.addClassCtor;
        fileReplacements.forEach(replacement => {
            fileName = `${fileName.replace(replacement.replace, replacement.with)}`
        });
        fileName += ".js"
        return new Promise(function (resolve, reject) {
            assembly.loadFile(fileName)
                .then(function (result) {
                    let obj = assemblyToObject(className);
                    if (!(obj instanceof Function)) {
                        try {
                            Function(`${result}`)();
                            Function(`${assembly.addTypeNameScript(className)}`)();
                        }
                        catch (e) {
                            console.log(e)
                        }
                    }
                    obj = assemblyToObject(className);
                    let toloadCount = 0,
                        lastToloadCount = -1,
                        newClasses = [];
                    new Promise(function (resolveLoadClasses, rejectLoadClasses) {
                        let loopLoadClasses = function () {
                            lastToloadCount = toloadCount;
                            let toload = ([].concat(obj.using ? obj.using : [], obj.inherits ? obj.inherits : [], newClasses)).distinct();
                            toloadCount = toload.length;
                            classNames = classNames.concat(toload).distinct()

                            assemblyLoadClasses(toload)
                                .then(function (result) {
                                    newClasses = result;
                                    var count = ((newClasses === undefined) ? 0 : newClasses.length)
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
                                    classNames.forEach(function (cls) {
                                        let obj = assemblyToObject(cls);
                                        if (obj instanceof Function) {
                                            assemblySetInheritance(obj.inherits, obj)
                                            assemblyAddClassCtor(obj);
                                        }
                                    });
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
            tokeniser = new mTokeniser(Mrbr.System.Assembly.loader["utils/parser/tokenTypes.json"].result),
            tokens = tokeniser.tokenise(tokenString),
            Token = Mrbr.Utils.Parser.Token,
            tokensLength = tokens.length,
            TokenGroups = Token.Groups;
        let searching = true,
            counter = 0,
            argumentLevel = 0,
            argumentStart = 0,
            argumentEnd = 0,
            bodyStart = 0,
            bodyEnd = 0,
            bodyLevel = 0;
        //  find text for start of constructor is source text
        while (searching && counter < tokensLength) {
            if (tokens[counter].group == TokenGroups.Keyword && tokens[counter].type === 'constructor') {
                var v = tokens[counter].value;
                searching = false;
            }
            else {
                counter++;
            }
        }
        //  Find start of parenthesis for arguments
        searching = true;
        while (searching && counter < tokensLength) {
            if (tokens[counter].group == TokenGroups.Block
                && tokens[counter].value == "(") {
                var v = tokens[counter].value;
                argumentStart = counter;
                argumentLevel = tokens[counter].levels.parens;
                searching = false;
            }
            else {
                counter++;
            }
        }
        //  Find end of parenthesis for arguments
        searching = true;
        while (searching && counter < tokensLength) {
            if (tokens[counter].group == TokenGroups.Block
                && tokens[counter].value == ")"
                && tokens[counter].levels.parens == argumentLevel) {
                argumentEnd = counter;
                searching = false;
            }
            else {
                counter++;
            }
        }
        // Convert Tokens to arguments list
        let fnArgs = []
        let fnArguments = "";
        if (argumentEnd > argumentStart) {
            for (let counter = argumentStart + 1; counter <= argumentEnd - 1; counter++) {
                if (tokens[counter].value == "," && tokens[counter].levels.parens == argumentLevel) {
                    fnArgs.push(fnArguments)
                    fnArguments = "";
                }
                else {
                    fnArguments += tokens[counter].value
                }
            }
            if (fnArguments.length > 0) {
                fnArgs.push(fnArguments);
            }
        }
        // find start of constructor body text
        searching = true;
        while (searching && counter < tokensLength) {
            if (tokens[counter].group == TokenGroups.Block
                && tokens[counter].value == "{") {
                bodyStart = counter;
                bodyLevel = tokens[counter].levels.braces;
                searching = false;
            }
            else {
                counter++;
            }
        }
        // find end of constructor body text
        searching = true;
        while (searching && counter < tokensLength) {
            if (tokens[counter].group == TokenGroups.Block
                && tokens[counter].value == "}"
                && tokens[counter].levels.braces == bodyLevel) {
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
            let body = "";
            if (bodyEnd > bodyStart) {
                for (let counter = bodyStart + 1; counter <= bodyEnd - 1; counter++) {
                    body += tokens[counter].value
                }
            }
            body = body.trim();
            var fnProperty;
            if (fnArgs.length == 0) {
                fnProperty = Function(`${body}`);
            }
            else {
                fnProperty = Function(fnArgs, body);
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
        var prms = (Array.isArray(classes) ? classes : [classes])
            .map(function (className) {
                return new Promise(function (resolve, reject) {
                    assembly
                        .loadClass(className)
                        .then(function (result) { resolve(className) });
                })
            })
        if (prms === undefined || prms.length === 0) {
            return Promise.resolved([]);
        }
        else {
            return Promise.all(prms);
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
    static initialised() {
        const assembly = Mrbr.System.Assembly;
        assembly._loader = {};
        assembly.setArrayPolyFills();
        return new Promise(function (resolve, reject) {
            assembly
                .loadFile("utils/parser/tokenTypes.json")
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
    static onReady() {
        return new Promise(function (resolve, reject) {
            Mrbr.System.Assembly
                .initialised()
                .then(() => {
                    if (document.readyState === "complete") {
                        resolve("complete");
                    }
                    else {
                        if (document.addEventListener) {
                            document.addEventListener("DOMContentLoaded", function () { resolve("DOMContentLoaded") }, false);
                            window.addEventListener("load", function () { resolve("load") }, false);
                        } else {
                            document.attachEvent("onreadystatechange", function () { resolve("onreadystatechange") });
                            window.attachEvent("onload", function () { resolve("onload") });
                            window.attachEvent("load", function () { resolve("load") });
                        }
                    }
                });
        });
    }
} 
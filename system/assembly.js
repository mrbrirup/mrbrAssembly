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
    static toObject(...args) {
        let argCount = args.length,
            target = (argCount == 1) ? window : args[0],
            nsParts = args[args.length - 1].split("."),
            currentObject = target;
        for (let nsCounter = 0, partName; nsCounter < nsParts.length; nsCounter++) {
            partName = nsParts[nsCounter];
            if (currentObject[partName] == undefined) {
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
            return loader[url].promise
        }
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
        let prm = new Promise((resolve, reject) => {
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState === 4) {
                    if (xmlHttp.status === 200) {
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
    static addTypeNameScript(className) { const assembly = this; return `${className}.${assembly.typePropertyName} = "${className}";Object.defineProperty(${className}.prototype, '${assembly.typePropertyName}', { get: function() {return ${className}.${assembly.typePropertyName};}});` }
    /**
     * Default replace Regex to replace Mrbr in namespace to url root when loading file
     */
    static rxMrbrReplaceRoot = /^Mrbr\./
    /**
     * Default regex to replace all instances of dot
     */
    static rxMrbrReplaceDots = /\./g
    /**
     * Collection of replacements of namespaces to files
     */
    static fileReplacments = [
        {replace:Mrbr.System.Assembly.rxMrbrReplaceRoot , with:"/"},
        {replace:Mrbr.System.Assembly.rxMrbrReplaceDots , with:"/"}
    ];
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
        const assembly = this,
            assemblyToObject = assembly.toObject,
            fileReplacments = Mrbr.System.Assembly.fileReplacments;
        return new Promise((resolve, reject) => {
            let obj = assemblyToObject(className);
            if (!(obj instanceof Function)) {
                let fileName;
                fileReplacments.forEach(replacement=>{
                    fileName = `${className.replace(replacement.replace, replacement.with)}.js`
                });
                assembly.loadFile(fileName)
                    .then(result => {
                        Function(`${result};${assembly.addTypeNameScript(className)}`)();
                        obj = assemblyToObject(className);
                        var toload = [].concat(obj.using ? obj.using : [], obj.inherits ? obj.inherits : []);
                        assembly.loadClasses(toload).then(result => {
                            assembly.setInheritance(obj.inherits, obj);
                            assembly.addClassCtor(assemblyToObject(className));
                            resolve(obj)
                        });
                    })
            }
        })
    }
    /**
     * List of functions to find constructor in class source code
     * Called in sequence to find "constructor", (arguments) and {code}
     * Used to create constructor inheritance as className_ctor for each inherited class
     * Replaces super() for calling single base class
     * e.g. class_1_ctor(), class_2_ctor()
     */
    static getConstructor = [
        function (arg) { return (arg.token.type == arg.keyword && arg.token.value(arg.text) === "constructor") },
        function (arg) { if (arg.token.type == arg.parseableBlock && arg.token.value(arg.text) === "(") { arg.tokenArgs.start = arg.token.start; arg.paranthesisLevel = arg.token.paranthesisLevel; return true } else { return false; } },
        function (arg) { if (arg.token.type == arg.parseableBlock && arg.token.value(arg.text) === ")" && arg.paranthesisLevel == arg.token.paranthesisLevel) { arg.tokenArgs.end = arg.token.end; return true } else { return false; } },
        function (arg) { if (arg.token.type == arg.parseableBlock && arg.token.value(arg.text) === "{") { arg.tokenBody.start = arg.tokens[arg.count + 1].start; arg.bodyLevel = arg.token.level; return true; } else { return false; } },
        function (arg) { if (arg.token.type == arg.parseableBlock && arg.token.value(arg.text) === "}" && arg.bodyLevel == arg.token.level) { arg.tokenBody.end = arg.tokens[arg.count - 1].end; return true; } else { return false; } }
    ]
    /**
     * 
     * @param {class} classType  copies source code from Class constructor to a class' function ctor
     * If ctor already exists, created by user at design time or from previous load then it will not be created again
     * Parses class and finds constructor in source code. Creates a duplicate Function called ctor on class with same arguments and source code
     */
    static addClassCtor(classType) {
        if (Object.getOwnPropertyDescriptor(classType.prototype, "ctor")) { return; }
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
            tokenConstructorBody = new Mrbr.Utils.Parser.Token(),
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
                if (fnPos == fn.length) { break; }
            }
        }
        if (passObj.tokenBody.end && passObj.tokenArgs.end) {
            try {
                Object.defineProperty(classType.prototype, "ctor", {
                    value: Function(`return function ctor ${passObj.tokenArgs.value(tokenString)} {${passObj.tokenBody.value(tokenString)}}`)(),
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
                console.log(`return function ctor ${tokenConstructorArgs.value(tokenString)} {${tokenConstructorBody.value(tokenString)}}`)
                throw e; 
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
        if (classes == undefined) { return Promise.resolve(); }
        const assembly = this;
        return Promise.all((Array.isArray(classes) ? classes : [classes])
            .map(function (className) {
                return new Promise(function (resolve, reject) {
                    assembly.loadClass(className).then(result => resolve());
                })
            }));
    }
    /**
     * 
     * @param {string[]} sources Array of sources to apply as base classes to target  
     * @param {class} target Target object for inheritance
     */
    static setInheritance(sources, target) {
        if (sources == undefined) { return; }
        Mrbr.System.Inheritance.applyInheritance(sources, target);
    }
}
/**
 * Load the required classes and usings for Mrbr.System.Assembly
 * Specific requirement for this class only
 */
Mrbr.System.Assembly.loadClass("Mrbr.Utils.Parser.Tokeniser").then(() => {
    Mrbr.System.Assembly.loadClass("Mrbr.System.Inheritance")
})
Function(Mrbr.System.Assembly.addTypeNameScript("Mrbr.System.Assembly"))()
Mrbr.System.Assembly.loadClasses(Mrbr.System.Assembly.using);
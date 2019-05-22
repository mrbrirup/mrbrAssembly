/**
 * Inheritance functions for Classes
 */
Mrbr.System.Inheritance = class {
    /**
     * Currently not used, static classes
     */
    constructor() {}
    /**
     * Non-inhertiable properties not to assign to parent class
     * Constructors cannot be inherited and are created as className_ctor
     * e.g. Mrbr.Utils.Parser.Tokeniser's constructor is created as Mrbr_Utils_Parser_Tokeniser_ctor
     */
    static nonInheritable = ["constructor", "mrbrAssemblyTypeName", "bases", "allBases", "inherited"]
    /**
     * 
     * @param {string or string[]} sources source for inheritance string is converted to string[]
     * @param {class} target class that will inherit from sources
     */
    static applyInheritance(sources, target) {
        if (sources === undefined || sources.length === 0) { return; }
        let targetPrototype = target.prototype,
            nonInheritable = Mrbr.System.Inheritance.nonInheritable,
            toObject = Mrbr.System.Assembly.toObject;
        (Array.isArray(sources) ? sources : [sources])
            .forEach(async strSource => {
                let sourcePrototype = toObject(strSource).prototype;
                if(sourcePrototype === undefined){
                    await Mrbr.System.Assembly.loadClass(strSource);
                    sourcePrototype = toObject(strSource).prototype;
                }
                if(sourcePrototype !== undefined){}
                    Object.getOwnPropertyNames(sourcePrototype)
                    .forEach(propertyName => {
                        if (!nonInheritable.includes(propertyName)) {
                            if (propertyName !== "ctor" && Object.getOwnPropertyDescriptor(targetPrototype, propertyName) === undefined) {
                                Object.defineProperty(targetPrototype, propertyName, Object.getOwnPropertyDescriptor(sourcePrototype, propertyName))
                            }
                            Object.defineProperty(targetPrototype, `${strSource.replace(/\./g, "_")}_${propertyName}`, Object.getOwnPropertyDescriptor(sourcePrototype, propertyName))                            
                        }
                    })                
            })
    }
}
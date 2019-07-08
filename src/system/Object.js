class {
    constructor(...args) {
        this._name = args[0].name;
    }
    get name() { return this._name; }
    set name(value) { this._name = value; }
    typeMatch(...args){
        if(args === undefined || args.length === 0 ){
            throw "Nothing to compare";
        }
        else if(args.length === 1){
            if (!args[0].hasOwnProperty("mrbrAssemblyTypeName")) {
               return false;
            }
            return this.mrbrAssemblyTypeName === args[0].mrbrAssemblyTypeName;            
        }
        else{
            if(!args[0].constructor.hasOwnProperty("mrbrAssemblyTypeName") || !args[1].hasOwnProperty("mrbrAssemblyTypeName")){
                return false;
            }
            return args[0].mrbrAssemblyTypeName === args[1].mrbrAssemblyTypeName;
        }
    }
    isTypeOf(checkObject) {
        return this.typeMatch(this, checkObject)
    }
    canTypeMatch(whatIsThis, canItBeThis ){
        if(!whatIsThis || !canItBeThis){
            throw "Nothing to compare";
        }
        const whatIsThisBases = whatIsThis.bases();
        if(!whatIsThisBases && whatIsThisBases.length === 0){
            return false;
        }
        return whatIsThisBases.includes(canItBeThis.mrbrAssemblyTypeName);                    
    }
    canBeTypeOf(checkObject){
        return this.canTypeMatch(this, checkObject);
    }
}
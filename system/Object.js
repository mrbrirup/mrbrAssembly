class{
    constructor(...args){
        this._name = args[0].name;        
    }
    get name(){return this._name;}
    set name(value){this._name = value;}   
}
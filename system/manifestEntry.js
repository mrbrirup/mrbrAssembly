Mrbr.System.ManifestEntry = class {
    constructor(fileType,entryName){
        this.fileType = fileType,
        this.entryName = entryName;
    }
    get fileType(){return this._fileType}
    set fileType(value){this._fileType = value;}
    get entryName(){return this._entryName;}
    set entryName(value){this._entryName = value;}
    static FileTypes = {
        Class: "class",
        Script: "script"
    }
}
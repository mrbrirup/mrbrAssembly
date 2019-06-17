/**
 * Manifest entry when loading files
 * Files are processed differently for each type
 */
class {
    /**
     * 
     * @param {string} fileType One of ManifestEntry.FileTypes
     * @param {string} entryName File name or className to load
     */
    constructor(fileType, entryName) {
        this.fileType = fileType;
        this.entryName = entryName;
    }
    /**
     * @param {string} value file type to load, one of ManifestEntry.FileTypes
     * @returns {string} file type to load, one of ManifestEntry.FileTypes
     */
    get fileType() { return this._fileType }
    set fileType(value) { this._fileType = value; }
    /**
     *  @param {string} value File name or className
     *  @returns {string} File name or className
     */
    get entryName() { return this._entryName; }
    set entryName(value) { this._entryName = value; }
    /**
     * File types that can be processed
     * @returns {Object:Class|Script|File} Object of FileType values
     */
    static get FileTypes() {
        return {
            Class: "class",
            Script: "script",
            File: "file",
            Interface: "interface",
            Config: "config",
            ScriptElement: "scriptElement",
            LinkedScript: "linkedScript"
        }
    }
}
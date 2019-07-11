/*
Copyright (c) 2019 Martin Ruppersburg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
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
            LinkedScript: "linkedScript",
            Style:"styleElement",
            LinkedStyle:"linkedStyle",
            Component:"component"
        }
    }
}
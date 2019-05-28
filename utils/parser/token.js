/**
 * Token used by tokeniser.
 * Holds position of token start and end in source text, but does not contain the text fragment
 * Source is pointer to source text and is requied to obtain text fromgment from source
 */
Mrbr.Utils.Parser.Token = class {
    /**
     * @returns {number} integer for unique token id, multiple tokenisers can created at a time. The ids are unique across all tokenisers
     *  
     */
    static get nextId() {
        if (Mrbr.Utils.Parser.Token.__id == undefined) {
            Mrbr.Utils.Parser.Token.__id = 0;
        }
        return Mrbr.Utils.Parser.Token.__id++;
    }
    constructor(start, length, group, type) {
        this._group = group;   // from TokenTypes
        this._type = type;   // from TokenTypes
        this._start = start || 0;  //  Token start position in source
        this._length = length || 0;    //  Token end position in source
        this._source;
        this._children = [];
        this._levels = {
            brackets: 0,
            braces: 0,
            parens: 0
        }
        this._id = Mrbr.Utils.Parser.Token.nextId;
    }
    /**
     * @returns {number} end of text fragment. Calculated from start and length
     */
    get end() { return this.start + this.length }
    /**
     * Source text that has been tokenised
     * @param {string} value text
     * @returns {string} source text that has tokenised
     */
    set source(value) { this._source = value; }
    get source() { return this._source; }    
    /**
     * @param {Token[]} value Array of tokens. That parent can be broken down into
     * @returns {Token[]} Array of child tokens. Can be used if Token can be further broken down into separate tokens
     */
    get children() { return this._children; }
    set children(value) { this._children = value; }
    /**
     * @param {string} value. Type of token, used as sub-division of group of tokens. Can be any value
     * @returns {string} Type of token, used as sub-division of group of tokens. Can be any value
     */
    get type() { return this._type; }
    set type(value) { this._type = value; }
    /**
     * @returns {number} Start point of token in source text
     * @param {number} value Start point of token in source text
     */
    get start() { return this._start }
    set start(value) { this._start = value }
    /**
     * @param {value} Length of Token fragment
     * @returns {number} Length of token fragment
     */
    get length() { return this._length; }
    set length(value) { this._length = value; }
    /**
     * @param {Object:brackets{number},braces{number},parens{number}} value Bracket levels, separately defined for brackets[], braces{} and parens()
     * @returns {Object:brackets{number},braces{number},parens{number}} Bracket levels, separately defined for brackets[], braces{} and parens()
     */
    get levels() { return this._levels; }
    set levels(value) { this._levels = value; }
    /**
     * @param {string} value Main Group type. Must be one of Token.Groups 
     * @returns {string} Main Group type. Must be one of Token.Groups
     */
    get group() { return this._group; }
    set group(value) { this._group = value; }
    /**
     * @param {number} value Unique Token id
     * @returns {number} Unique Token id
     */
    get id() { return this._id; }
    set id(value) { this._id = value; }
    /**
     *
     * @param {string} source text to get token value from
     * Token text is not contained in Token, it is looked up from the source between start and end
     */
    get value() { return `${this.source.substr(this.start, this.length)}` }
    /**
     *
     * @param {string} source text to get substring from
     * Summary token information
     */
    toString(source) {
        return `${this.start}, ${this.end}, ${this.type}, ${this.level}, "${source.substring(this.start, this.end)}"`
    };
    /**
     * Group Types of parsed tokens
     */
    static get Groups() {
        return {
            Other: "other",
            Whitespace: "whitespace",
            Number: "number",
            Operator: "operator",
            ParseableBlock: "parseableBlock",
            Identifier: "identifier",
            Keyword: "keyword",
            ObjectMethod: "objectMethod",
            Block: "block",
            Quotes: "quotes",
            Comment: "comment"
        }
    }
}
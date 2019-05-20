/**
 * Token from Tokeniser
 */
Mrbr.Utils.Parser.Token = class {
    constructor() {
        this.level = 0; // Level from braces, allows for balanced braces checking
        this.type = null;   // from TokenTypes
        this.start = null;  //  Token start position in source
        this.end = null;    //  Token end position in source
        this.paranthesisLevel = 0;  //  Parenthesis level from (), allow for balanced paranthesis checking
    }
    /**
     * 
     * @param {string} source text to get token value from
     * Token text is not contained in Token, it is looked up from the source between start and end
     */
    value(source) { return `${source.substring(this.start, this.end)}` }
    /**
     * 
     * @param {string} source text to get substring from
     * Summary token information
     */
    toString(source) {
        return `${this.start}, ${this.end}, ${this.type}, ${this.level}, "${source.substring(this.start, this.end)}"`
    };
    /**
     * Types of parsed tokens 
     */
    static get TokenTypes() {
        return {
            Other: "other",
            Whitespace: "whitespace",
            Number: "number",
            Operator: "operator",
            ParseableBlock: "parseableBlock",
            Identifier: "identifier",
            Keyword: "keyword",
            ObjectMethod: "objectMethod"
        }
    }
}
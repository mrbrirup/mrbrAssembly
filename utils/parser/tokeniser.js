/**
 * Tokeniser for Javascript files
*/
Mrbr.Utils.Parser.Tokeniser = class {
    static using = ["Mrbr.Utils.Parser.Token"]
    /**
     * 
     * @param {string} source text to Tokenise
     */
    constructor(source) {
        var self = this;
        self.source = source;
        self.tokens;
        self.tokenPos = -1; // used for iterating through tokens
        //Keywords
        self.keywords = [
            'abstract', 'apply', 'arguments', 'await', 'boolean',
            'break', 'byte', 'call', 'case', 'catch',
            'char', 'class', 'constructor', 'const', 'continue',
            'debugger', 'default', 'delete', 'do',
            'double', 'else', 'enum', 'eval',
            'export', 'extends', 'false', 'final',
            'finally', 'float', 'for', 'forEach', 'function',
            'goto', 'if', 'implements', 'import',
            'in', 'instanceof', 'int', 'interface',
            'let', 'long', 'native', 'new',
            'null', 'package', 'private', 'protected',
            'public', 'return', 'short', 'static',
            'super', 'switch', 'synchronized', 'this',
            'throw', 'throws', 'transient', 'true',
            'try', 'typeof', 'var', 'void',
            'volatile', 'while', 'with', 'yield'
        ];
        //  Keywords that can be use on Javascript objects
        self.objectMethods = [
            'apply', 'call', 'forEach'
        ];
        /**
         * Javascript operators
         */
        self.operators = {
            '=>': "function",
            '>>>=': 'assignUnsignedRightShift',
            '>>=': 'assignmentRightShift',
            '<<=': 'assignmentLeftShift',
            '|=': 'assignBitwiseOr',
            '^=': 'assignBitwiseXor',
            '&=': 'assignBitwiseAnd',
            '+=': 'assignPlus',
            '-=': 'assugnMinues',
            '*=': 'assignMultiply',
            '/=': 'assignDivide',
            '%=': 'assignModulus',
            ';': 'semicolon',
            ',': 'comma',
            '?': 'conditional',
            ':': 'colon',
            '||': 'OR',
            '&&': 'and',
            '|': 'bitwiseOr',
            '^': 'bitwiseXor',
            '&': 'bitwiseAnd',
            '===': 'strictEquals',
            '==': 'equals',
            '=': 'assign',
            '!==': 'stringNotEquals',
            '!=': 'notEquals',
            '<<': 'leftShift',
            '<=': 'lessThanEquals',
            '<': 'lessThan',
            '>>>': 'unsignRightShift',
            '>>': 'rightShift',
            '>=': 'greaterThanEquals',
            '>': 'GreaterThan',
            '++': 'increment',
            '--': 'decrement',
            '+': 'plus',
            '-': 'minus',
            '*': 'multiply',
            '/': 'dicide',
            '%': 'modulus',
            '!': 'not',
            '~': 'bitwiseNot',
            '...': 'spread',
            '.': 'dot'
        };
        /**
         * Parseable textblocks,
         * Blocks usually containing additional keywords
         */
        self.parseableBlocks = {
            '[': 'LEFT_BRACKET',
            ']': 'RIGHT_BRACKET',
            '{': 'LEFT_CURLY',
            '}': 'RIGHT_CURLY',
            '(': 'LEFT_PAREN',
            ')': 'RIGHT_PAREN'
        }
        /**
         * Blocks not usually containing additional keywords
         * These can be parsed separately
         */
        self.blockTypes = {
            "/*": "BLOCK_COMMENT_MULTI",
            '"': "BLOCK_TEXT_DOUBLE",
            "'": "BLOCK_TEXT_SINGLE",
            "//": "BLOCK_COMMENT_SINGLE",
            "`": "BLOCK_TEXT_TICK"
        }
        /**
         * Startposition of fixed blocks
         */
        self.rxFixedBlockStarts = new RegExp("(?<start>\\\/\\\*|\\\"|'|\\\/\\\/)","g")
        /**
         * End positions of fixed blocks
         * Error capture name in Regex's find incorrectly escaped strings, saves additional regex complexity to capture issues
         */
        self.fixedBlockEnds = {
            "/*": new RegExp("(?<end>\\\*\\\/)","g"),
            '"': new RegExp("(\\\"\\\")*(?<end>\\\"{1})(?<error>\\\"*)","g"),
            "'": new RegExp("('')*(?<end>'{1})(?<error>'*)","g"),
            "`": new RegExp("(``)*(?<end>`{1})(?<error>`*)","g"),
            "//": new RegExp("(?<end>\\r\\n|\\n)","g")
        }
        /**
         * Any whitespace
         */
        self.rxWhitespace = new RegExp("[ \\s\\t\\r\\n]","g");
        /** Any numbers */
        self.rxNumbers = new RegExp("(?<![a-zA-Z_])(\\d+\\.*\\d*(?:[eE][-+]?\\d+)?|^\\d+(?:\\.\\d*)?[eE][-+]?\\d+|\\.\\d+(?:[eE][-+]?\\d+)?|0[xX][\\da-fA-F]+|0[0-7]*|^\\d+)","gi")
        /**
         * Regex for Regular Expressions
         */
        self.rxRegularExpressions = new RegExp("/^\\/((?:\\\\.|\\[(?:\\\\.|[^\\]])*\\]|[^\\/])+)\\/([gimy]*)")
    }
    /**
     * Tokenise source string provided to constructor
     */
    Tokenise() {
        var self = this,
            source = self.source,
            tokens = self.tokens = [],
            parseableBlocks = self.parseableBlocks,
            operators = self.operators,
            keywords = self.keywords,
            level = 0,
            parseableBlocks = self.parseableBlocks,
            blockTypes = self.blockTypes,
            rxFixedBlockStarts = self.rxFixedBlockStarts,
            fixedBlockEnds = self.fixedBlockEnds,
            strRxText = `(${self.joinList(operators)})`,
            strRxParseableBlocks = `([${self.joinList(parseableBlocks)}]){1}`,
            rxOperators = new RegExp(strRxText, "g"),
            rxParseableBlocks = new RegExp(strRxParseableBlocks, "g"),
            rxWhitespace = self.rxWhitespace,
            rxNumbers = self.rxNumbers,
            Token = Mrbr.Utils.Parser.Token;
        self.getFixedBlocks(rxFixedBlockStarts, source, blockTypes, fixedBlockEnds, tokens);
        [{ name: Token.TokenTypes.Whitespace, rx: rxWhitespace }, { name: Token.TokenTypes.Number, rx: rxNumbers }, { name: Token.TokenTypes.Operator, rx: rxOperators }, { name: Token.TokenTypes.ParseableBlock, rx: rxParseableBlocks }]
            .forEach(currentParser => {
                self.tokeniseSource(currentParser, source, tokens, level);
            })
        self.markUntypedTokens(tokens, source);
        self.markKeywordsAndIdentifiers(tokens, keywords, source)
        return self.tokens;
    }
    /**
     * 
     * @param {Tokens[]} tokens current list of parsed tokens
     * @param {string[]} keywords keyword list
     * @param {string} source source text
     */
    markKeywordsAndIdentifiers(tokens, keywords, source) {
        var self = this,
            objectMethods = self.objectMethods,
            Token = Mrbr.Utils.Parser.Token;
        tokens = tokens.sort((block1, block2) => block1.start - block2.start)
        var lastLevel = 0;
        for (var blockCounter = 0; blockCounter < tokens.length; blockCounter++) {
            var element = tokens[blockCounter];
            if (!element.level) {
                element.level = lastLevel;
            }
            lastLevel = element.level;
            if (element.type != Token.TokenTypes.Other) {
                continue;
            }
            if (keywords.includes(source.substring(element.start, element.end))) {

                var _blockCounter = blockCounter - 1,
                    found = false;
                while (!found) {
                    if (_blockCounter <= 0) {
                        element.type = Token.TokenTypes.Keyword
                        found = true;
                        continue;
                    }
                    else {
                        var backElement = tokens[_blockCounter];
                        if (backElement.type == Token.TokenTypes.Whitespace) {
                            _blockCounter--;
                            continue;
                        } else if (backElement.type == Token.TokenTypes.Operator && source.substring(backElement.start, backElement.end) == ".") {
                            if (objectMethods.includes(source.substring(element.start, element.end))) {
                                element.type = Token.TokenTypes.ObjectMethod;
                            }
                            else {
                                element.type = Token.TokenTypes.Identifier;
                            }
                            found = true;
                            continue;
                        }
                        else if (keywords.includes(source.substring(backElement.start, backElement.end))) {
                            element.type = Token.TokenTypes.Keyword
                            found = true;
                            continue;
                        }
                    }
                    _blockCounter--;
                }
            }
            else {
                element.type = Token.TokenTypes.Identifier

            }
        }
        tokens.filter(element => element.type == Token.TokenTypes.Other).forEach(element => {
            if (keywords.includes(source.substring(element.start, element.end))) {
                element.type = Token.TokenTypes.Keyword
            }
        })
    }
    /**
     * 
     * @param {Token[]} tokens current list of Tokens
     * @param {string} source source text
     * 
     * Finds text all sections of source text that have not been set as a token
     * Mark them as Other
     */
    markUntypedTokens(tokens, source) {
        var token,
            blockCursor = 0,
            cursorPosition = 0,
            blocksLength = tokens.length,
            Token = Mrbr.Utils.Parser.Token;
        tokens = tokens.sort((block1, block2) => block1.start - block2.start)
        while (cursorPosition < source.length && blockCursor < blocksLength) {
            var currentBlock = tokens[blockCursor];
            if (cursorPosition < currentBlock.start) {
                var token = new Token();
                token.start = cursorPosition;
                token.end = currentBlock.start;
                token.type = Token.TokenTypes.Other;
                tokens.push(token);
            }
            blockCursor++;
            cursorPosition = currentBlock.end;
        }
        if (cursorPosition < source.length - 1) {
            var token = new Token();
            token.start = cursorPosition;
            token.end = source.length - 1;
            tokens.push(token);
        }
        return token;
    }
    /**
     * 
     * @param {RegEx} currentParser current Regex used to parse source
     * @param {string} source text being parsed
     * @param {Token[]} tokens current parsed token Array
     * @param {int} level current brace level
     */
    tokeniseSource(currentParser, source, tokens, level) {
        let rxMatches,
            rxCurrentParser = currentParser.rx,
            Token = Mrbr.Utils.Parser.Token,
            levelDelta = 0,
            paranthesisLevel = 0;
        rxCurrentParser.lastIndex = 0;
        level = 0;
        while ((rxMatches = rxCurrentParser.exec(source)) !== null) {
            if (rxMatches.index === rxCurrentParser.lastIndex) {
                rxCurrentParser.lastIndex++;
            }
            rxMatches.forEach((match, groupIndex) => {
                if (groupIndex == 0 && match.length > 0) {
                    var matchLength = match.length, mIndex = rxMatches.index, matchEnd = mIndex + matchLength;
                    if (!tokens.some((_block => mIndex >= _block.start && mIndex < _block.end) || (matchEnd >= _block.start && matchEnd < _block.end))) {
                        var token = new Token();
                        if (currentParser.name === Token.TokenTypes.ParseableBlock) {
                            switch (source.substring(mIndex, matchEnd)) {
                                case "{":
                                    token.level = level++;
                                    break;
                                case "}":
                                    token.level = --level
                                    break;
                                case "(":
                                    token.paranthesisLevel = paranthesisLevel++;
                                    break;
                                case ")":
                                    token.paranthesisLevel = --paranthesisLevel
                                    break;
                            }
                        }
                        token.start = mIndex;
                        token.end = matchEnd;
                        token.type = currentParser.name;
                        tokens.push(token);
                    }
                }
            });
        }
        return { rxMatches, level };
    }
    /**
     * 
     * @param {RegEx} rxFixedBlockStarts Regex of starts for fixed blocks
     * @param {string} source text being parsed
     * @param {object} blockTypes Token type of block found
     * @param {object} fixedBlockEnds Object with properties names matching start block to look up end blocks 
     * @param {Token[]} tokens current token list
     */
    getFixedBlocks(rxFixedBlockStarts, source, blockTypes, fixedBlockEnds, tokens) {
        var looping = true,
            token,
            inblock = false,
            lastPos = 0,
            lastMatch = "",
            Token = Mrbr.Utils.Parser.Token;
        while (looping) {
            let rxMatches;
            if (!inblock) {
                rxFixedBlockStarts.lastIndex = lastPos;
                if ((rxMatches = rxFixedBlockStarts.exec(source)) !== null) {
                    if (rxMatches.index === rxFixedBlockStarts.lastIndex) {
                        rxFixedBlockStarts.lastIndex++;
                        lastPos++;
                    }
                    var startpos = rxMatches.index, startLen = rxMatches.groups.start.length;
                    lastMatch = source.substr(startpos, startLen);
                    lastPos = rxFixedBlockStarts.lastIndex;
                    inblock = true;
                    token = new Token();
                    token.type = blockTypes[rxMatches[0]];
                    token.start = startpos;
                }
                else {
                    looping = false;
                }
            }
            else {
                var rx = fixedBlockEnds[lastMatch];
                rx.lastIndex = lastPos;
                if ((rxMatches = rx.exec(source)) !== null) {
                    var curPos = rx.lastIndex - 1,
                        sourceLength = source.length,
                        searching = true,
                        escaped = false;
                    while (searching) {
                        if (curPos >= sourceLength) {
                            searching = false;
                        }
                        else {
                            switch (source[curPos]) {
                                case "\\":
                                    break;
                                case '"':

                                    if (token.type == "BLOCK_TEXT_DOUBLE") {

                                        if (source[curPos - 1] == '\\') {

                                            curPos++
                                        }
                                        else {
                                            searching = false;
                                        }
                                    }
                                    break;
                                case "'":
                                    if (token.type == "BLOCK_TEXT_SINGLE") {
                                        if (source[curPos - 1] == "\\") {
                                            curPos++
                                        }
                                        else {
                                            searching = false;
                                        }
                                    }
                                    break;
                                case "\n":
                                    if (token.type == "BLOCK_COMMENT_SINGLE") {
                                        searching = false;
                                    }
                                    break;
                                case "/":
                                    if (token.type == "BLOCK_COMMENT_MULTI" && source[curPos - 1] == '*') {
                                        searching = false;
                                        curPos--;
                                    }
                                    break;
                            }
                        }
                        curPos++;
                    }
                    rx.lastIndex = curPos;
                    lastPos = curPos;
                    var endpos = curPos - 1;
                    var endLen = rxMatches.groups.end.length;
                    lastMatch = source.substr(endpos, endLen);
                    inblock = false;
                    token.end = endpos + endLen;
                    tokens.push(token);
                }
                else {
                    looping = false;
                }
            }
        }
        return { inblock, lastPos, lastMatch, token };
    }
    /**
     * 
     * @param {string[]} object array to join to create RegEx Or List
     */
    joinList(object) {
        var matchText = "";
        for (var i in object) {

            if (matchText !== '') {
                matchText += '|';
            }
            matchText += i.replace(/[?|^&(){}\[\]+\-*\/\.]/g, '\\$&');
        }
        return matchText;
    }
    /**
     * View next Token in List with out consuming it
     */
    peek() {
        return this.tokens[this.tokenPos + 1];
    }
    /**
     * Get and consume next token
     */
    next() {
        return this.tokens[++this.tokenPos];
    }
    /**
     * return current token without consuming it
     */
    get() {
        if (this.tokenPos < 0) { this.tokenPos = 0; }
        return this.tokens[this.tokenPos];
    }
    /**
     * Get all tokens
     */
    all() {
        return this.tokens;
    }
    /**
     *  
     * @param {int} pos get token at position
     */
    at(pos) {
        return this.tokens[pos];
    }
    /**
     * Reset token position to start of list
     */
    reset() {
        this.tokenPos = -1;
    }
}
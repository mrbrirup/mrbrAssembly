/**
 * Tokeniser for Javascript files
*/
Mrbr.Utils.Parser.Tokeniser = class Tokeniser {
    static get using() { return ["Mrbr.Utils.Parser.Token"]; }
    constructor(types) {
        var self = this; types
        self.types = JSON.parse(types)
        self.tokens = [];
        self.initialBlocks = self.types.initialBlocks;
        self.whitespace = self.types.whitespace;
        self.keywords = self.types.keywords;
        self.objectMethods = self.types.objectMethods;
        self.operators = self.types.operators;
        self.blocks = self.types.blocks;
        self.identifier = self.types.identifier
    }
    /**
     * 
     * @param {string} source Source text to be Tokenised
     */
    tokenise(source) {
        let self = this,
            selfTokeniseQuotes = self.tokeniseQuotes,
            selfTokeniseBlockComment = self.tokeniseBlockComment,
            selfTokeniseLineComment = self.tokeniseLineComment,
            selfResetTokenPoints = self.resetTokenPoints,
            sourceLength = source.length,
            parserToken = Mrbr.Utils.Parser.Token,
            parserTokenGroups = parserToken.Groups,
            arrRxs = [
                { group: parserTokenGroups.Whitespace, name: "whitespace", rx: /( |\t|\f|\r|\n)\1*/g },
                { group: parserTokenGroups.Quote, name: "quotes", rx: /("|'|`)+/g },
                { group: parserTokenGroups.Comment, name: "comments", rx: /([/]{2}|[/]\*|\*\/)/g },
                { group: parserTokenGroups.Number, name: "exponent", rx: /(\b[0-9]+[.][0-9]e[0-9]+\b|\b[0-9]e[0-9]+\b)/ig },
                { group: parserTokenGroups.Number, name: "hex", rx: /(\b0x[0-9a-f]+\b)/ig },
                { group: parserTokenGroups.Number, name: "octal", rx: /(\b0o{0,1}[0-7]+\b)/ig },
                { group: parserTokenGroups.Number, name: "binary", rx: /(\b0b{1}[0-1]+\b)/ig },
                { group: parserTokenGroups.Number, name: "float", rx: /(\b[0-9]+\.[0-9]+\b)/g },
                { group: parserTokenGroups.Number, name: "integer", rx: /(\b[0-9]+\b)/g },
                { group: parserTokenGroups.Number, name: "infinity", rx: /(\bInfinity\b)/g },
                { group: parserTokenGroups.Number, name: "NaN", rx: /(\bNaN\b)/g },
                { group: parserTokenGroups.Whitespace, name: "crlf", rx: /(\r\n)\1*/g },
                { group: parserTokenGroups.Block, name: "blocks", rx: /([{}[\]()]{1})/g },
                { group: parserTokenGroups.Operator, name: "operators", rx: /(>>>=|>>=|<<=|===|!==|[.]{3}|>{3}|<<|!=|<=|>>|>=|[+]{2}|--|==|=>|[|]=|\^=|&=|\+=|-=|\*=|\/=|%=|\|\||&&|;|,|\?|:|\^|&|=|<|>|\+|-|\*|\/|%|!|~|\.)/g }
            ],
            arrStarts = [],
            tokens = [], firstFound;
        // loop through all tokens regular expressions and create initial marker points
        arrRxs.forEach(rxTypes => {
            rxTypes.rx.lastIndex = 0;
            let match;
            while ((match = rxTypes.rx.exec(source)) !== null) {
                if (match.index === rxTypes.rx.lastIndex) {
                    rxTypes.rx.lastIndex++;
                }
                let pos = match.index;
                arrStarts.push({ key: match[0], pos: pos, sort: pos * sourceLength - match[0].length, type: "rx", rxResult: match, rxGroupName: rxTypes.group, rxTypeName: rxTypes.name, lastIndex: rxTypes.rx.lastIndex, tokenClass: parserToken })
            }
        });
        arrStarts = arrStarts
            .filter(obj => obj.pos >= 0)    // filter for those marker past the start point
            .sort((obj1, obj2) => (obj1.sort - obj2.sort)); //  sort by sort property. Sort property is marker position * source text length - marker length.
        //  Causes longer token to be processed first >>>= before >>= before >=
        //  Shorter tokens are deleted before the next cycle as they share a start point and this has been passed
        firstFound = arrStarts[0];
        // cycle through initial markers, but only work on the first one
        while (arrStarts.length > 0) {
            let token;
            switch (firstFound.key) {
                case '"': case "'": case "`":
                    token = selfTokeniseQuotes(firstFound, source, tokens);
                    break;
                case "/*":
                    token = selfTokeniseBlockComment(firstFound, source, arrStarts)
                    break;
                case "//":
                    token = selfTokeniseLineComment(firstFound, source);
                    break;
                default:    //  Tokenising markers that do not require addition processing, e.g. Operators and Numbers
                    token = new firstFound.tokenClass(firstFound.rxResult.index, firstFound.rxResult[0].length, firstFound.rxGroupName, firstFound.rxTypeName);
                    break;
            };
            tokens.push(token);
            // filter initial marker points to remove points that need to be bypassed, e.g. whitespace in a text block
            arrStarts = selfResetTokenPoints(arrStarts, token.end, source, firstFound);
            firstFound = arrStarts[0];
        }
        //  populate token, groups, types and level
        self.tokens = self.populateTokenProperties(tokens, source);
        return self.tokens;
    }
    /**
     * Fill gaps in tokens.
     * Sorts existing tokens, finds where tokens have not been created, as their structure is less certain, Key words and identifiers, and creates new Token
     * @param {Token[]} tokens List of tokens
     * @param {string} source Source text being tokenised
     */
    fillTokensGaps(tokens, source) {
        let tokensLength = tokens.length,
            parserToken = Mrbr.Utils.Parser.Token,
            parserTokenGroups = parserToken.Groups;
        if (tokens[0].start > 0) {
            tokens.push(new parserToken(0, tokens[0].start, parserTokenGroups.Other));
        }
        for (let tokenCounter = 0; tokenCounter < tokensLength - 1; tokenCounter++) {
            let token1 = tokens[tokenCounter], token2 = tokens[tokenCounter + 1];
            if (token2.start - token1.end > 0) {
                tokens.push(new parserToken(token1.end, token2.start - token1.end, parserTokenGroups.Other));
            }
        }
        if (tokens[tokensLength - 1].end < source.length) {
            tokens.push(new parserToken(tokens[tokensLength - 1].end, source.length - tokens[tokensLength - 1].end, parserTokenGroups.Other));
        }
    }
    /**
     * Set Groups, Types and Block markers: Brackets, Braces and parenthesis levels are set. Set on the Block Token and all Tekens between the start and end Block Token
     * @param {Token[]} tokens List of tokens
     * @param {string} source Source text being tokenised
     * @returns {Tokens[]} Tokenised representation of source string
     */
    populateTokenProperties(tokens, source) {
        tokens = tokens.sort((token1, token2) => token1.start - token2.start);
        let self = this,
            rxIdentifier = new RegExp(self.identifier, "gim"),
            selfWhitespace = self.whitespace,
            selfBlocks = self.blocks,
            selfOperators = self.operators,
            selfKeywords = self.keywords,
            parserToken = Mrbr.Utils.Parser.Token,
            parserTokenGroups = parserToken.Groups,
            brackets = 0,
            braces = 0,
            parens = 0;
        self.fillTokensGaps(tokens, source);
        tokens = tokens.sort((token1, token2) => token1.start - token2.start);
        tokens.forEach(token => {
            token.source = source;
            let tokenValue = token.value,
                tokenLevels = token.levels;
            switch (token.group) {
                case parserTokenGroups.Whitespace:
                    token.type = selfWhitespace[token.value];
                    break;
                case parserTokenGroups.Block:
                    token.type = selfBlocks[tokenValue];
                    if (tokenValue === "[") { brackets++; }
                    else if (tokenValue === "(") { parens++; }
                    else if (tokenValue === "{") { braces++; }
                    tokenLevels.brackets = brackets;
                    tokenLevels.braces = braces;
                    tokenLevels.parens = parens;
                    if (tokenValue === "}") { braces--; }
                    else if (tokenValue === ")") { parens--; }
                    else if (tokenValue === "]") { brackets--; }
                    break;
                case parserTokenGroups.Operator:
                    token.type = selfOperators[tokenValue];
                    break;
                case parserTokenGroups.Other:
                    if (selfKeywords.includes(tokenValue)) {
                        token.group = parserTokenGroups.Keyword;
                        token.type = tokenValue;
                    }
                    else {
                        let match;
                        rxIdentifier.lastIndex = 0;
                        if ((match = rxIdentifier.exec(tokenValue)) !== null && match[0].length > 0) {
                            token.group = parserTokenGroups.Other;
                            token.type = "identifier";
                        }
                    }
                    break;
            }
            if (token.group !== parserTokenGroups.Block) {
                tokenLevels.brackets = brackets;
                tokenLevels.braces = braces;
                tokenLevels.parens = parens;
            }
        });
        return tokens;
    }
    /**
     * 
     * @param {Object{position, types and RegExp result}[]} arrStarts Array of markers for start of candidate positions for Tokens 
     * @param {number} startSearch Start position for filtering out markers that have been passed
     * 
     * @returns {Object{position, types and RegExp result}[]} filtered array of markers, with discounted markers removed
     */
    resetTokenPoints(arrStarts, startSearch) {
        return arrStarts.filter(obj => obj.pos >= startSearch)
    }
    /**
     * Create a token for an in-line comment
     * @param {Object{position, types and RegExp result}} firstFound Marker identified as start of line comment
     * @param {string} source Source text being processed
     * 
     * @returns {Token} Tokenised in-line comment
     */
    tokeniseLineComment(firstFound, source) {
        let startSearch = firstFound.pos,
            idx = 0,
            tk = firstFound.tokenClass;
        idx = source.indexOf("\r\n", startSearch)
        if (idx > 0) { return new tk(startSearch, idx + 2 - startSearch, tk.Groups.Comment); }
        idx = source.indexOf("\n", startSearch);
        if (idx > 0) { return new tk(startSearch, idx + 1 - startSearch, tk.Groups.Comment); }
        return new tk(startSearch, source.length - startSearch, tk.Groups.Comment)
    }
    /**
     * 
     * @param {Object{position, types and RegExp result}} firstFound Marker identified as start of block comment
     * @param {string} source source text being tokenised
     * @param {Object{position, types and RegExp result}} arrStarts list of Markers to find end of block marker
     * 
     * @returns {Token} Tokenised block comment
     */
    tokeniseBlockComment(firstFound, source, arrStarts) {
        let start = firstFound.pos,
            end = source.length;
        for (let arrCounter = 1, arrCount = arrStarts.length; arrCounter < arrCount; arrCounter++) {
            let endBlockComment = arrStarts[arrCounter];
            if (endBlockComment.rxResult[0] == "*/") {
                end = endBlockComment.pos + endBlockComment.rxResult[0].length - start;
                break;
            }
        }
        return new firstFound.tokenClass(start, end, firstFound.tokenClass.Groups.Comment, "block");
    }
    /**
     * 
     * @param {Object{position, types and RegExp result}} firstFound Marker identified as start of block comment
     * @param {string} source Source text being tokenised
     * 
     * @returns {Token} Tokenised quoted text
     */
    tokeniseQuotes(firstFound, source) {
        let startSearch = firstFound.pos,
            searching = true,
            findChars = firstFound.key;
        startSearch++;
        while (searching) {
            let chr = source.substr(startSearch, 1);
            if (chr === "\\") {
                startSearch += 2;
                continue;
            }
            else if (findChars === chr || startSearch > source.length) {
                searching = false;
                break;
            }
            else {
                startSearch++;
                continue;
            }
        }
        return new firstFound.tokenClass(firstFound.pos, startSearch - firstFound.pos + findChars.length, firstFound.tokenClass.Groups.Quotes);
    }
}
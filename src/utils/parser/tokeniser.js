/**
 * Tokeniser for Javascript files
*/
class {
    static get using() { return ["Mrbr.Utils.Parser.Token"]; }
    constructor(types) {
        let self = this; //types
        self.types = JSON.parse(types)
        //console.log(types)
        //self.tokens = [];
        self.initialBlocks = self.types.initialBlocks;
        self.whitespace = self.types.whitespace;
        self.keywords = self.types.keywords;
        self.objectMethods = self.types.objectMethods;
        self.operators = self.types.operators;
        self.blocks = self.types.blocks;
        self.identifier = self.types.identifier;
        let parserToken = Mrbr.Utils.Parser.Token,
            parserTokenGroups = parserToken.Groups;
        self.markerRegexes = self.types.markerRegexes.map(element => {
            return { group: parserTokenGroups[element.group], name: element.name, rx: new RegExp(element.rx, element.flags) }
        })
    }
    /**
     * 
     * @param {string} source Source text to be Tokenised
     */
    tokenise(source) {        
        const self = this,
            selfTokeniseQuotes = self.tokeniseQuotes,
            selfTokeniseBlockComment = self.tokeniseBlockComment,
            selfTokeniseLineComment = self.tokeniseLineComment,
            selfResetTokenPoints = self.resetTokenPoints,
            sourceLength = source.length,
            parserToken = Mrbr.Utils.Parser.Token,
            parserTokenGroups = parserToken.Groups,
            markerRegexes = self.markerRegexes
        // markerRegexes = [
        //     { group: parserTokenGroups.Whitespace, name: "whitespace", rx: /( |\t|\f|\r|\n)\1*/g },
        //     { group: parserTokenGroups.Quote, name: "quotes", rx: /("|'|`)+/g },
        //     { group: parserTokenGroups.Comment, name: "comments", rx: /([/]{2}|[/]\*|\*\/)/g },
        //     //{ group: parserTokenGroups.Number, name: "exponent", rx: /(\b[0-9]+[.][0-9]e[0-9]+\b|\b[0-9]e[0-9]+\b)/ig },
        //     //{ group: parserTokenGroups.Number, name: "hex", rx: /(\b0x[0-9a-f]+\b)/ig },
        //     //{ group: parserTokenGroups.Number, name: "octal", rx: /(\b0o{0,1}[0-7]+\b)/ig },
        //     //{ group: parserTokenGroups.Number, name: "binary", rx: /(\b0b{1}[0-1]+\b)/ig },
        //     //{ group: parserTokenGroups.Number, name: "float", rx: /(\b[0-9]+\.[0-9]+\b)/g },
        //     //{ group: parserTokenGroups.Number, name: "integer", rx: /(\b[0-9]+\b)/g },
        //     //{ group: parserTokenGroups.Number, name: "infinity", rx: /(\bInfinity\b)/g },
        //     //{ group: parserTokenGroups.Number, name: "NaN", rx: /(\bNaN\b)/g },
        //     { group: parserTokenGroups.Whitespace, name: "crlf", rx: /(\r\n)\1*/g },
        //     { group: parserTokenGroups.Block, name: "blocks", rx: /([{}[\]()]{1})/g },
        //     { group: parserTokenGroups.Operator, name: "operators", rx: /(;|,|=|\/|\.)/g }
        //     //{ group: parserTokenGroups.Operator, name: "operators", rx: /(>>>=|>>=|<<=|===|!==|[.]{3}|>{3}|<<|!=|<=|>>|>=|[+]{2}|--|==|=>|[|]=|\^=|&=|\+=|-=|\*=|\/=|%=|\|\||&&|;|,|\?|:|\^|&|=|<|>|\+|-|\*|\/|%|!|~|\.)/g }
        //     //{ group: parserTokenGroups.Operator, name: "operators", rx: /(,|:|=|\.)/g }
        // ];
        let startMarker = 0,
            markerStartPoints = [],
            currentMarker;
        // loop through all tokens regular expressions and create initial marker points
        for (let markerRegexesCounter = 0, markerRegexesCount = markerRegexes.length, markerRegex, match, pos; markerRegexesCounter < markerRegexesCount; markerRegexesCounter++) {
            markerRegex = markerRegexes[markerRegexesCounter]
            markerRegex.rx.lastIndex = 0;
            while ((match = markerRegex.rx.exec(source)) !== null) {
                if (match.index === markerRegex.rx.lastIndex) {
                    markerRegex.rx.lastIndex++;
                }
                if (match.index >= 0) {
                    pos = match.index;
                    markerStartPoints.push({ key: match[0], pos: pos, sort: pos * sourceLength - match[0].length, type: "rx", rxResult: match, rxGroupName: markerRegex.group, rxTypeName: markerRegex.name, lastIndex: markerRegex.rx.lastIndex, tokenClass: parserToken })
                }
            }
        };
        markerStartPoints = markerStartPoints.sort((marker1, marker2) => (marker1.sort - marker2.sort)); //  sort by sort property. Sort property is marker position * source text length - marker length.
        //  Causes longer token to be processed first >>>= before >>= before >=
        //  Shorter tokens are deleted before the next cycle as they share a start point and this has been passed
        currentMarker = markerStartPoints[startMarker];
        // cycle through initial markers, but only work on the first one
        let tokenCounter = 0,
            tokens = [markerStartPoints.length];
        while (startMarker >= 0) {
            switch (currentMarker.key) {
                case '"': case "'": case "`":
                    tokens[tokenCounter] = selfTokeniseQuotes(currentMarker, source, tokens);
                    break;
                case "/*":
                    tokens[tokenCounter] = selfTokeniseBlockComment(currentMarker, markerStartPoints, startMarker);
                    break;
                case "//":
                    tokens[tokenCounter] = selfTokeniseLineComment(currentMarker, markerStartPoints, startMarker);
                    break;
                default:    //  Tokenising markers that do not require addition processing, e.g. Operators and Numbers
                    tokens[tokenCounter] = new currentMarker.tokenClass(currentMarker.rxResult.index, currentMarker.rxResult[0].length, currentMarker.rxGroupName, currentMarker.rxTypeName);
                    break;
            };
            tokenCounter++;
            // filter initial marker points to remove points that need to be bypassed, e.g. whitespace in a text block
            startMarker = selfResetTokenPoints(markerStartPoints, tokens[tokens.length - 1].end, startMarker);
            currentMarker = markerStartPoints[startMarker];
        }
        //  populate token, groups, types and level
        return self.populateTokenProperties(tokens.slice(1, tokenCounter), source);
    }
    /**
     * Fill gaps in tokens.
     * Sorts existing tokens, finds where tokens have not been created, as their structure is less certain, Key words and identifiers, and creates new Token
     * @param {Token[]} tokens List of tokens
     * @param {string} source Source text being tokenised
     */
    fillTokensGaps(tokens, source) {
        const tokensLength = tokens.length,
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
        const self = this,
            rxIdentifier = new RegExp(self.identifier, "gim"),
            selfWhitespace = self.whitespace,
            selfBlocks = self.blocks,
            selfOperators = self.operators,
            selfKeywords = self.keywords,
            parserToken = Mrbr.Utils.Parser.Token,
            parserTokenGroups = parserToken.Groups;
        let brackets = 0,
            braces = 0,
            parens = 0;
        tokens = tokens.tokenSort();
        self.fillTokensGaps(tokens, source);
        tokens = tokens.tokenSort();
        for (let tokenCounter = 0, tokenCount = tokens.length, token; tokenCounter < tokenCount; tokenCounter++) {
            token = tokens[tokenCounter];
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
        };
        return tokens;
    }
    /**
     * 
     * @param {Object{position, types and RegExp result}[]} markerStartPoints Array of markers for start of candidate positions for Tokens 
     * @param {number} startSearch Start position for filtering out markers that have been passed
     * 
     * @returns {Object{position, types and RegExp result}[]} filtered array of markers, with discounted markers removed
     */
    resetTokenPoints(markerStartPoints, startSearch, lastMarker) {
        let retValMarker = -1,
            markerCounter = lastMarker;
        for (; markerCounter < markerStartPoints.length; markerCounter++) {
            if (markerStartPoints[markerCounter].pos >= startSearch) {
                retValMarker = markerCounter;
                break;
            }
        }
        if (markerCounter >= markerStartPoints.length) { return retValMarker; }
        startSearch = markerStartPoints[markerCounter].pos
        for (; markerCounter < markerStartPoints.length; markerCounter++) {
            if (markerStartPoints[markerCounter].pos === startSearch) {
                retValMarker = markerCounter;
            }
            else {
                break;
            }
        }
        return retValMarker;
    }
    /**
     * Create a token for an in-line comment
     * @param {Object{position, types and RegExp result}} currentMarker Marker identified as start of line comment
     * @param {string} source Source text being processed
     * 
     * @returns {Token} Tokenised in-line comment
     */
    tokeniseLineComment(currentMarker, source, markerStartPoints, startMarker) {
        let end = source.length;
        for (let arrCounter = startMarker + 1, arrCount = markerStartPoints.length; arrCounter < arrCount; arrCounter++) {
            let inlineComment = markerStartPoints[arrCounter],
                inlineCommentRxResult = inlineComment.rxResult[0]
            if (inlineCommentRxResult === "\r\n" || inlineCommentRxResult === "\n") {
                end = inlineComment.pos + inlineComment.rxResult[0].length - start;
                break;
            }
        }
        return new currentMarker.tokenClass(start, end, currentMarker.tokenClass.Groups.Comment, "in-line");
    }
    /**
     * 
     * @param {Object{position, types and RegExp result}} currentMarker Marker identified as start of block comment
     * @param {string} source source text being tokenised
     * @param {Object{position, types and RegExp result}} markerStartPoints list of Markers to find end of block marker
     * 
     * @returns {Token} Tokenised block comment
     */
    tokeniseBlockComment(currentMarker, source, markerStartPoints, startMarker) {
        const start = currentMarker.pos;
        let end = source.length;
        for (let arrCounter = startMarker + 1, arrCount = markerStartPoints.length; arrCounter < arrCount; arrCounter++) {
            let endBlockComment = markerStartPoints[arrCounter],
                endBlockCommentrxResult = endBlockComment.rxResult[0];
            if (endBlockCommentrxResult === "*/") {
                end = endBlockComment.pos + endBlockCommentrxResult.length - start;
                break;
            }
        }
        return new currentMarker.tokenClass(start, end, currentMarker.tokenClass.Groups.Comment, "block");
    }
    /**
     * 
     * @param {Object{position, types and RegExp result}} currentMarker Marker identified as start of block comment
     * @param {string} source Source text being tokenised
     * 
     * @returns {Token} Tokenised quoted text
     */
    tokeniseQuotes(currentMarker, source) {
        const findChars = currentMarker.key;
        let startSearch = currentMarker.pos,
            searching = true;
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
        return new currentMarker.tokenClass(currentMarker.pos, startSearch - currentMarker.pos + findChars.length, currentMarker.tokenClass.Groups.Quotes);
    }
}

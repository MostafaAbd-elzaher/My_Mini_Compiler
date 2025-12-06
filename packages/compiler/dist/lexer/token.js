"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEYWORDS = exports.TokenType = void 0;
exports.lookupIdent = lookupIdent;
var TokenType;
(function (TokenType) {
    // Keywords
    TokenType["INT"] = "Keyword INT";
    TokenType["BOOL"] = "Keyword BOOL";
    TokenType["STRING"] = "Keyword STRING";
    TokenType["IF"] = "Keyword IF";
    TokenType["ELSE"] = "Keyword ELSE";
    TokenType["WHILE"] = "Keyword WHILE";
    TokenType["TRUE"] = "Keyword TRUE";
    TokenType["FALSE"] = "Keyword FALSE";
    TokenType["CONSOLE"] = "Keyword CONSOLE";
    TokenType["WRITELINE"] = "Keyword WRITELINE";
    // Identifiers and Literals
    TokenType["IDENTIFIER"] = "IDENTIFIER";
    TokenType["INTEGER_LITERAL"] = "INTEGER_LITERAL";
    TokenType["STRING_LITERAL"] = "STRING_LITERAL";
    // Operators
    TokenType["PLUS"] = "PLUS";
    TokenType["MINUS"] = "MINUS";
    TokenType["ASTERISK"] = "ASTERISK";
    TokenType["SLASH"] = "SLASH";
    TokenType["ASSIGN"] = "ASSIGN";
    TokenType["EQ"] = "EQ";
    TokenType["NEQ"] = "NEQ";
    TokenType["LT"] = "LT";
    TokenType["GT"] = "GT";
    TokenType["LTE"] = "LTE";
    TokenType["GTE"] = "GTE";
    TokenType["AND"] = "AND";
    TokenType["OR"] = "OR";
    TokenType["NOT"] = "NOT";
    TokenType["DOT"] = "DOT";
    // Delimiters
    TokenType["LPAREN"] = "LPAREN";
    TokenType["RPAREN"] = "RPAREN";
    TokenType["LBRACE"] = "LBRACE";
    TokenType["RBRACE"] = "RBRACE";
    TokenType["SEMICOLON"] = "SEMICOLON";
    // End of File
    TokenType["EOF"] = "EOF";
    // Error
    TokenType["ILLEGAL"] = "ILLEGAL";
})(TokenType || (exports.TokenType = TokenType = {}));
exports.KEYWORDS = {
    int: TokenType.INT,
    bool: TokenType.BOOL,
    string: TokenType.STRING,
    if: TokenType.IF,
    else: TokenType.ELSE,
    while: TokenType.WHILE,
    true: TokenType.TRUE,
    false: TokenType.FALSE,
    Console: TokenType.CONSOLE,
    WriteLine: TokenType.WRITELINE,
};
function lookupIdent(ident) {
    return exports.KEYWORDS[ident] || TokenType.IDENTIFIER;
}

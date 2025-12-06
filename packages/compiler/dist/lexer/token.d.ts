export declare enum TokenType {
    INT = "Keyword INT",
    BOOL = "Keyword BOOL",
    STRING = "Keyword STRING",
    IF = "Keyword IF",
    ELSE = "Keyword ELSE",
    WHILE = "Keyword WHILE",
    TRUE = "Keyword TRUE",
    FALSE = "Keyword FALSE",
    CONSOLE = "Keyword CONSOLE",// For Console.WriteLine
    WRITELINE = "Keyword WRITELINE",// For Console.WriteLine
    IDENTIFIER = "IDENTIFIER",
    INTEGER_LITERAL = "INTEGER_LITERAL",
    STRING_LITERAL = "STRING_LITERAL",
    PLUS = "PLUS",// +
    MINUS = "MINUS",// -
    ASTERISK = "ASTERISK",// *
    SLASH = "SLASH",// /
    ASSIGN = "ASSIGN",// =
    EQ = "EQ",// ==
    NEQ = "NEQ",// !=
    LT = "LT",// <
    GT = "GT",// >
    LTE = "LTE",// <=
    GTE = "GTE",// >=
    AND = "AND",// &&
    OR = "OR",// ||
    NOT = "NOT",// !
    DOT = "DOT",// .
    LPAREN = "LPAREN",// (
    RPAREN = "RPAREN",// )
    LBRACE = "LBRACE",// {
    RBRACE = "RBRACE",// }
    SEMICOLON = "SEMICOLON",// ;
    EOF = "EOF",
    ILLEGAL = "ILLEGAL"
}
export interface Token {
    type: TokenType;
    literal: string;
    line: number;
    column: number;
}
export declare const KEYWORDS: Record<string, TokenType>;
export declare function lookupIdent(ident: string): TokenType;

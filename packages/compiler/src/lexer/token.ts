export enum TokenType {
    // Keywords
    INT = 'Keyword INT',
    BOOL = 'Keyword BOOL',
    STRING = 'Keyword STRING',
    IF = 'Keyword IF',
    ELSE = 'Keyword ELSE',
    WHILE = 'Keyword WHILE',
    TRUE = 'Keyword TRUE',
    FALSE = 'Keyword FALSE',
    CONSOLE = 'Keyword CONSOLE', // For Console.WriteLine
    WRITELINE = 'Keyword WRITELINE', // For Console.WriteLine

    // Identifiers and Literals
    IDENTIFIER = 'IDENTIFIER',
    INTEGER_LITERAL = 'INTEGER_LITERAL',
    STRING_LITERAL = 'STRING_LITERAL',

    // Operators
    PLUS = 'PLUS',          // +
    MINUS = 'MINUS',        // -
    ASTERISK = 'ASTERISK',  // *
    SLASH = 'SLASH',        // /
    ASSIGN = 'ASSIGN',      // =
    EQ = 'EQ',              // ==
    NEQ = 'NEQ',            // !=
    LT = 'LT',              // <
    GT = 'GT',              // >
    LTE = 'LTE',            // <=
    GTE = 'GTE',            // >=
    AND = 'AND',            // &&
    OR = 'OR',              // ||
    NOT = 'NOT',            // !
    DOT = 'DOT',            // .

    // Delimiters
    LPAREN = 'LPAREN',      // (
    RPAREN = 'RPAREN',      // )
    LBRACE = 'LBRACE',      // {
    RBRACE = 'RBRACE',      // }
    SEMICOLON = 'SEMICOLON',// ;

    // End of File
    EOF = 'EOF',

    // Error
    ILLEGAL = 'ILLEGAL'
}

export interface Token {
    type: TokenType;
    literal: string;
    line: number;
    column: number;
}

export const KEYWORDS: Record<string, TokenType> = {
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

export function lookupIdent(ident: string): TokenType {
    return KEYWORDS[ident] || TokenType.IDENTIFIER;
}

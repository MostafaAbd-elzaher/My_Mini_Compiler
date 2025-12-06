import { Token } from './token';
export declare class Lexer {
    private input;
    private position;
    private readPosition;
    private ch;
    private line;
    private column;
    constructor(input: string);
    nextToken(): Token;
    private readChar;
    private peekChar;
    private newToken;
    private readIdentifier;
    private readNumber;
    private readString;
    private isLetter;
    private isDigit;
    private skipWhitespace;
    private skipComment;
}

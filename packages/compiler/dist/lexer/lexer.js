"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
const token_1 = require("./token");
class Lexer {
    constructor(input) {
        this.position = 0;
        this.readPosition = 0;
        this.ch = '';
        this.line = 1;
        this.column = 0;
        this.input = input;
        this.readChar();
    }
    nextToken() {
        this.skipWhitespace();
        let token;
        const startColumn = this.column;
        switch (this.ch) {
            case '=':
                if (this.peekChar() === '=') {
                    const ch = this.ch;
                    this.readChar();
                    token = this.newToken(token_1.TokenType.EQ, ch + this.ch, startColumn);
                }
                else {
                    token = this.newToken(token_1.TokenType.ASSIGN, this.ch, startColumn);
                }
                break;
            case '!':
                if (this.peekChar() === '=') {
                    const ch = this.ch;
                    this.readChar();
                    token = this.newToken(token_1.TokenType.NEQ, ch + this.ch, startColumn);
                }
                else {
                    token = this.newToken(token_1.TokenType.NOT, this.ch, startColumn);
                }
                break;
            case '&':
                if (this.peekChar() === '&') {
                    const ch = this.ch;
                    this.readChar();
                    token = this.newToken(token_1.TokenType.AND, ch + this.ch, startColumn);
                }
                else {
                    token = this.newToken(token_1.TokenType.ILLEGAL, this.ch, startColumn);
                }
                break;
            case '|':
                if (this.peekChar() === '|') {
                    const ch = this.ch;
                    this.readChar();
                    token = this.newToken(token_1.TokenType.OR, ch + this.ch, startColumn);
                }
                else {
                    token = this.newToken(token_1.TokenType.ILLEGAL, this.ch, startColumn);
                }
                break;
            case '+':
                token = this.newToken(token_1.TokenType.PLUS, this.ch, startColumn);
                break;
            case '-':
                token = this.newToken(token_1.TokenType.MINUS, this.ch, startColumn);
                break;
            case '*':
                token = this.newToken(token_1.TokenType.ASTERISK, this.ch, startColumn);
                break;
            case '/':
                if (this.peekChar() === '/') {
                    this.skipComment();
                    return this.nextToken();
                }
                else {
                    token = this.newToken(token_1.TokenType.SLASH, this.ch, startColumn);
                }
                break;
            case '<':
                if (this.peekChar() === '=') {
                    const ch = this.ch;
                    this.readChar();
                    token = this.newToken(token_1.TokenType.LTE, ch + this.ch, startColumn);
                }
                else {
                    token = this.newToken(token_1.TokenType.LT, this.ch, startColumn);
                }
                break;
            case '>':
                if (this.peekChar() === '=') {
                    const ch = this.ch;
                    this.readChar();
                    token = this.newToken(token_1.TokenType.GTE, ch + this.ch, startColumn);
                }
                else {
                    token = this.newToken(token_1.TokenType.GT, this.ch, startColumn);
                }
                break;
            case ';':
                token = this.newToken(token_1.TokenType.SEMICOLON, this.ch, startColumn);
                break;
            case '.':
                token = this.newToken(token_1.TokenType.DOT, this.ch, startColumn);
                break;
            case '(':
                token = this.newToken(token_1.TokenType.LPAREN, this.ch, startColumn);
                break;
            case ')':
                token = this.newToken(token_1.TokenType.RPAREN, this.ch, startColumn);
                break;
            case '{':
                token = this.newToken(token_1.TokenType.LBRACE, this.ch, startColumn);
                break;
            case '}':
                token = this.newToken(token_1.TokenType.RBRACE, this.ch, startColumn);
                break;
            case '"':
                token = this.newToken(token_1.TokenType.STRING_LITERAL, this.readString(), startColumn);
                break;
            case '\0':
                token = this.newToken(token_1.TokenType.EOF, '', startColumn);
                break;
            default:
                if (this.isLetter(this.ch)) {
                    const literal = this.readIdentifier();
                    const type = (0, token_1.lookupIdent)(literal);
                    return { type, literal, line: this.line, column: startColumn };
                }
                else if (this.isDigit(this.ch)) {
                    const literal = this.readNumber();
                    return { type: token_1.TokenType.INTEGER_LITERAL, literal, line: this.line, column: startColumn };
                }
                else {
                    token = this.newToken(token_1.TokenType.ILLEGAL, this.ch, startColumn);
                }
        }
        this.readChar();
        return token;
    }
    readChar() {
        if (this.readPosition >= this.input.length) {
            this.ch = '\0';
        }
        else {
            this.ch = this.input[this.readPosition];
        }
        this.position = this.readPosition;
        this.readPosition += 1;
        this.column += 1;
    }
    peekChar() {
        if (this.readPosition >= this.input.length) {
            return '\0';
        }
        return this.input[this.readPosition];
    }
    newToken(type, literal, column) {
        return { type, literal, line: this.line, column };
    }
    readIdentifier() {
        const position = this.position;
        while (this.isLetter(this.ch) || this.isDigit(this.ch)) {
            this.readChar();
        }
        return this.input.substring(position, this.position);
    }
    readNumber() {
        const position = this.position;
        while (this.isDigit(this.ch)) {
            this.readChar();
        }
        return this.input.substring(position, this.position);
    }
    readString() {
        const position = this.position + 1;
        while (true) {
            this.readChar();
            if (this.ch === '"' || this.ch === '\0') {
                break;
            }
        }
        return this.input.substring(position, this.position);
    }
    isLetter(ch) {
        return ('a' <= ch && ch <= 'z') || ('A' <= ch && ch <= 'Z') || ch === '_';
    }
    isDigit(ch) {
        return '0' <= ch && ch <= '9';
    }
    skipWhitespace() {
        while (this.ch === ' ' || this.ch === '\t' || this.ch === '\n' || this.ch === '\r') {
            if (this.ch === '\n') {
                this.line += 1;
                this.column = 0;
            }
            this.readChar();
        }
    }
    skipComment() {
        while (this.ch !== '\n' && this.ch !== '\0') {
            this.readChar();
        }
        this.skipWhitespace();
    }
}
exports.Lexer = Lexer;

import { Token, TokenType, lookupIdent } from './token';

export class Lexer {
    private input: string;
    private position: number = 0;
    private readPosition: number = 0;
    private ch: string = '';
    private line: number = 1;
    private column: number = 0;

    constructor(input: string) {
        this.input = input;
        this.readChar();
    }

    public nextToken(): Token {
        this.skipWhitespace();

        let token: Token;
        const startColumn = this.column;

        switch (this.ch) {
            case '=':
                if (this.peekChar() === '=') {
                    const ch = this.ch;
                    this.readChar();
                    token = this.newToken(TokenType.EQ, ch + this.ch, startColumn);
                } else {
                    token = this.newToken(TokenType.ASSIGN, this.ch, startColumn);
                }
                break;
            case '!':
                if (this.peekChar() === '=') {
                    const ch = this.ch;
                    this.readChar();
                    token = this.newToken(TokenType.NEQ, ch + this.ch, startColumn);
                } else {
                    token = this.newToken(TokenType.NOT, this.ch, startColumn);
                }
                break;
            case '&':
                if (this.peekChar() === '&') {
                    const ch = this.ch;
                    this.readChar();
                    token = this.newToken(TokenType.AND, ch + this.ch, startColumn);
                } else {
                    token = this.newToken(TokenType.ILLEGAL, this.ch, startColumn);
                }
                break;
            case '|':
                if (this.peekChar() === '|') {
                    const ch = this.ch;
                    this.readChar();
                    token = this.newToken(TokenType.OR, ch + this.ch, startColumn);
                } else {
                    token = this.newToken(TokenType.ILLEGAL, this.ch, startColumn);
                }
                break;
            case '+':
                token = this.newToken(TokenType.PLUS, this.ch, startColumn);
                break;
            case '-':
                token = this.newToken(TokenType.MINUS, this.ch, startColumn);
                break;
            case '*':
                token = this.newToken(TokenType.ASTERISK, this.ch, startColumn);
                break;
            case '/':
                if (this.peekChar() === '/') {
                    this.skipComment();
                    return this.nextToken();
                } else {
                    token = this.newToken(TokenType.SLASH, this.ch, startColumn);
                }
                break;
            case '<':
                if (this.peekChar() === '=') {
                    const ch = this.ch;
                    this.readChar();
                    token = this.newToken(TokenType.LTE, ch + this.ch, startColumn);
                } else {
                    token = this.newToken(TokenType.LT, this.ch, startColumn);
                }
                break;
            case '>':
                if (this.peekChar() === '=') {
                    const ch = this.ch;
                    this.readChar();
                    token = this.newToken(TokenType.GTE, ch + this.ch, startColumn);
                } else {
                    token = this.newToken(TokenType.GT, this.ch, startColumn);
                }
                break;
            case ';':
                token = this.newToken(TokenType.SEMICOLON, this.ch, startColumn);
                break;
            case '.':
                token = this.newToken(TokenType.DOT, this.ch, startColumn);
                break;
            case '(':
                token = this.newToken(TokenType.LPAREN, this.ch, startColumn);
                break;
            case ')':
                token = this.newToken(TokenType.RPAREN, this.ch, startColumn);
                break;
            case '{':
                token = this.newToken(TokenType.LBRACE, this.ch, startColumn);
                break;
            case '}':
                token = this.newToken(TokenType.RBRACE, this.ch, startColumn);
                break;
            case '"':
                token = this.newToken(TokenType.STRING_LITERAL, this.readString(), startColumn);
                break;
            case '\0':
                token = this.newToken(TokenType.EOF, '', startColumn);
                break;
            default:
                if (this.isLetter(this.ch)) {
                    const literal = this.readIdentifier();
                    const type = lookupIdent(literal);
                    return { type, literal, line: this.line, column: startColumn };
                } else if (this.isDigit(this.ch)) {
                    const literal = this.readNumber();
                    return { type: TokenType.INTEGER_LITERAL, literal, line: this.line, column: startColumn };
                } else {
                    token = this.newToken(TokenType.ILLEGAL, this.ch, startColumn);
                }
        }

        this.readChar();
        return token;
    }

    private readChar() {
        if (this.readPosition >= this.input.length) {
            this.ch = '\0';
        } else {
            this.ch = this.input[this.readPosition];
        }
        this.position = this.readPosition;
        this.readPosition += 1;
        this.column += 1;
    }

    private peekChar(): string {
        if (this.readPosition >= this.input.length) {
            return '\0';
        }
        return this.input[this.readPosition];
    }

    private newToken(type: TokenType, literal: string, column: number): Token {
        return { type, literal, line: this.line, column };
    }

    private readIdentifier(): string {
        const position = this.position;
        while (this.isLetter(this.ch) || this.isDigit(this.ch)) {
            this.readChar();
        }
        return this.input.substring(position, this.position);
    }

    private readNumber(): string {
        const position = this.position;
        while (this.isDigit(this.ch)) {
            this.readChar();
        }
        return this.input.substring(position, this.position);
    }

    private readString(): string {
        const position = this.position + 1;
        while (true) {
            this.readChar();
            if (this.ch === '"' || this.ch === '\0') {
                break;
            }
        }
        return this.input.substring(position, this.position);
    }

    private isLetter(ch: string): boolean {
        return ('a' <= ch && ch <= 'z') || ('A' <= ch && ch <= 'Z') || ch === '_';
    }

    private isDigit(ch: string): boolean {
        return '0' <= ch && ch <= '9';
    }

    private skipWhitespace() {
        while (this.ch === ' ' || this.ch === '\t' || this.ch === '\n' || this.ch === '\r') {
            if (this.ch === '\n') {
                this.line += 1;
                this.column = 0;
            }
            this.readChar();
        }
    }

    private skipComment() {
        while (this.ch !== '\n' && this.ch !== '\0') {
            this.readChar();
        }
        this.skipWhitespace();
    }
}

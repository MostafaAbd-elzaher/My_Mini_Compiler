import { Lexer } from './lexer';
import { TokenType } from './token';

describe('Lexer', () => {
    test('Basic Variable Declaration', () => {
        const input = 'int x = 5;';
        const lexer = new Lexer(input);

        const tests = [
            { type: TokenType.INT, literal: 'int' },
            { type: TokenType.IDENTIFIER, literal: 'x' },
            { type: TokenType.ASSIGN, literal: '=' },
            { type: TokenType.INTEGER_LITERAL, literal: '5' },
            { type: TokenType.SEMICOLON, literal: ';' },
            { type: TokenType.EOF, literal: '' },
        ];

        tests.forEach((tt) => {
            const token = lexer.nextToken();
            expect(token.type).toBe(tt.type);
            expect(token.literal).toBe(tt.literal);
        });
    });

    test('All Keywords', () => {
        const input = 'int bool string if else while true false Console WriteLine';
        const lexer = new Lexer(input);

        const expectedTypes = [
            TokenType.INT,
            TokenType.BOOL,
            TokenType.STRING,
            TokenType.IF,
            TokenType.ELSE,
            TokenType.WHILE,
            TokenType.TRUE,
            TokenType.FALSE,
            TokenType.CONSOLE,
            TokenType.WRITELINE,
        ];

        expectedTypes.forEach((expectedType) => {
            const token = lexer.nextToken();
            expect(token.type).toBe(expectedType);
        });
    });

    test('Arithmetic Operators', () => {
        const input = '+ - * /';
        const lexer = new Lexer(input);

        const expectedTypes = [
            TokenType.PLUS,
            TokenType.MINUS,
            TokenType.ASTERISK,
            TokenType.SLASH,
        ];

        expectedTypes.forEach((expectedType) => {
            const token = lexer.nextToken();
            expect(token.type).toBe(expectedType);
        });
    });

    test('Comparison Operators', () => {
        const input = '< > <= >= == !=';
        const lexer = new Lexer(input);

        const expectedTypes = [
            TokenType.LT,
            TokenType.GT,
            TokenType.LTE,
            TokenType.GTE,
            TokenType.EQ,
            TokenType.NEQ,
        ];

        expectedTypes.forEach((expectedType) => {
            const token = lexer.nextToken();
            expect(token.type).toBe(expectedType);
        });
    });

    test('String Literals', () => {
        const input = '"hello" "world"';
        const lexer = new Lexer(input);

        const tokens = [
            { type: TokenType.STRING_LITERAL, literal: 'hello' },
            { type: TokenType.STRING_LITERAL, literal: 'world' },
        ];

        tokens.forEach((tt) => {
            const token = lexer.nextToken();
            expect(token.type).toBe(tt.type);
            expect(token.literal).toBe(tt.literal);
        });
    });

    test('Identifiers', () => {
        const input = 'x myVar _private variable123';
        const lexer = new Lexer(input);

        const identifiers = ['x', 'myVar', '_private', 'variable123'];
        identifiers.forEach((id) => {
            const token = lexer.nextToken();
            expect(token.type).toBe(TokenType.IDENTIFIER);
            expect(token.literal).toBe(id);
        });
    });

    test('Numbers', () => {
        const input = '0 1 10 100 999 123456789';
        const lexer = new Lexer(input);

        const numbers = ['0', '1', '10', '100', '999', '123456789'];
        numbers.forEach((num) => {
            const token = lexer.nextToken();
            expect(token.type).toBe(TokenType.INTEGER_LITERAL);
            expect(token.literal).toBe(num);
        });
    });

    test('Complex Program', () => {
        const input = `
      int x = 5;
      string s = "hello";
      if (x > 0) {
        Console.WriteLine(s);
      }
    `;

        const tests = [
            { type: TokenType.INT, literal: 'int' },
            { type: TokenType.IDENTIFIER, literal: 'x' },
            { type: TokenType.ASSIGN, literal: '=' },
            { type: TokenType.INTEGER_LITERAL, literal: '5' },
            { type: TokenType.SEMICOLON, literal: ';' },
            { type: TokenType.STRING, literal: 'string' },
            { type: TokenType.IDENTIFIER, literal: 's' },
            { type: TokenType.ASSIGN, literal: '=' },
            { type: TokenType.STRING_LITERAL, literal: 'hello' },
            { type: TokenType.SEMICOLON, literal: ';' },
            { type: TokenType.IF, literal: 'if' },
            { type: TokenType.LPAREN, literal: '(' },
            { type: TokenType.IDENTIFIER, literal: 'x' },
            { type: TokenType.GT, literal: '>' },
            { type: TokenType.INTEGER_LITERAL, literal: '0' },
            { type: TokenType.RPAREN, literal: ')' },
            { type: TokenType.LBRACE, literal: '{' },
            { type: TokenType.CONSOLE, literal: 'Console' },
            { type: TokenType.DOT, literal: '.' },
            { type: TokenType.WRITELINE, literal: 'WriteLine' },
            { type: TokenType.LPAREN, literal: '(' },
            { type: TokenType.IDENTIFIER, literal: 's' },
            { type: TokenType.RPAREN, literal: ')' },
            { type: TokenType.SEMICOLON, literal: ';' },
            { type: TokenType.RBRACE, literal: '}' },
        ];

        const lexer = new Lexer(input);

        tests.forEach((tt) => {
            const token = lexer.nextToken();
            expect(token.type).toBe(tt.type);
            expect(token.literal).toBe(tt.literal);
        });
    });

    test('Line Tracking', () => {
        const input = 'int x\nbool y';
        const lexer = new Lexer(input);

        const token1 = lexer.nextToken();
        expect(token1.line).toBe(1);

        const token2 = lexer.nextToken();
        expect(token2.line).toBe(1);

        const token3 = lexer.nextToken();
        expect(token3.line).toBe(2);
    });
});

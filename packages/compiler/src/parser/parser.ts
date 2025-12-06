import { Lexer } from '../lexer/lexer';
import { Token, TokenType } from '../lexer/token';
import * as AST from './ast';
import { ParseTreeNode, parseTreeToString, parseTreeToJSON } from './parseTree';

export class Parser {
    private l: Lexer;
    private curToken!: Token;
    private peekToken!: Token;
    private errors: string[] = [];

    constructor(l: Lexer) {
        this.l = l;
        this.nextToken();
        this.nextToken();
    }

    public getErrors(): string[] {
        return this.errors;
    }

    private nextToken() {
        this.curToken = this.peekToken;
        this.peekToken = this.l.nextToken();
    }

    private curTokenIs(t: TokenType): boolean {
        return this.curToken.type === t;
    }

    private peekTokenIs(t: TokenType): boolean {
        return this.peekToken.type === t;
    }

    private expectPeek(t: TokenType): boolean {
        if (this.peekTokenIs(t)) {
            this.nextToken();
            return true;
        } else {
            this.peekError(t);
            return false;
        }
    }

    private peekError(t: TokenType) {
        const msg = `expected next token to be ${t}, got ${this.peekToken.type} instead at line ${this.peekToken.line}, column ${this.peekToken.column}`;
        this.errors.push(msg);
    }

    private noPrefixParseFnError(t: TokenType) {
        const msg = `no prefix parse function for ${t} found at line ${this.curToken.line}, column ${this.curToken.column}`;
        this.errors.push(msg);
    }

    public parseProgram(): AST.Program {
        const program = new AST.Program();

        while (this.curToken.type !== TokenType.EOF) {
            const stmt = this.parseStatement();
            if (stmt) {
                program.statements.push(stmt);
            }
            this.nextToken();
        }

        return program;
    }

    /**
     * Get the parse tree from a program as a ParseTreeNode
     */
    public getParseTree(program: AST.Program): ParseTreeNode {
        return program.toParseTree();
    }

    /**
     * Get the parse tree as a formatted string for display
     */
    public getParseTreeString(program: AST.Program): string {
        const tree = program.toParseTree();
        return parseTreeToString(tree, '', true);
    }

    /**
     * Get the parse tree as a JSON object for visualization
     */
    public getParseTreeJSON(program: AST.Program): any {
        const tree = program.toParseTree();
        return parseTreeToJSON(tree);
    }

    private parseStatement(): AST.Statement | null {
        switch (this.curToken.type) {
            case TokenType.INT:
            case TokenType.BOOL:
            case TokenType.STRING:
                return this.parseVariableDeclaration();
            case TokenType.IF:
                return this.parseIfStatement();
            case TokenType.WHILE:
                return this.parseWhileStatement();
            case TokenType.CONSOLE:
                return this.parseConsoleWriteLine();
            case TokenType.LBRACE:
                return this.parseBlockStatement();
            case TokenType.IDENTIFIER:
                if (this.peekTokenIs(TokenType.ASSIGN)) {
                    return this.parseAssignmentStatement();
                }
                return this.parseExpressionStatement();
            default:
                return this.parseExpressionStatement();
        }
    }

    private parseVariableDeclaration(): AST.VariableDeclaration | null {
        const typeToken = this.curToken;
        const varType = typeToken.literal;

        if (!this.expectPeek(TokenType.IDENTIFIER)) {
            return null;
        }
        const name = new AST.Identifier(this.curToken, this.curToken.literal);

        let value: AST.Expression | undefined;

        if (this.peekTokenIs(TokenType.ASSIGN)) {
            this.nextToken(); // move to =
            this.nextToken(); // move to expression
            value = this.parseExpression(Precedence.LOWEST);
        }

        if (this.peekTokenIs(TokenType.SEMICOLON)) {
            this.nextToken();
        }

        return new AST.VariableDeclaration(typeToken, name, varType, value);
    }

    private parseConsoleWriteLine(): AST.ConsoleWriteLine | null {
        const token = this.curToken;
        if (!this.expectPeek(TokenType.DOT)) {
            return null;
        }
        if (!this.expectPeek(TokenType.WRITELINE)) {
            return null;
        }
        if (!this.expectPeek(TokenType.LPAREN)) {
            return null;
        }

        this.nextToken();
        const expression = this.parseExpression(Precedence.LOWEST);

        if (!this.expectPeek(TokenType.RPAREN)) {
            return null;
        }
        if (this.peekTokenIs(TokenType.SEMICOLON)) {
            this.nextToken();
        }

        return new AST.ConsoleWriteLine(token, expression);
    }

    private parseBlockStatement(): AST.BlockStatement {
        const block = new AST.BlockStatement(this.curToken, []);
        this.nextToken();

        while (!this.curTokenIs(TokenType.RBRACE) && !this.curTokenIs(TokenType.EOF)) {
            const stmt = this.parseStatement();
            if (stmt) {
                block.statements.push(stmt);
            }
            this.nextToken();
        }

        return block;
    }

    private parseAssignmentStatement(): AST.AssignmentStatement | null {
        const name = new AST.Identifier(this.curToken, this.curToken.literal);
        const token = this.curToken;

        this.nextToken(); // move to '='

        this.nextToken(); // move to expression
        const value = this.parseExpression(Precedence.LOWEST);

        if (this.peekTokenIs(TokenType.SEMICOLON)) {
            this.nextToken();
        }

        return new AST.AssignmentStatement(token, name, value);
    }

    private parseIfStatement(): AST.IfStatement | null {
        const token = this.curToken;
        if (!this.expectPeek(TokenType.LPAREN)) {
            return null;
        }
        this.nextToken();
        const condition = this.parseExpression(Precedence.LOWEST);

        if (!this.expectPeek(TokenType.RPAREN)) {
            return null;
        }

        if (!this.expectPeek(TokenType.LBRACE)) {
            return null;
        }

        const consequence = this.parseBlockStatement();
        let alternative: AST.BlockStatement | undefined;

        if (this.peekTokenIs(TokenType.ELSE)) {
            this.nextToken();
            if (!this.expectPeek(TokenType.LBRACE)) {
                return null;
            }
            alternative = this.parseBlockStatement();
        }

        return new AST.IfStatement(token, condition, consequence, alternative);
    }

    private parseWhileStatement(): AST.WhileStatement | null {
        const token = this.curToken;
        if (!this.expectPeek(TokenType.LPAREN)) {
            return null;
        }
        this.nextToken();
        const condition = this.parseExpression(Precedence.LOWEST);

        if (!this.expectPeek(TokenType.RPAREN)) {
            return null;
        }

        if (!this.expectPeek(TokenType.LBRACE)) {
            return null;
        }

        const body = this.parseBlockStatement();
        return new AST.WhileStatement(token, condition, body);
    }

    private parseExpressionStatement(): AST.ExpressionStatement {
        const token = this.curToken;
        const expression = this.parseExpression(Precedence.LOWEST);

        if (this.peekTokenIs(TokenType.SEMICOLON)) {
            this.nextToken();
        }

        return new AST.ExpressionStatement(token, expression);
    }

    private parseExpression(precedence: number): AST.Expression {
        const prefix = this.prefixParseFns[this.curToken.type];
        if (!prefix) {
            this.noPrefixParseFnError(this.curToken.type);
            return new AST.Identifier(this.curToken, "");
        }
        let leftExp = prefix.call(this);

        while (!this.peekTokenIs(TokenType.SEMICOLON) && precedence < this.peekPrecedence()) {
            const infix = this.infixParseFns[this.peekToken.type];
            if (!infix) {
                return leftExp;
            }

            this.nextToken();
            leftExp = infix.call(this, leftExp);
        }

        return leftExp;
    }

    private parseIdentifier(): AST.Expression {
        return new AST.Identifier(this.curToken, this.curToken.literal);
    }

    private parseIntegerLiteral(): AST.Expression {
        const value = parseInt(this.curToken.literal, 10);
        return new AST.IntegerLiteral(this.curToken, value);
    }

    private parseBooleanLiteral(): AST.Expression {
        return new AST.BooleanLiteral(this.curToken, this.curToken.type === TokenType.TRUE);
    }

    private parseStringLiteral(): AST.Expression {
        return new AST.StringLiteral(this.curToken, this.curToken.literal);
    }

    private parsePrefixExpression(): AST.Expression {
        const token = this.curToken;
        const operator = this.curToken.literal;
        this.nextToken();
        const right = this.parseExpression(Precedence.PREFIX);
        return new AST.PrefixExpression(token, operator, right);
    }

    private parseInfixExpression(left: AST.Expression): AST.Expression {
        const token = this.curToken;
        const operator = this.curToken.literal;
        const precedence = this.curPrecedence();
        this.nextToken();
        const right = this.parseExpression(precedence);
        return new AST.InfixExpression(token, left, operator, right);
    }

    private parseGroupedExpression(): AST.Expression {
        this.nextToken();
        const exp = this.parseExpression(Precedence.LOWEST);
        if (!this.expectPeek(TokenType.RPAREN)) {
            return exp;
        }
        return exp;
    }

    private peekPrecedence(): number {
        return PRECEDENCES[this.peekToken.type] || Precedence.LOWEST;
    }

    private curPrecedence(): number {
        return PRECEDENCES[this.curToken.type] || Precedence.LOWEST;
    }

    private prefixParseFns: { [key: string]: () => AST.Expression } = {
        [TokenType.IDENTIFIER]: this.parseIdentifier.bind(this),
        [TokenType.INTEGER_LITERAL]: this.parseIntegerLiteral.bind(this),
        [TokenType.STRING_LITERAL]: this.parseStringLiteral.bind(this),
        [TokenType.TRUE]: this.parseBooleanLiteral.bind(this),
        [TokenType.FALSE]: this.parseBooleanLiteral.bind(this),
        [TokenType.NOT]: this.parsePrefixExpression.bind(this),
        [TokenType.MINUS]: this.parsePrefixExpression.bind(this),
        [TokenType.LPAREN]: this.parseGroupedExpression.bind(this),
    };

    private infixParseFns: { [key: string]: (left: AST.Expression) => AST.Expression } = {
        [TokenType.PLUS]: this.parseInfixExpression.bind(this),
        [TokenType.MINUS]: this.parseInfixExpression.bind(this),
        [TokenType.SLASH]: this.parseInfixExpression.bind(this),
        [TokenType.ASTERISK]: this.parseInfixExpression.bind(this),
        [TokenType.EQ]: this.parseInfixExpression.bind(this),
        [TokenType.NEQ]: this.parseInfixExpression.bind(this),
        [TokenType.LT]: this.parseInfixExpression.bind(this),
        [TokenType.LTE]: this.parseInfixExpression.bind(this),
        [TokenType.GT]: this.parseInfixExpression.bind(this),
        [TokenType.GTE]: this.parseInfixExpression.bind(this),
        [TokenType.AND]: this.parseInfixExpression.bind(this),
        [TokenType.OR]: this.parseInfixExpression.bind(this),
    };
}

enum Precedence {
    LOWEST = 1,
    LOGICAL_OR,
    LOGICAL_AND,
    EQUALS,
    LESSGREATER,
    SUM,
    PRODUCT,
    PREFIX,
    CALL
}

const PRECEDENCES: { [key: string]: number } = {
    [TokenType.EQ]: Precedence.EQUALS,
    [TokenType.NEQ]: Precedence.EQUALS,
    [TokenType.LT]: Precedence.LESSGREATER,
    [TokenType.LTE]: Precedence.LESSGREATER,
    [TokenType.GT]: Precedence.LESSGREATER,
    [TokenType.GTE]: Precedence.LESSGREATER,
    [TokenType.PLUS]: Precedence.SUM,
    [TokenType.MINUS]: Precedence.SUM,
    [TokenType.SLASH]: Precedence.PRODUCT,
    [TokenType.ASTERISK]: Precedence.PRODUCT,
    [TokenType.AND]: Precedence.LOGICAL_AND,
    [TokenType.OR]: Precedence.LOGICAL_OR,
};

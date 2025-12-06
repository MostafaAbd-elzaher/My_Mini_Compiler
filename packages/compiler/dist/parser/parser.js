"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const token_1 = require("../lexer/token");
const AST = __importStar(require("./ast"));
const parseTree_1 = require("./parseTree");
class Parser {
    constructor(l) {
        this.errors = [];
        this.prefixParseFns = {
            [token_1.TokenType.IDENTIFIER]: this.parseIdentifier.bind(this),
            [token_1.TokenType.INTEGER_LITERAL]: this.parseIntegerLiteral.bind(this),
            [token_1.TokenType.STRING_LITERAL]: this.parseStringLiteral.bind(this),
            [token_1.TokenType.TRUE]: this.parseBooleanLiteral.bind(this),
            [token_1.TokenType.FALSE]: this.parseBooleanLiteral.bind(this),
            [token_1.TokenType.NOT]: this.parsePrefixExpression.bind(this),
            [token_1.TokenType.MINUS]: this.parsePrefixExpression.bind(this),
            [token_1.TokenType.LPAREN]: this.parseGroupedExpression.bind(this),
        };
        this.infixParseFns = {
            [token_1.TokenType.PLUS]: this.parseInfixExpression.bind(this),
            [token_1.TokenType.MINUS]: this.parseInfixExpression.bind(this),
            [token_1.TokenType.SLASH]: this.parseInfixExpression.bind(this),
            [token_1.TokenType.ASTERISK]: this.parseInfixExpression.bind(this),
            [token_1.TokenType.EQ]: this.parseInfixExpression.bind(this),
            [token_1.TokenType.NEQ]: this.parseInfixExpression.bind(this),
            [token_1.TokenType.LT]: this.parseInfixExpression.bind(this),
            [token_1.TokenType.LTE]: this.parseInfixExpression.bind(this),
            [token_1.TokenType.GT]: this.parseInfixExpression.bind(this),
            [token_1.TokenType.GTE]: this.parseInfixExpression.bind(this),
            [token_1.TokenType.AND]: this.parseInfixExpression.bind(this),
            [token_1.TokenType.OR]: this.parseInfixExpression.bind(this),
        };
        this.l = l;
        this.nextToken();
        this.nextToken();
    }
    getErrors() {
        return this.errors;
    }
    nextToken() {
        this.curToken = this.peekToken;
        this.peekToken = this.l.nextToken();
    }
    curTokenIs(t) {
        return this.curToken.type === t;
    }
    peekTokenIs(t) {
        return this.peekToken.type === t;
    }
    expectPeek(t) {
        if (this.peekTokenIs(t)) {
            this.nextToken();
            return true;
        }
        else {
            this.peekError(t);
            return false;
        }
    }
    peekError(t) {
        const msg = `expected next token to be ${t}, got ${this.peekToken.type} instead at line ${this.peekToken.line}, column ${this.peekToken.column}`;
        this.errors.push(msg);
    }
    noPrefixParseFnError(t) {
        const msg = `no prefix parse function for ${t} found at line ${this.curToken.line}, column ${this.curToken.column}`;
        this.errors.push(msg);
    }
    parseProgram() {
        const program = new AST.Program();
        while (this.curToken.type !== token_1.TokenType.EOF) {
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
    getParseTree(program) {
        return program.toParseTree();
    }
    /**
     * Get the parse tree as a formatted string for display
     */
    getParseTreeString(program) {
        const tree = program.toParseTree();
        return (0, parseTree_1.parseTreeToString)(tree, '', true);
    }
    /**
     * Get the parse tree as a JSON object for visualization
     */
    getParseTreeJSON(program) {
        const tree = program.toParseTree();
        return (0, parseTree_1.parseTreeToJSON)(tree);
    }
    parseStatement() {
        switch (this.curToken.type) {
            case token_1.TokenType.INT:
            case token_1.TokenType.BOOL:
            case token_1.TokenType.STRING:
                return this.parseVariableDeclaration();
            case token_1.TokenType.IF:
                return this.parseIfStatement();
            case token_1.TokenType.WHILE:
                return this.parseWhileStatement();
            case token_1.TokenType.CONSOLE:
                return this.parseConsoleWriteLine();
            case token_1.TokenType.LBRACE:
                return this.parseBlockStatement();
            case token_1.TokenType.IDENTIFIER:
                if (this.peekTokenIs(token_1.TokenType.ASSIGN)) {
                    return this.parseAssignmentStatement();
                }
                return this.parseExpressionStatement();
            default:
                return this.parseExpressionStatement();
        }
    }
    parseVariableDeclaration() {
        const typeToken = this.curToken;
        const varType = typeToken.literal;
        if (!this.expectPeek(token_1.TokenType.IDENTIFIER)) {
            return null;
        }
        const name = new AST.Identifier(this.curToken, this.curToken.literal);
        let value;
        if (this.peekTokenIs(token_1.TokenType.ASSIGN)) {
            this.nextToken(); // move to =
            this.nextToken(); // move to expression
            value = this.parseExpression(Precedence.LOWEST);
        }
        if (this.peekTokenIs(token_1.TokenType.SEMICOLON)) {
            this.nextToken();
        }
        return new AST.VariableDeclaration(typeToken, name, varType, value);
    }
    parseConsoleWriteLine() {
        const token = this.curToken;
        if (!this.expectPeek(token_1.TokenType.DOT)) {
            return null;
        }
        if (!this.expectPeek(token_1.TokenType.WRITELINE)) {
            return null;
        }
        if (!this.expectPeek(token_1.TokenType.LPAREN)) {
            return null;
        }
        this.nextToken();
        const expression = this.parseExpression(Precedence.LOWEST);
        if (!this.expectPeek(token_1.TokenType.RPAREN)) {
            return null;
        }
        if (this.peekTokenIs(token_1.TokenType.SEMICOLON)) {
            this.nextToken();
        }
        return new AST.ConsoleWriteLine(token, expression);
    }
    parseBlockStatement() {
        const block = new AST.BlockStatement(this.curToken, []);
        this.nextToken();
        while (!this.curTokenIs(token_1.TokenType.RBRACE) && !this.curTokenIs(token_1.TokenType.EOF)) {
            const stmt = this.parseStatement();
            if (stmt) {
                block.statements.push(stmt);
            }
            this.nextToken();
        }
        return block;
    }
    parseAssignmentStatement() {
        const name = new AST.Identifier(this.curToken, this.curToken.literal);
        const token = this.curToken;
        this.nextToken(); // move to '='
        this.nextToken(); // move to expression
        const value = this.parseExpression(Precedence.LOWEST);
        if (this.peekTokenIs(token_1.TokenType.SEMICOLON)) {
            this.nextToken();
        }
        return new AST.AssignmentStatement(token, name, value);
    }
    parseIfStatement() {
        const token = this.curToken;
        if (!this.expectPeek(token_1.TokenType.LPAREN)) {
            return null;
        }
        this.nextToken();
        const condition = this.parseExpression(Precedence.LOWEST);
        if (!this.expectPeek(token_1.TokenType.RPAREN)) {
            return null;
        }
        if (!this.expectPeek(token_1.TokenType.LBRACE)) {
            return null;
        }
        const consequence = this.parseBlockStatement();
        let alternative;
        if (this.peekTokenIs(token_1.TokenType.ELSE)) {
            this.nextToken();
            if (!this.expectPeek(token_1.TokenType.LBRACE)) {
                return null;
            }
            alternative = this.parseBlockStatement();
        }
        return new AST.IfStatement(token, condition, consequence, alternative);
    }
    parseWhileStatement() {
        const token = this.curToken;
        if (!this.expectPeek(token_1.TokenType.LPAREN)) {
            return null;
        }
        this.nextToken();
        const condition = this.parseExpression(Precedence.LOWEST);
        if (!this.expectPeek(token_1.TokenType.RPAREN)) {
            return null;
        }
        if (!this.expectPeek(token_1.TokenType.LBRACE)) {
            return null;
        }
        const body = this.parseBlockStatement();
        return new AST.WhileStatement(token, condition, body);
    }
    parseExpressionStatement() {
        const token = this.curToken;
        const expression = this.parseExpression(Precedence.LOWEST);
        if (this.peekTokenIs(token_1.TokenType.SEMICOLON)) {
            this.nextToken();
        }
        return new AST.ExpressionStatement(token, expression);
    }
    parseExpression(precedence) {
        const prefix = this.prefixParseFns[this.curToken.type];
        if (!prefix) {
            this.noPrefixParseFnError(this.curToken.type);
            return new AST.Identifier(this.curToken, "");
        }
        let leftExp = prefix.call(this);
        while (!this.peekTokenIs(token_1.TokenType.SEMICOLON) && precedence < this.peekPrecedence()) {
            const infix = this.infixParseFns[this.peekToken.type];
            if (!infix) {
                return leftExp;
            }
            this.nextToken();
            leftExp = infix.call(this, leftExp);
        }
        return leftExp;
    }
    parseIdentifier() {
        return new AST.Identifier(this.curToken, this.curToken.literal);
    }
    parseIntegerLiteral() {
        const value = parseInt(this.curToken.literal, 10);
        return new AST.IntegerLiteral(this.curToken, value);
    }
    parseBooleanLiteral() {
        return new AST.BooleanLiteral(this.curToken, this.curToken.type === token_1.TokenType.TRUE);
    }
    parseStringLiteral() {
        return new AST.StringLiteral(this.curToken, this.curToken.literal);
    }
    parsePrefixExpression() {
        const token = this.curToken;
        const operator = this.curToken.literal;
        this.nextToken();
        const right = this.parseExpression(Precedence.PREFIX);
        return new AST.PrefixExpression(token, operator, right);
    }
    parseInfixExpression(left) {
        const token = this.curToken;
        const operator = this.curToken.literal;
        const precedence = this.curPrecedence();
        this.nextToken();
        const right = this.parseExpression(precedence);
        return new AST.InfixExpression(token, left, operator, right);
    }
    parseGroupedExpression() {
        this.nextToken();
        const exp = this.parseExpression(Precedence.LOWEST);
        if (!this.expectPeek(token_1.TokenType.RPAREN)) {
            return exp;
        }
        return exp;
    }
    peekPrecedence() {
        return PRECEDENCES[this.peekToken.type] || Precedence.LOWEST;
    }
    curPrecedence() {
        return PRECEDENCES[this.curToken.type] || Precedence.LOWEST;
    }
}
exports.Parser = Parser;
var Precedence;
(function (Precedence) {
    Precedence[Precedence["LOWEST"] = 1] = "LOWEST";
    Precedence[Precedence["LOGICAL_OR"] = 2] = "LOGICAL_OR";
    Precedence[Precedence["LOGICAL_AND"] = 3] = "LOGICAL_AND";
    Precedence[Precedence["EQUALS"] = 4] = "EQUALS";
    Precedence[Precedence["LESSGREATER"] = 5] = "LESSGREATER";
    Precedence[Precedence["SUM"] = 6] = "SUM";
    Precedence[Precedence["PRODUCT"] = 7] = "PRODUCT";
    Precedence[Precedence["PREFIX"] = 8] = "PREFIX";
    Precedence[Precedence["CALL"] = 9] = "CALL";
})(Precedence || (Precedence = {}));
const PRECEDENCES = {
    [token_1.TokenType.EQ]: Precedence.EQUALS,
    [token_1.TokenType.NEQ]: Precedence.EQUALS,
    [token_1.TokenType.LT]: Precedence.LESSGREATER,
    [token_1.TokenType.LTE]: Precedence.LESSGREATER,
    [token_1.TokenType.GT]: Precedence.LESSGREATER,
    [token_1.TokenType.GTE]: Precedence.LESSGREATER,
    [token_1.TokenType.PLUS]: Precedence.SUM,
    [token_1.TokenType.MINUS]: Precedence.SUM,
    [token_1.TokenType.SLASH]: Precedence.PRODUCT,
    [token_1.TokenType.ASTERISK]: Precedence.PRODUCT,
    [token_1.TokenType.AND]: Precedence.LOGICAL_AND,
    [token_1.TokenType.OR]: Precedence.LOGICAL_OR,
};

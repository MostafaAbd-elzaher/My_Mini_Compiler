"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleWriteLine = exports.AssignmentStatement = exports.WhileStatement = exports.IfStatement = exports.BlockStatement = exports.ExpressionStatement = exports.VariableDeclaration = exports.InfixExpression = exports.PrefixExpression = exports.StringLiteral = exports.BooleanLiteral = exports.IntegerLiteral = exports.Identifier = exports.Program = void 0;
const parseTree_1 = require("./parseTree");
class Program {
    constructor() {
        this.type = 'Program';
        this.statements = [];
    }
    tokenLiteral() {
        if (this.statements.length > 0) {
            return this.statements[0].tokenLiteral();
        }
        return '';
    }
    toString() {
        return this.statements.map(s => s.toString()).join('\n');
    }
    toParseTree() {
        return (0, parseTree_1.createNonTerminal)('Program', this.statements.map(s => s.toParseTree()));
    }
}
exports.Program = Program;
class Identifier {
    constructor(token, value) {
        this.token = token;
        this.value = value;
        this.type = 'Identifier';
    }
    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() { return this.value; }
    toParseTree() {
        return (0, parseTree_1.createTerminal)('Identifier', this.value, this.token.type, this.token.line, this.token.column);
    }
}
exports.Identifier = Identifier;
class IntegerLiteral {
    constructor(token, value) {
        this.token = token;
        this.value = value;
        this.type = 'IntegerLiteral';
    }
    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() { return this.token.literal; }
    toParseTree() {
        return (0, parseTree_1.createTerminal)('IntegerLiteral', String(this.value), this.token.type, this.token.line, this.token.column);
    }
}
exports.IntegerLiteral = IntegerLiteral;
class BooleanLiteral {
    constructor(token, value) {
        this.token = token;
        this.value = value;
        this.type = 'BooleanLiteral';
    }
    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() { return this.token.literal; }
    toParseTree() {
        return (0, parseTree_1.createTerminal)('BooleanLiteral', String(this.value), this.token.type, this.token.line, this.token.column);
    }
}
exports.BooleanLiteral = BooleanLiteral;
class StringLiteral {
    constructor(token, value) {
        this.token = token;
        this.value = value;
        this.type = 'StringLiteral';
    }
    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() { return `"${this.value}"`; }
    toParseTree() {
        return (0, parseTree_1.createTerminal)('StringLiteral', this.value, this.token.type, this.token.line, this.token.column);
    }
}
exports.StringLiteral = StringLiteral;
class PrefixExpression {
    constructor(token, operator, right) {
        this.token = token;
        this.operator = operator;
        this.right = right;
        this.type = 'PrefixExpression';
    }
    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() { return `(${this.operator}${this.right.toString()})`; }
    toParseTree() {
        return (0, parseTree_1.createNonTerminal)('PrefixExpression', [
            (0, parseTree_1.createTerminal)('Operator', this.operator, this.token.type),
            this.right.toParseTree()
        ]);
    }
}
exports.PrefixExpression = PrefixExpression;
class InfixExpression {
    constructor(token, left, operator, right) {
        this.token = token;
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.type = 'InfixExpression';
    }
    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() { return `(${this.left.toString()} ${this.operator} ${this.right.toString()})`; }
    toParseTree() {
        return (0, parseTree_1.createNonTerminal)('InfixExpression', [
            this.left.toParseTree(),
            (0, parseTree_1.createTerminal)('Operator', this.operator, this.token.type),
            this.right.toParseTree()
        ]);
    }
}
exports.InfixExpression = InfixExpression;
class VariableDeclaration {
    constructor(token, name, varType, value) {
        this.token = token;
        this.name = name;
        this.varType = varType;
        this.value = value;
        this.type = 'VariableDeclaration';
    }
    statementNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() {
        let out = `${this.varType} ${this.name.toString()}`;
        if (this.value) {
            out += ` = ${this.value.toString()}`;
        }
        return out + ';';
    }
    toParseTree() {
        const children = [
            (0, parseTree_1.createTerminal)('Type', this.varType, this.token.type),
            this.name.toParseTree()
        ];
        if (this.value) {
            children.push((0, parseTree_1.createTerminal)('AssignOp', '=', 'ASSIGN'));
            children.push(this.value.toParseTree());
        }
        children.push((0, parseTree_1.createTerminal)('Semicolon', ';', 'SEMICOLON'));
        return (0, parseTree_1.createNonTerminal)('VariableDeclaration', children);
    }
}
exports.VariableDeclaration = VariableDeclaration;
class ExpressionStatement {
    constructor(token, expression) {
        this.token = token;
        this.expression = expression;
        this.type = 'ExpressionStatement';
    }
    statementNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() { return this.expression.toString() + ';'; }
    toParseTree() {
        return (0, parseTree_1.createNonTerminal)('ExpressionStatement', [
            this.expression.toParseTree(),
            (0, parseTree_1.createTerminal)('Semicolon', ';', 'SEMICOLON')
        ]);
    }
}
exports.ExpressionStatement = ExpressionStatement;
class BlockStatement {
    constructor(token, statements) {
        this.token = token;
        this.statements = statements;
        this.type = 'BlockStatement';
    }
    statementNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() {
        return `{ ${this.statements.map(s => s.toString()).join(' ')} }`;
    }
    toParseTree() {
        return (0, parseTree_1.createNonTerminal)('BlockStatement', [
            (0, parseTree_1.createTerminal)('LeftBrace', '{', 'LBRACE'),
            ...this.statements.map(s => s.toParseTree()),
            (0, parseTree_1.createTerminal)('RightBrace', '}', 'RBRACE')
        ]);
    }
}
exports.BlockStatement = BlockStatement;
class IfStatement {
    constructor(token, condition, consequence, alternative) {
        this.token = token;
        this.condition = condition;
        this.consequence = consequence;
        this.alternative = alternative;
        this.type = 'IfStatement';
    }
    statementNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() {
        let out = `if ${this.condition.toString()} ${this.consequence.toString()}`;
        if (this.alternative) {
            out += ` else ${this.alternative.toString()}`;
        }
        return out;
    }
    toParseTree() {
        const children = [
            (0, parseTree_1.createTerminal)('IfKeyword', 'if', 'IF'),
            (0, parseTree_1.createTerminal)('LeftParen', '(', 'LPAREN'),
            this.condition.toParseTree(),
            (0, parseTree_1.createTerminal)('RightParen', ')', 'RPAREN'),
            this.consequence.toParseTree()
        ];
        if (this.alternative) {
            children.push((0, parseTree_1.createTerminal)('ElseKeyword', 'else', 'ELSE'));
            children.push(this.alternative.toParseTree());
        }
        return (0, parseTree_1.createNonTerminal)('IfStatement', children);
    }
}
exports.IfStatement = IfStatement;
class WhileStatement {
    constructor(token, condition, body) {
        this.token = token;
        this.condition = condition;
        this.body = body;
        this.type = 'WhileStatement';
    }
    statementNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() {
        return `while ${this.condition.toString()} ${this.body.toString()}`;
    }
    toParseTree() {
        return (0, parseTree_1.createNonTerminal)('WhileStatement', [
            (0, parseTree_1.createTerminal)('WhileKeyword', 'while', 'WHILE'),
            (0, parseTree_1.createTerminal)('LeftParen', '(', 'LPAREN'),
            this.condition.toParseTree(),
            (0, parseTree_1.createTerminal)('RightParen', ')', 'RPAREN'),
            this.body.toParseTree()
        ]);
    }
}
exports.WhileStatement = WhileStatement;
class AssignmentStatement {
    constructor(token, name, value) {
        this.token = token;
        this.name = name;
        this.value = value;
        this.type = 'AssignmentStatement';
    }
    statementNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() {
        return `${this.name.toString()} = ${this.value.toString()};`;
    }
    toParseTree() {
        return (0, parseTree_1.createNonTerminal)('AssignmentStatement', [
            this.name.toParseTree(),
            (0, parseTree_1.createTerminal)('AssignOp', '=', 'ASSIGN'),
            this.value.toParseTree(),
            (0, parseTree_1.createTerminal)('Semicolon', ';', 'SEMICOLON')
        ]);
    }
}
exports.AssignmentStatement = AssignmentStatement;
class ConsoleWriteLine {
    constructor(token, expression) {
        this.token = token;
        this.expression = expression;
        this.type = 'ConsoleWriteLine';
    }
    statementNode() { }
    tokenLiteral() { return 'Console.WriteLine'; }
    toString() {
        return `Console.WriteLine(${this.expression.toString()});`;
    }
    toParseTree() {
        return (0, parseTree_1.createNonTerminal)('ConsoleWriteLine', [
            (0, parseTree_1.createTerminal)('Console', 'Console', 'CONSOLE'),
            (0, parseTree_1.createTerminal)('Dot', '.', 'DOT'),
            (0, parseTree_1.createTerminal)('WriteLine', 'WriteLine', 'WRITELINE'),
            (0, parseTree_1.createTerminal)('LeftParen', '(', 'LPAREN'),
            this.expression.toParseTree(),
            (0, parseTree_1.createTerminal)('RightParen', ')', 'RPAREN'),
            (0, parseTree_1.createTerminal)('Semicolon', ';', 'SEMICOLON')
        ]);
    }
}
exports.ConsoleWriteLine = ConsoleWriteLine;

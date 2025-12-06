import { TokenType } from '../lexer/token';
import { ParseTreeNode, createNonTerminal, createTerminal } from './parseTree';

export type NodeType =
    | 'Program'
    | 'BlockStatement'
    | 'VariableDeclaration'
    | 'ExpressionStatement'
    | 'IfStatement'
    | 'WhileStatement'
    | 'AssignmentStatement'
    | 'ConsoleWriteLine'
    | 'Identifier'
    | 'IntegerLiteral'
    | 'BooleanLiteral'
    | 'StringLiteral'
    | 'PrefixExpression'
    | 'InfixExpression';

export interface Node {
    type: NodeType;
    tokenLiteral(): string;
    toString(): string;
    toParseTree(): ParseTreeNode;
}

export interface Statement extends Node {
    statementNode(): void;
}

export interface Expression extends Node {
    expressionNode(): void;
}

export class Program implements Node {
    type: NodeType = 'Program';
    statements: Statement[] = [];

    tokenLiteral(): string {
        if (this.statements.length > 0) {
            return this.statements[0].tokenLiteral();
        }
        return '';
    }

    toString(): string {
        return this.statements.map(s => s.toString()).join('\n');
    }

    toParseTree(): ParseTreeNode {
        return createNonTerminal('Program',
            this.statements.map(s => s.toParseTree())
        );
    }
}

export class Identifier implements Expression {
    type: NodeType = 'Identifier';
    constructor(public token: any, public value: string) { }

    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() { return this.value; }
    toParseTree(): ParseTreeNode {
        return createTerminal('Identifier', this.value, this.token.type, this.token.line, this.token.column);
    }
}

export class IntegerLiteral implements Expression {
    type: NodeType = 'IntegerLiteral';
    constructor(public token: any, public value: number) { }

    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() { return this.token.literal; }
    toParseTree(): ParseTreeNode {
        return createTerminal('IntegerLiteral', String(this.value), this.token.type, this.token.line, this.token.column);
    }
}

export class BooleanLiteral implements Expression {
    type: NodeType = 'BooleanLiteral';
    constructor(public token: any, public value: boolean) { }

    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() { return this.token.literal; }
    toParseTree(): ParseTreeNode {
        return createTerminal('BooleanLiteral', String(this.value), this.token.type, this.token.line, this.token.column);
    }
}

export class StringLiteral implements Expression {
    type: NodeType = 'StringLiteral';
    constructor(public token: any, public value: string) { }

    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() { return `"${this.value}"`; }
    toParseTree(): ParseTreeNode {
        return createTerminal('StringLiteral', this.value, this.token.type, this.token.line, this.token.column);
    }
}

export class PrefixExpression implements Expression {
    type: NodeType = 'PrefixExpression';
    constructor(
        public token: any,
        public operator: string,
        public right: Expression
    ) { }

    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() { return `(${this.operator}${this.right.toString()})`; }
    toParseTree(): ParseTreeNode {
        return createNonTerminal('PrefixExpression', [
            createTerminal('Operator', this.operator, this.token.type),
            this.right.toParseTree()
        ]);
    }
}

export class InfixExpression implements Expression {
    type: NodeType = 'InfixExpression';
    constructor(
        public token: any,
        public left: Expression,
        public operator: string,
        public right: Expression
    ) { }

    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() { return `(${this.left.toString()} ${this.operator} ${this.right.toString()})`; }
    toParseTree(): ParseTreeNode {
        return createNonTerminal('InfixExpression', [
            this.left.toParseTree(),
            createTerminal('Operator', this.operator, this.token.type),
            this.right.toParseTree()
        ]);
    }
}

export class VariableDeclaration implements Statement {
    type: NodeType = 'VariableDeclaration';
    constructor(
        public token: any,
        public name: Identifier,
        public varType: string,
        public value?: Expression
    ) { }

    statementNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() {
        let out = `${this.varType} ${this.name.toString()}`;
        if (this.value) {
            out += ` = ${this.value.toString()}`;
        }
        return out + ';';
    }
    toParseTree(): ParseTreeNode {
        const children: ParseTreeNode[] = [
            createTerminal('Type', this.varType, this.token.type),
            this.name.toParseTree()
        ];
        if (this.value) {
            children.push(createTerminal('AssignOp', '=', 'ASSIGN'));
            children.push(this.value.toParseTree());
        }
        children.push(createTerminal('Semicolon', ';', 'SEMICOLON'));
        return createNonTerminal('VariableDeclaration', children);
    }
}

export class ExpressionStatement implements Statement {
    type: NodeType = 'ExpressionStatement';
    constructor(
        public token: any,
        public expression: Expression
    ) { }

    statementNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() { return this.expression.toString() + ';'; }
    toParseTree(): ParseTreeNode {
        return createNonTerminal('ExpressionStatement', [
            this.expression.toParseTree(),
            createTerminal('Semicolon', ';', 'SEMICOLON')
        ]);
    }
}

export class BlockStatement implements Statement {
    type: NodeType = 'BlockStatement';
    constructor(
        public token: any,
        public statements: Statement[]
    ) { }

    statementNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() {
        return `{ ${this.statements.map(s => s.toString()).join(' ')} }`;
    }
    toParseTree(): ParseTreeNode {
        return createNonTerminal('BlockStatement', [
            createTerminal('LeftBrace', '{', 'LBRACE'),
            ...this.statements.map(s => s.toParseTree()),
            createTerminal('RightBrace', '}', 'RBRACE')
        ]);
    }
}

export class IfStatement implements Statement {
    type: NodeType = 'IfStatement';
    constructor(
        public token: any,
        public condition: Expression,
        public consequence: BlockStatement,
        public alternative?: BlockStatement
    ) { }

    statementNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() {
        let out = `if ${this.condition.toString()} ${this.consequence.toString()}`;
        if (this.alternative) {
            out += ` else ${this.alternative.toString()}`;
        }
        return out;
    }
    toParseTree(): ParseTreeNode {
        const children: ParseTreeNode[] = [
            createTerminal('IfKeyword', 'if', 'IF'),
            createTerminal('LeftParen', '(', 'LPAREN'),
            this.condition.toParseTree(),
            createTerminal('RightParen', ')', 'RPAREN'),
            this.consequence.toParseTree()
        ];
        if (this.alternative) {
            children.push(createTerminal('ElseKeyword', 'else', 'ELSE'));
            children.push(this.alternative.toParseTree());
        }
        return createNonTerminal('IfStatement', children);
    }
}

export class WhileStatement implements Statement {
    type: NodeType = 'WhileStatement';
    constructor(
        public token: any,
        public condition: Expression,
        public body: BlockStatement
    ) { }

    statementNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() {
        return `while ${this.condition.toString()} ${this.body.toString()}`;
    }
    toParseTree(): ParseTreeNode {
        return createNonTerminal('WhileStatement', [
            createTerminal('WhileKeyword', 'while', 'WHILE'),
            createTerminal('LeftParen', '(', 'LPAREN'),
            this.condition.toParseTree(),
            createTerminal('RightParen', ')', 'RPAREN'),
            this.body.toParseTree()
        ]);
    }
}

export class AssignmentStatement implements Statement {
    type: NodeType = 'AssignmentStatement';
    constructor(
        public token: any,
        public name: Identifier,
        public value: Expression
    ) { }

    statementNode() { }
    tokenLiteral() { return this.token.literal; }
    toString() {
        return `${this.name.toString()} = ${this.value.toString()};`;
    }
    toParseTree(): ParseTreeNode {
        return createNonTerminal('AssignmentStatement', [
            this.name.toParseTree(),
            createTerminal('AssignOp', '=', 'ASSIGN'),
            this.value.toParseTree(),
            createTerminal('Semicolon', ';', 'SEMICOLON')
        ]);
    }
}

export class ConsoleWriteLine implements Statement {
    type: NodeType = 'ConsoleWriteLine';
    constructor(
        public token: any,
        public expression: Expression
    ) { }

    statementNode() { }
    tokenLiteral() { return 'Console.WriteLine'; }
    toString() {
        return `Console.WriteLine(${this.expression.toString()});`;
    }
    toParseTree(): ParseTreeNode {
        return createNonTerminal('ConsoleWriteLine', [
            createTerminal('Console', 'Console', 'CONSOLE'),
            createTerminal('Dot', '.', 'DOT'),
            createTerminal('WriteLine', 'WriteLine', 'WRITELINE'),
            createTerminal('LeftParen', '(', 'LPAREN'),
            this.expression.toParseTree(),
            createTerminal('RightParen', ')', 'RPAREN'),
            createTerminal('Semicolon', ';', 'SEMICOLON')
        ]);
    }
}

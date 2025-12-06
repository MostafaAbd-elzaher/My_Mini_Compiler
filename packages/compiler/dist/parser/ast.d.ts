import { ParseTreeNode } from './parseTree';
export type NodeType = 'Program' | 'BlockStatement' | 'VariableDeclaration' | 'ExpressionStatement' | 'IfStatement' | 'WhileStatement' | 'AssignmentStatement' | 'ConsoleWriteLine' | 'Identifier' | 'IntegerLiteral' | 'BooleanLiteral' | 'StringLiteral' | 'PrefixExpression' | 'InfixExpression';
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
export declare class Program implements Node {
    type: NodeType;
    statements: Statement[];
    tokenLiteral(): string;
    toString(): string;
    toParseTree(): ParseTreeNode;
}
export declare class Identifier implements Expression {
    token: any;
    value: string;
    type: NodeType;
    constructor(token: any, value: string);
    expressionNode(): void;
    tokenLiteral(): any;
    toString(): string;
    toParseTree(): ParseTreeNode;
}
export declare class IntegerLiteral implements Expression {
    token: any;
    value: number;
    type: NodeType;
    constructor(token: any, value: number);
    expressionNode(): void;
    tokenLiteral(): any;
    toString(): any;
    toParseTree(): ParseTreeNode;
}
export declare class BooleanLiteral implements Expression {
    token: any;
    value: boolean;
    type: NodeType;
    constructor(token: any, value: boolean);
    expressionNode(): void;
    tokenLiteral(): any;
    toString(): any;
    toParseTree(): ParseTreeNode;
}
export declare class StringLiteral implements Expression {
    token: any;
    value: string;
    type: NodeType;
    constructor(token: any, value: string);
    expressionNode(): void;
    tokenLiteral(): any;
    toString(): string;
    toParseTree(): ParseTreeNode;
}
export declare class PrefixExpression implements Expression {
    token: any;
    operator: string;
    right: Expression;
    type: NodeType;
    constructor(token: any, operator: string, right: Expression);
    expressionNode(): void;
    tokenLiteral(): any;
    toString(): string;
    toParseTree(): ParseTreeNode;
}
export declare class InfixExpression implements Expression {
    token: any;
    left: Expression;
    operator: string;
    right: Expression;
    type: NodeType;
    constructor(token: any, left: Expression, operator: string, right: Expression);
    expressionNode(): void;
    tokenLiteral(): any;
    toString(): string;
    toParseTree(): ParseTreeNode;
}
export declare class VariableDeclaration implements Statement {
    token: any;
    name: Identifier;
    varType: string;
    value?: Expression | undefined;
    type: NodeType;
    constructor(token: any, name: Identifier, varType: string, value?: Expression | undefined);
    statementNode(): void;
    tokenLiteral(): any;
    toString(): string;
    toParseTree(): ParseTreeNode;
}
export declare class ExpressionStatement implements Statement {
    token: any;
    expression: Expression;
    type: NodeType;
    constructor(token: any, expression: Expression);
    statementNode(): void;
    tokenLiteral(): any;
    toString(): string;
    toParseTree(): ParseTreeNode;
}
export declare class BlockStatement implements Statement {
    token: any;
    statements: Statement[];
    type: NodeType;
    constructor(token: any, statements: Statement[]);
    statementNode(): void;
    tokenLiteral(): any;
    toString(): string;
    toParseTree(): ParseTreeNode;
}
export declare class IfStatement implements Statement {
    token: any;
    condition: Expression;
    consequence: BlockStatement;
    alternative?: BlockStatement | undefined;
    type: NodeType;
    constructor(token: any, condition: Expression, consequence: BlockStatement, alternative?: BlockStatement | undefined);
    statementNode(): void;
    tokenLiteral(): any;
    toString(): string;
    toParseTree(): ParseTreeNode;
}
export declare class WhileStatement implements Statement {
    token: any;
    condition: Expression;
    body: BlockStatement;
    type: NodeType;
    constructor(token: any, condition: Expression, body: BlockStatement);
    statementNode(): void;
    tokenLiteral(): any;
    toString(): string;
    toParseTree(): ParseTreeNode;
}
export declare class AssignmentStatement implements Statement {
    token: any;
    name: Identifier;
    value: Expression;
    type: NodeType;
    constructor(token: any, name: Identifier, value: Expression);
    statementNode(): void;
    tokenLiteral(): any;
    toString(): string;
    toParseTree(): ParseTreeNode;
}
export declare class ConsoleWriteLine implements Statement {
    token: any;
    expression: Expression;
    type: NodeType;
    constructor(token: any, expression: Expression);
    statementNode(): void;
    tokenLiteral(): string;
    toString(): string;
    toParseTree(): ParseTreeNode;
}

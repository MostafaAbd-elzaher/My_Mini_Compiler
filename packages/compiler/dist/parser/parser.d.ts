import { Lexer } from '../lexer/lexer';
import * as AST from './ast';
import { ParseTreeNode } from './parseTree';
export declare class Parser {
    private l;
    private curToken;
    private peekToken;
    private errors;
    constructor(l: Lexer);
    getErrors(): string[];
    private nextToken;
    private curTokenIs;
    private peekTokenIs;
    private expectPeek;
    private peekError;
    private noPrefixParseFnError;
    parseProgram(): AST.Program;
    /**
     * Get the parse tree from a program as a ParseTreeNode
     */
    getParseTree(program: AST.Program): ParseTreeNode;
    /**
     * Get the parse tree as a formatted string for display
     */
    getParseTreeString(program: AST.Program): string;
    /**
     * Get the parse tree as a JSON object for visualization
     */
    getParseTreeJSON(program: AST.Program): any;
    private parseStatement;
    private parseVariableDeclaration;
    private parseConsoleWriteLine;
    private parseBlockStatement;
    private parseAssignmentStatement;
    private parseIfStatement;
    private parseWhileStatement;
    private parseExpressionStatement;
    private parseExpression;
    private parseIdentifier;
    private parseIntegerLiteral;
    private parseBooleanLiteral;
    private parseStringLiteral;
    private parsePrefixExpression;
    private parseInfixExpression;
    private parseGroupedExpression;
    private peekPrecedence;
    private curPrecedence;
    private prefixParseFns;
    private infixParseFns;
}

import * as AST from '../parser/ast';
import { SymbolTable } from './symbolTable';
export declare class SemanticAnalyzer {
    private symbolTable;
    private errors;
    constructor();
    getErrors(): string[];
    getSymbolTable(): SymbolTable;
    check(program: AST.Program): void;
    private checkStatement;
    private checkBlockStatement;
    private checkVariableDeclaration;
    private checkAssignmentStatement;
    private checkIfStatement;
    private checkWhileStatement;
    private checkConsoleWriteLine;
    private checkExpression;
    private checkPrefixExpression;
    private checkInfixExpression;
    private error;
}

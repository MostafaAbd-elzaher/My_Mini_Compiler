import * as AST from '../parser/ast';
import { SymbolTable } from './symbolTable';

export class SemanticAnalyzer {
    private symbolTable: SymbolTable;
    private errors: string[] = [];

    constructor() {
        this.symbolTable = new SymbolTable();
    }

    public getErrors(): string[] {
        return this.errors;
    }

    public getSymbolTable(): SymbolTable {
        return this.symbolTable;
    }

    public check(program: AST.Program) {
        program.statements.forEach(stmt => {
            this.checkStatement(stmt);
        });
    }

    private checkStatement(stmt: AST.Statement) {
        switch (stmt.type) {
            case 'VariableDeclaration':
                this.checkVariableDeclaration(stmt as AST.VariableDeclaration);
                break;
            case 'IfStatement':
                this.checkIfStatement(stmt as AST.IfStatement);
                break;
            case 'WhileStatement':
                this.checkWhileStatement(stmt as AST.WhileStatement);
                break;
            case 'BlockStatement':
                this.symbolTable.enterScope();
                this.checkBlockStatement(stmt as AST.BlockStatement);
                this.symbolTable.leaveScope();
                break;
            case 'ExpressionStatement':
                this.checkExpression((stmt as AST.ExpressionStatement).expression);
                break;
            case 'AssignmentStatement':
                this.checkAssignmentStatement(stmt as AST.AssignmentStatement);
                break;
            case 'ConsoleWriteLine':
                this.checkConsoleWriteLine(stmt as AST.ConsoleWriteLine);
                break;
        }
    }

    private checkBlockStatement(block: AST.BlockStatement) {
        block.statements.forEach(stmt => {
            this.checkStatement(stmt);
        });
    }

    private checkVariableDeclaration(stmt: AST.VariableDeclaration) {
        if (this.symbolTable.isDefinedInCurrentScope(stmt.name.value)) {
            this.error(`Variable '${stmt.name.value}' is already defined in this scope`, stmt.token);
        }

        if (stmt.value) {
            const valueType = this.checkExpression(stmt.value);
            if (valueType !== stmt.varType) {
                this.error(`Type mismatch: cannot assign '${valueType}' to variable of type '${stmt.varType}'`, stmt.token);
            }
        }

        this.symbolTable.define(stmt.name.value, stmt.varType, 'variable');
    }

    private checkAssignmentStatement(stmt: AST.AssignmentStatement) {
        const symbol = this.symbolTable.resolve(stmt.name.value);
        if (!symbol) {
            this.error(`Variable '${stmt.name.value}' is not defined`, stmt.token);
            return;
        }

        const valueType = this.checkExpression(stmt.value);
        if (valueType !== symbol.type) {
            this.error(`Type mismatch: cannot assign '${valueType}' to variable '${stmt.name.value}' of type '${symbol.type}'`, stmt.token);
        }
    }

    private checkIfStatement(stmt: AST.IfStatement) {
        const condType = this.checkExpression(stmt.condition);
        if (condType !== 'bool') {
            this.error(`Condition must be boolean, got '${condType}'`, stmt.token);
        }
        this.symbolTable.enterScope();
        this.checkBlockStatement(stmt.consequence);
        this.symbolTable.leaveScope();

        if (stmt.alternative) {
            this.symbolTable.enterScope();
            this.checkBlockStatement(stmt.alternative);
            this.symbolTable.leaveScope();
        }
    }

    private checkWhileStatement(stmt: AST.WhileStatement) {
        const condType = this.checkExpression(stmt.condition);
        if (condType !== 'bool') {
            this.error(`Condition must be boolean, got '${condType}'`, stmt.token);
        }
        this.symbolTable.enterScope();
        this.checkBlockStatement(stmt.body);
        this.symbolTable.leaveScope();
    }

    private checkConsoleWriteLine(stmt: AST.ConsoleWriteLine) {
        this.checkExpression(stmt.expression);
        // Console.WriteLine accepts any type, so no strict type check needed other than valid expression
    }

    private checkExpression(expr: AST.Expression): string {
        switch (expr.type) {
            case 'IntegerLiteral':
                return 'int';
            case 'BooleanLiteral':
                return 'bool';
            case 'StringLiteral':
                return 'string';
            case 'Identifier':
                const symbol = this.symbolTable.resolve((expr as AST.Identifier).value);
                if (!symbol) {
                    this.error(`Identifier '${(expr as AST.Identifier).value}' is not defined`, (expr as AST.Identifier).token);
                    return 'unknown';
                }
                return symbol.type;
            case 'PrefixExpression':
                return this.checkPrefixExpression(expr as AST.PrefixExpression);
            case 'InfixExpression':
                return this.checkInfixExpression(expr as AST.InfixExpression);
            default:
                return 'unknown';
        }
    }

    private checkPrefixExpression(expr: AST.PrefixExpression): string {
        const rightType = this.checkExpression(expr.right);
        if (expr.operator === '!') {
            if (rightType !== 'bool') {
                this.error(`Operator '!' requires boolean operand, got '${rightType}'`, expr.token);
            }
            return 'bool';
        } else if (expr.operator === '-') {
            if (rightType !== 'int') {
                this.error(`Operator '-' requires integer operand, got '${rightType}'`, expr.token);
            }
            return 'int';
        }
        return 'unknown';
    }

    private checkInfixExpression(expr: AST.InfixExpression): string {
        const leftType = this.checkExpression(expr.left);
        const rightType = this.checkExpression(expr.right);

        if (leftType !== rightType) {
            this.error(`Type mismatch: '${leftType}' ${expr.operator} '${rightType}'`, expr.token);
            return 'unknown';
        }

        switch (expr.operator) {
            case '+':
                if (leftType === 'int') return 'int';
                if (leftType === 'string') return 'string'; // String concatenation
                this.error(`Operator '+' is not defined for type '${leftType}'`, expr.token);
                return 'unknown';
            case '-':
            case '*':
            case '/':
                if (leftType !== 'int') {
                    this.error(`Operator '${expr.operator}' requires integer operands`, expr.token);
                }
                return 'int';
            case '<':
            case '>':
            case '<=':
            case '>=':
                if (leftType !== 'int') {
                    this.error(`Operator '${expr.operator}' requires integer operands`, expr.token);
                }
                return 'bool';
            case '==':
            case '!=':
                return 'bool';
            case '&&':
            case '||':
                if (leftType !== 'bool') {
                    this.error(`Operator '${expr.operator}' requires boolean operands`, expr.token);
                }
                return 'bool';
            default:
                return 'unknown';
        }
    }

    private error(msg: string, token: any) {
        this.errors.push(`${msg} at line ${token.line}, column ${token.column}`);
    }
}

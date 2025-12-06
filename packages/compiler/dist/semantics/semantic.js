"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticAnalyzer = void 0;
const symbolTable_1 = require("./symbolTable");
class SemanticAnalyzer {
    constructor() {
        this.errors = [];
        this.symbolTable = new symbolTable_1.SymbolTable();
    }
    getErrors() {
        return this.errors;
    }
    getSymbolTable() {
        return this.symbolTable;
    }
    check(program) {
        program.statements.forEach(stmt => {
            this.checkStatement(stmt);
        });
    }
    checkStatement(stmt) {
        switch (stmt.type) {
            case 'VariableDeclaration':
                this.checkVariableDeclaration(stmt);
                break;
            case 'IfStatement':
                this.checkIfStatement(stmt);
                break;
            case 'WhileStatement':
                this.checkWhileStatement(stmt);
                break;
            case 'BlockStatement':
                this.symbolTable.enterScope();
                this.checkBlockStatement(stmt);
                this.symbolTable.leaveScope();
                break;
            case 'ExpressionStatement':
                this.checkExpression(stmt.expression);
                break;
            case 'AssignmentStatement':
                this.checkAssignmentStatement(stmt);
                break;
            case 'ConsoleWriteLine':
                this.checkConsoleWriteLine(stmt);
                break;
        }
    }
    checkBlockStatement(block) {
        block.statements.forEach(stmt => {
            this.checkStatement(stmt);
        });
    }
    checkVariableDeclaration(stmt) {
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
    checkAssignmentStatement(stmt) {
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
    checkIfStatement(stmt) {
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
    checkWhileStatement(stmt) {
        const condType = this.checkExpression(stmt.condition);
        if (condType !== 'bool') {
            this.error(`Condition must be boolean, got '${condType}'`, stmt.token);
        }
        this.symbolTable.enterScope();
        this.checkBlockStatement(stmt.body);
        this.symbolTable.leaveScope();
    }
    checkConsoleWriteLine(stmt) {
        this.checkExpression(stmt.expression);
        // Console.WriteLine accepts any type, so no strict type check needed other than valid expression
    }
    checkExpression(expr) {
        switch (expr.type) {
            case 'IntegerLiteral':
                return 'int';
            case 'BooleanLiteral':
                return 'bool';
            case 'StringLiteral':
                return 'string';
            case 'Identifier':
                const symbol = this.symbolTable.resolve(expr.value);
                if (!symbol) {
                    this.error(`Identifier '${expr.value}' is not defined`, expr.token);
                    return 'unknown';
                }
                return symbol.type;
            case 'PrefixExpression':
                return this.checkPrefixExpression(expr);
            case 'InfixExpression':
                return this.checkInfixExpression(expr);
            default:
                return 'unknown';
        }
    }
    checkPrefixExpression(expr) {
        const rightType = this.checkExpression(expr.right);
        if (expr.operator === '!') {
            if (rightType !== 'bool') {
                this.error(`Operator '!' requires boolean operand, got '${rightType}'`, expr.token);
            }
            return 'bool';
        }
        else if (expr.operator === '-') {
            if (rightType !== 'int') {
                this.error(`Operator '-' requires integer operand, got '${rightType}'`, expr.token);
            }
            return 'int';
        }
        return 'unknown';
    }
    checkInfixExpression(expr) {
        const leftType = this.checkExpression(expr.left);
        const rightType = this.checkExpression(expr.right);
        if (leftType !== rightType) {
            this.error(`Type mismatch: '${leftType}' ${expr.operator} '${rightType}'`, expr.token);
            return 'unknown';
        }
        switch (expr.operator) {
            case '+':
                if (leftType === 'int')
                    return 'int';
                if (leftType === 'string')
                    return 'string'; // String concatenation
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
    error(msg, token) {
        this.errors.push(`${msg} at line ${token.line}, column ${token.column}`);
    }
}
exports.SemanticAnalyzer = SemanticAnalyzer;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenerator = void 0;
const ir_1 = require("../ir/ir");
class CodeGenerator {
    constructor() {
        this.ir = new ir_1.IRProgram();
    }
    generate(program) {
        this.ir = new ir_1.IRProgram();
        program.statements.forEach(stmt => this.genStatement(stmt));
        this.ir.add(ir_1.OpCode.HALT);
        return this.ir;
    }
    genStatement(stmt) {
        switch (stmt.type) {
            case 'VariableDeclaration':
                const varDecl = stmt;
                if (varDecl.value) {
                    this.genExpression(varDecl.value);
                    this.ir.add(ir_1.OpCode.STORE, varDecl.name.value);
                }
                break;
            case 'AssignmentStatement':
                const assign = stmt;
                this.genExpression(assign.value);
                this.ir.add(ir_1.OpCode.STORE, assign.name.value);
                break;
            case 'ExpressionStatement':
                this.genExpression(stmt.expression);
                // Pop result if it's an expression statement to keep stack clean? 
                // For now, let's assume expressions might leave values, but in this simple VM it's fine.
                break;
            case 'ConsoleWriteLine':
                const consoleStmt = stmt;
                this.genExpression(consoleStmt.expression);
                this.ir.add(ir_1.OpCode.PRINT);
                break;
            case 'BlockStatement':
                stmt.statements.forEach(s => this.genStatement(s));
                break;
            case 'IfStatement':
                this.genIfStatement(stmt);
                break;
            case 'WhileStatement':
                this.genWhileStatement(stmt);
                break;
        }
    }
    genIfStatement(stmt) {
        // 1. Evaluate condition
        this.genExpression(stmt.condition);
        // 2. Jump to Else/End if false
        const jumpToElseIndex = this.ir.instructions.length;
        this.ir.add(ir_1.OpCode.JZ, 0); // Placeholder
        // 3. Consequence
        this.genStatement(stmt.consequence);
        // 4. Jump to End (skip else)
        const jumpToEndIndex = this.ir.instructions.length;
        this.ir.add(ir_1.OpCode.JMP, 0); // Placeholder
        // 5. Patch jump to else
        this.ir.instructions[jumpToElseIndex].arg = this.ir.instructions.length;
        // 6. Else block
        if (stmt.alternative) {
            this.genStatement(stmt.alternative);
        }
        // 7. Patch jump to end
        this.ir.instructions[jumpToEndIndex].arg = this.ir.instructions.length;
    }
    genWhileStatement(stmt) {
        const loopStartIndex = this.ir.instructions.length;
        // 1. Evaluate condition
        this.genExpression(stmt.condition);
        // 2. Jump to End if false
        const jumpToEndIndex = this.ir.instructions.length;
        this.ir.add(ir_1.OpCode.JZ, 0); // Placeholder
        // 3. Body
        this.genStatement(stmt.body);
        // 4. Jump back to start
        this.ir.add(ir_1.OpCode.JMP, loopStartIndex);
        // 5. Patch jump to end
        this.ir.instructions[jumpToEndIndex].arg = this.ir.instructions.length;
    }
    genExpression(expr) {
        switch (expr.type) {
            case 'IntegerLiteral':
                this.ir.add(ir_1.OpCode.CONST, expr.value);
                break;
            case 'BooleanLiteral':
                // Convert boolean to number (1 for true, 0 for false)
                this.ir.add(ir_1.OpCode.CONST, expr.value ? 1 : 0);
                break;
            case 'StringLiteral':
                this.ir.add(ir_1.OpCode.CONST, expr.value);
                break;
            case 'Identifier':
                this.ir.add(ir_1.OpCode.LOAD, expr.value);
                break;
            case 'InfixExpression':
                this.genInfixExpression(expr);
                break;
            case 'PrefixExpression':
                this.genPrefixExpression(expr);
                break;
        }
    }
    genInfixExpression(expr) {
        this.genExpression(expr.left);
        this.genExpression(expr.right);
        switch (expr.operator) {
            case '+':
                this.ir.add(ir_1.OpCode.ADD);
                break;
            case '-':
                this.ir.add(ir_1.OpCode.SUB);
                break;
            case '*':
                this.ir.add(ir_1.OpCode.MUL);
                break;
            case '/':
                this.ir.add(ir_1.OpCode.DIV);
                break;
            case '<':
                this.ir.add(ir_1.OpCode.LT);
                break;
            case '>':
                this.ir.add(ir_1.OpCode.GT);
                break;
            case '==':
                this.ir.add(ir_1.OpCode.EQ);
                break;
            case '!=':
                this.ir.add(ir_1.OpCode.EQ);
                this.ir.add(ir_1.OpCode.NOT);
                break;
            // ... other operators
        }
    }
    genPrefixExpression(expr) {
        this.genExpression(expr.right);
        if (expr.operator === '-') {
            this.ir.add(ir_1.OpCode.CONST, -1);
            this.ir.add(ir_1.OpCode.MUL);
        }
        else if (expr.operator === '!') {
            this.ir.add(ir_1.OpCode.NOT);
        }
    }
}
exports.CodeGenerator = CodeGenerator;

import { IRProgram, Instruction, OpCode } from '../ir/ir';
import * as AST from '../parser/ast';

export class CodeGenerator {
    private ir: IRProgram;

    constructor() {
        this.ir = new IRProgram();
    }

    public generate(program: AST.Program): IRProgram {
        this.ir = new IRProgram();
        program.statements.forEach(stmt => this.genStatement(stmt));
        this.ir.add(OpCode.HALT);
        return this.ir;
    }

    private genStatement(stmt: AST.Statement) {
        switch (stmt.type) {
            case 'VariableDeclaration':
                const varDecl = stmt as AST.VariableDeclaration;
                if (varDecl.value) {
                    this.genExpression(varDecl.value);
                    this.ir.add(OpCode.STORE, varDecl.name.value);
                }
                break;
            case 'AssignmentStatement':
                const assign = stmt as AST.AssignmentStatement;
                this.genExpression(assign.value);
                this.ir.add(OpCode.STORE, assign.name.value);
                break;
            case 'ExpressionStatement':
                this.genExpression((stmt as AST.ExpressionStatement).expression);
                // Pop result if it's an expression statement to keep stack clean? 
                // For now, let's assume expressions might leave values, but in this simple VM it's fine.
                break;
            case 'ConsoleWriteLine':
                const consoleStmt = stmt as AST.ConsoleWriteLine;
                this.genExpression(consoleStmt.expression);
                this.ir.add(OpCode.PRINT);
                break;
            case 'BlockStatement':
                (stmt as AST.BlockStatement).statements.forEach(s => this.genStatement(s));
                break;
            case 'IfStatement':
                this.genIfStatement(stmt as AST.IfStatement);
                break;
            case 'WhileStatement':
                this.genWhileStatement(stmt as AST.WhileStatement);
                break;
        }
    }

    private genIfStatement(stmt: AST.IfStatement) {
        // 1. Evaluate condition
        this.genExpression(stmt.condition);

        // 2. Jump to Else/End if false
        const jumpToElseIndex = this.ir.instructions.length;
        this.ir.add(OpCode.JZ, 0); // Placeholder

        // 3. Consequence
        this.genStatement(stmt.consequence);

        // 4. Jump to End (skip else)
        const jumpToEndIndex = this.ir.instructions.length;
        this.ir.add(OpCode.JMP, 0); // Placeholder

        // 5. Patch jump to else
        this.ir.instructions[jumpToElseIndex].arg = this.ir.instructions.length;

        // 6. Else block
        if (stmt.alternative) {
            this.genStatement(stmt.alternative);
        }

        // 7. Patch jump to end
        this.ir.instructions[jumpToEndIndex].arg = this.ir.instructions.length;
    }

    private genWhileStatement(stmt: AST.WhileStatement) {
        const loopStartIndex = this.ir.instructions.length;

        // 1. Evaluate condition
        this.genExpression(stmt.condition);

        // 2. Jump to End if false
        const jumpToEndIndex = this.ir.instructions.length;
        this.ir.add(OpCode.JZ, 0); // Placeholder

        // 3. Body
        this.genStatement(stmt.body);

        // 4. Jump back to start
        this.ir.add(OpCode.JMP, loopStartIndex);

        // 5. Patch jump to end
        this.ir.instructions[jumpToEndIndex].arg = this.ir.instructions.length;
    }

    private genExpression(expr: AST.Expression) {
        switch (expr.type) {
            case 'IntegerLiteral':
                this.ir.add(OpCode.CONST, (expr as AST.IntegerLiteral).value);
                break;
            case 'BooleanLiteral':
                // Convert boolean to number (1 for true, 0 for false)
                this.ir.add(OpCode.CONST, (expr as AST.BooleanLiteral).value ? 1 : 0);
                break;
            case 'StringLiteral':
                this.ir.add(OpCode.CONST, (expr as AST.StringLiteral).value);
                break;
            case 'Identifier':
                this.ir.add(OpCode.LOAD, (expr as AST.Identifier).value);
                break;
            case 'InfixExpression':
                this.genInfixExpression(expr as AST.InfixExpression);
                break;
            case 'PrefixExpression':
                this.genPrefixExpression(expr as AST.PrefixExpression);
                break;
        }
    }

    private genInfixExpression(expr: AST.InfixExpression) {
        this.genExpression(expr.left);
        this.genExpression(expr.right);

        switch (expr.operator) {
            case '+': this.ir.add(OpCode.ADD); break;
            case '-': this.ir.add(OpCode.SUB); break;
            case '*': this.ir.add(OpCode.MUL); break;
            case '/': this.ir.add(OpCode.DIV); break;
            case '<': this.ir.add(OpCode.LT); break;
            case '>': this.ir.add(OpCode.GT); break;
            case '==': this.ir.add(OpCode.EQ); break;
            case '!=':
                this.ir.add(OpCode.EQ);
                this.ir.add(OpCode.NOT);
                break;
            // ... other operators
        }
    }

    private genPrefixExpression(expr: AST.PrefixExpression) {
        this.genExpression(expr.right);
        if (expr.operator === '-') {
            this.ir.add(OpCode.CONST, -1);
            this.ir.add(OpCode.MUL);
        } else if (expr.operator === '!') {
            this.ir.add(OpCode.NOT);
        }
    }
}

import { IRProgram } from '../ir/ir';
import * as AST from '../parser/ast';
export declare class CodeGenerator {
    private ir;
    constructor();
    generate(program: AST.Program): IRProgram;
    private genStatement;
    private genIfStatement;
    private genWhileStatement;
    private genExpression;
    private genInfixExpression;
    private genPrefixExpression;
}

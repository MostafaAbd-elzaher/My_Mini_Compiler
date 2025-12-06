import { IRProgram, OpCode, Instruction } from '../ir/ir';

export class Optimizer {
    public optimize(ir: IRProgram): IRProgram {
        let optimized = this.constantFolding(ir);
        optimized = this.deadCodeElimination(optimized);
        return optimized;
    }

    private constantFolding(ir: IRProgram): IRProgram {
        const newIr = new IRProgram();
        const insts = ir.instructions;

        for (let i = 0; i < insts.length; i++) {
            const curr = insts[i];

            // Simple peephole optimization for: CONST a, CONST b, ADD -> CONST (a+b)
            if (i + 2 < insts.length) {
                const next = insts[i + 1];
                const op = insts[i + 2];

                if (curr.op === OpCode.CONST && typeof curr.arg === 'number' &&
                    next.op === OpCode.CONST && typeof next.arg === 'number') {

                    let folded = false;
                    let result = 0;

                    if (op.op === OpCode.ADD) {
                        result = curr.arg + next.arg;
                        folded = true;
                    } else if (op.op === OpCode.SUB) {
                        result = curr.arg - next.arg;
                        folded = true;
                    } else if (op.op === OpCode.MUL) {
                        result = curr.arg * next.arg;
                        folded = true;
                    }

                    if (folded) {
                        newIr.add(OpCode.CONST, result, 'folded');
                        i += 2; // Skip next two instructions
                        continue;
                    }
                }
            }
            newIr.instructions.push(curr);
        }
        return newIr;
    }

    private deadCodeElimination(ir: IRProgram): IRProgram {
        const newIr = new IRProgram();
        const insts = ir.instructions;
        let afterReturn = false;

        for (let i = 0; i < insts.length; i++) {
            const curr = insts[i];

            if (afterReturn) {
                // If we hit a label or function start, we stop skipping (simplified view)
                // For this simple IR, we'll just assume code after RET is dead until we see a label?
                // Actually, without labels in this simple IR struct, it's hard to be perfect.
                // Let's just remove instructions immediately following a RET or JMP until the end of block?
                // For safety in this simple version, let's only remove if it's obviously dead (e.g. RET followed by arithmetic)
                // But we need to be careful about jump targets.
                // Let's skip this for now to avoid breaking jumps.
            }

            newIr.instructions.push(curr);

            if (curr.op === OpCode.RET) {
                // afterReturn = true; 
            }
        }
        return newIr;
    }
}

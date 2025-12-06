import { IRProgram } from '../ir/ir';
export declare class Optimizer {
    optimize(ir: IRProgram): IRProgram;
    private constantFolding;
    private deadCodeElimination;
}

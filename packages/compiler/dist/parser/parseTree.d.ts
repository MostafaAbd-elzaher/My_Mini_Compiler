/**
 * Parse Tree Node - Represents a node in the concrete syntax tree (parsing tree)
 * Unlike AST nodes, parse tree nodes maintain the full parsing structure
 * including all grammar rules and terminals.
 */
export interface ParseTreeNode {
    /** The type/rule name of this node (e.g., "Program", "IfStatement", "Expression") */
    label: string;
    /** The value/content if this is a terminal node (e.g., "42", "x", "+") */
    value?: string;
    /** Child nodes - empty for terminal nodes */
    children: ParseTreeNode[];
    /** Whether this is a terminal (leaf) node */
    isTerminal: boolean;
    /** Token type if this is a terminal */
    tokenType?: string;
    /** Line number in source code */
    line?: number;
    /** Column number in source code */
    column?: number;
}
/**
 * Creates a non-terminal parse tree node
 */
export declare function createNonTerminal(label: string, children: ParseTreeNode[]): ParseTreeNode;
/**
 * Creates a terminal parse tree node (leaf)
 */
export declare function createTerminal(label: string, value: string, tokenType?: string, line?: number, column?: number): ParseTreeNode;
/**
 * Converts a parse tree to a formatted string representation
 */
export declare function parseTreeToString(node: ParseTreeNode, indent?: string, isLast?: boolean): string;
/**
 * Converts a parse tree to a JSON-serializable object for visualization
 */
export declare function parseTreeToJSON(node: ParseTreeNode): any;

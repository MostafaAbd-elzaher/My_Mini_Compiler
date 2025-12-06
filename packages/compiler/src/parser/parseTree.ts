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
export function createNonTerminal(label: string, children: ParseTreeNode[]): ParseTreeNode {
    return {
        label,
        children,
        isTerminal: false
    };
}

/**
 * Creates a terminal parse tree node (leaf)
 */
export function createTerminal(
    label: string, 
    value: string, 
    tokenType?: string,
    line?: number,
    column?: number
): ParseTreeNode {
    return {
        label,
        value,
        children: [],
        isTerminal: true,
        tokenType,
        line,
        column
    };
}

/**
 * Converts a parse tree to a formatted string representation
 */
export function parseTreeToString(node: ParseTreeNode, indent: string = '', isLast: boolean = true): string {
    const prefix = indent + (isLast ? '└── ' : '├── ');
    const childIndent = indent + (isLast ? '    ' : '│   ');
    
    let result = prefix;
    
    if (node.isTerminal) {
        result += `[${node.label}] "${node.value}"`;
        if (node.tokenType) {
            result += ` (${node.tokenType})`;
        }
    } else {
        result += `<${node.label}>`;
    }
    
    result += '\n';
    
    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const isLastChild = i === node.children.length - 1;
        result += parseTreeToString(child, childIndent, isLastChild);
    }
    
    return result;
}

/**
 * Converts a parse tree to a JSON-serializable object for visualization
 */
export function parseTreeToJSON(node: ParseTreeNode): any {
    return {
        name: node.isTerminal ? `${node.label}: ${node.value}` : node.label,
        label: node.label,
        value: node.value,
        isTerminal: node.isTerminal,
        tokenType: node.tokenType,
        line: node.line,
        column: node.column,
        children: node.children.map(parseTreeToJSON)
    };
}

import React from 'react';

interface ParseTreeNodeData {
    name: string;
    label: string;
    value?: string;
    isTerminal: boolean;
    tokenType?: string;
    line?: number;
    column?: number;
    children: ParseTreeNodeData[];
}

interface StageVisualizerProps {
    tokens: any[];
    ast: string;
    parseTree: ParseTreeNodeData | null;
    symbolTable: any;
    bytecode: string;
    output: string[];
    activeStage: 'lexical' | 'syntax' | 'semantic' | 'codegen' | 'output';
    onStageChange: (stage: 'lexical' | 'syntax' | 'semantic' | 'codegen' | 'output') => void;
}

// TreeNode Component for rendering parse tree
const TreeNode: React.FC<{ node: ParseTreeNodeData; depth?: number; isLast?: boolean }> = ({
    node,
    depth = 0,
    isLast = true
}) => {
    const [isExpanded, setIsExpanded] = React.useState(true);
    const hasChildren = node.children && node.children.length > 0;

    const getNodeColor = () => {
        if (node.isTerminal) {
            // Different colors for different terminal types
            if (node.tokenType === 'IDENTIFIER') return '#60a5fa';
            if (node.tokenType?.includes('LITERAL') || ['INTEGER_LITERAL', 'STRING_LITERAL', 'TRUE', 'FALSE'].includes(node.tokenType || '')) return '#22c55e';
            if (['PLUS', 'MINUS', 'ASTERISK', 'SLASH', 'EQ', 'NEQ', 'LT', 'GT', 'LTE', 'GTE', 'AND', 'OR', 'ASSIGN'].includes(node.tokenType || '')) return '#fbbf24';
            if (['IF', 'ELSE', 'WHILE', 'INT', 'BOOL', 'STRING', 'CONSOLE', 'WRITELINE'].includes(node.tokenType || '')) return '#f472b6';
            return '#94a3b8';
        }
        return '#a855f7'; // Non-terminal color
    };

    return (
        <div style={{
            marginLeft: depth > 0 ? '1.5rem' : 0,
            position: 'relative'
        }}>
            {/* Connector lines */}
            {depth > 0 && (
                <div style={{
                    position: 'absolute',
                    left: '-1rem',
                    top: '0.75rem',
                    width: '0.75rem',
                    height: '1px',
                    backgroundColor: '#475569'
                }} />
            )}

            {/* Node content */}
            <div
                onClick={() => hasChildren && setIsExpanded(!isExpanded)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    cursor: hasChildren ? 'pointer' : 'default',
                    backgroundColor: 'transparent',
                    transition: 'background-color 0.2s',
                    marginBottom: '0.25rem'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1e293b';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                }}
            >
                {/* Expand/collapse icon */}
                {hasChildren && (
                    <span style={{
                        color: '#64748b',
                        fontSize: '0.75rem',
                        width: '1rem',
                        textAlign: 'center'
                    }}>
                        {isExpanded ? '▼' : '▶'}
                    </span>
                )}
                {!hasChildren && <span style={{ width: '1rem' }} />}

                {/* Node type indicator */}
                <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '1.25rem',
                    height: '1.25rem',
                    borderRadius: node.isTerminal ? '50%' : '0.25rem',
                    backgroundColor: node.isTerminal ? '#1e3a5f' : '#3b1e5f',
                    fontSize: '0.625rem',
                    color: getNodeColor()
                }}>
                    {node.isTerminal ? 'T' : 'N'}
                </span>

                {/* Node label */}
                <span style={{
                    color: getNodeColor(),
                    fontWeight: node.isTerminal ? 400 : 600,
                    fontSize: '0.875rem'
                }}>
                    {node.label}
                </span>

                {/* Value for terminals */}
                {node.isTerminal && node.value && (
                    <span style={{
                        color: '#cbd5e1',
                        fontSize: '0.8rem',
                        backgroundColor: '#0f172a',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '0.25rem',
                        border: '1px solid #334155'
                    }}>
                        "{node.value}"
                    </span>
                )}

                {/* Token type badge */}
                {node.tokenType && (
                    <span style={{
                        fontSize: '0.625rem',
                        color: '#64748b',
                        backgroundColor: '#1e293b',
                        padding: '0.125rem 0.375rem',
                        borderRadius: '0.25rem'
                    }}>
                        {node.tokenType}
                    </span>
                )}
            </div>

            {/* Children */}
            {hasChildren && isExpanded && (
                <div style={{
                    borderLeft: '1px solid #475569',
                    marginLeft: '0.5rem',
                    paddingLeft: '0.5rem'
                }}>
                    {node.children.map((child, index) => (
                        <TreeNode
                            key={index}
                            node={child}
                            depth={depth + 1}
                            isLast={index === node.children.length - 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const StageVisualizer: React.FC<StageVisualizerProps> = ({
    tokens,
    ast,
    parseTree,
    symbolTable,
    bytecode,
    output,
    activeStage,
    onStageChange,
}) => {
    const stages = [
        { id: 'lexical' as const, label: 'Lexical', icon: '', color: '#3b82f6' },
        { id: 'syntax' as const, label: 'Syntax', icon: '', color: '#a855f7' },
        { id: 'semantic' as const, label: 'Semantic', icon: '', color: '#22c55e' },
        { id: 'codegen' as const, label: 'Code Gen', icon: '', color: '#f97316' },
        { id: 'output' as const, label: 'Output', icon: '', color: '#ef4444' },
    ];

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s'
        }}>
            {/* Stage Tabs */}
            <div style={{
                display: 'flex',
                borderBottom: '1px solid #334155',
                backgroundColor: '#0f172a',
                overflowX: 'auto'
            }}>
                {stages.map((stage) => (
                    <button
                        key={stage.id}
                        onClick={() => onStageChange(stage.id)}
                        style={{
                            padding: '0.75rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: activeStage === stage.id ? '#1e293b' : 'transparent',
                            color: activeStage === stage.id ? '#60a5fa' : '#64748b',
                            borderBottom: activeStage === stage.id ? `2px solid ${stage.color}` : '2px solid transparent',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                        onMouseEnter={(e) => {
                            if (activeStage !== stage.id) {
                                e.currentTarget.style.color = '#cbd5e1';
                                e.currentTarget.style.backgroundColor = '#0f172a';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeStage !== stage.id) {
                                e.currentTarget.style.color = '#64748b';
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }
                        }}
                    >
                        <span style={{ fontSize: '1rem' }}>{stage.icon}</span>
                        {stage.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div style={{
                flex: 1,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Content */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '1.5rem',
                    fontFamily: "'Fira Code', 'Courier New', monospace",
                    fontSize: '0.875rem',
                    color: '#cbd5e1'
                }}>
                    {activeStage === 'lexical' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {tokens.length === 0 ? (
                                <div style={{ color: '#64748b', fontStyle: 'italic' }}>
                                    No tokens generated
                                </div>
                            ) : (
                                tokens.map((token, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            padding: '0.625rem',
                                            backgroundColor: '#0f172a',
                                            borderRadius: '0.25rem',
                                            border: '1px solid #334155'
                                        }}
                                    >
                                        <span style={{
                                            color: '#60a5fa',
                                            fontWeight: 600,
                                            minWidth: '6rem'
                                        }}>
                                            {token.type}
                                        </span>
                                        <span style={{ color: '#cbd5e1', flex: 1 }}>
                                            {`"${token.literal}"`}
                                        </span>
                                        <span style={{ color: '#22c55e' }}>✓</span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeStage === 'syntax' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {parseTree ? (
                                <div style={{
                                    backgroundColor: '#0f172a',
                                    borderRadius: '0.5rem',
                                    padding: '1rem',
                                    border: '1px solid #334155'
                                }}>
                                    <h3 style={{
                                        color: '#fdfdfdff',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        margin: '0 0 1rem 0',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        Parse Tree
                                    </h3>
                                    <div style={{ overflowX: 'auto' }}>
                                        <TreeNode node={parseTree} />
                                    </div>
                                </div>
                            ) : (
                                <div style={{ color: '#64748b', fontStyle: 'italic' }}>
                                    Compile code to see parse tree...
                                </div>
                            )}

                            {ast && (
                                <div style={{
                                    backgroundColor: '#0f172a',
                                    borderRadius: '0.5rem',
                                    padding: '1rem',
                                    border: '1px solid #334155',
                                    marginTop: '1rem'
                                }}>
                                    <h3 style={{
                                        color: '#a855f7',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        margin: '0 0 0.5rem 0',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        AST String Representation
                                    </h3>
                                    <pre style={{
                                        color: '#d8b4fe',
                                        margin: 0,
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        fontSize: '0.8rem'
                                    }}>
                                        {ast}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}

                    {activeStage === 'semantic' && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            padding: '0.5rem'
                        }}>
                            {symbolTable ? (
                                <>
                                    <div>
                                        <h3 style={{
                                            color: '#22c55e',
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            margin: '0 0 0.5rem 0',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            Defined Symbols
                                        </h3>
                                        {symbolTable.getAllSymbols && symbolTable.getAllSymbols().length > 0 ? (
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                                gap: '0.5rem'
                                            }}>
                                                {symbolTable.getAllSymbols().map((symbol: any, idx: number) => (
                                                    <div key={idx} style={{
                                                        padding: '0.5rem',
                                                        backgroundColor: '#1e293b',
                                                        border: '1px solid #334155',
                                                        borderRadius: '0.375rem',
                                                        fontSize: '0.75rem'
                                                    }}>
                                                        <div style={{ color: '#60a5fa', fontWeight: 600 }}>
                                                            {symbol.name}
                                                        </div>
                                                        <div style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
                                                            Type: <span style={{ color: '#fbbf24' }}>{symbol.type}</span>
                                                        </div>
                                                        <div style={{ color: '#94a3b8' }}>
                                                            Kind: <span style={{ color: '#a78bfa' }}>{symbol.kind}</span>
                                                        </div>
                                                        <div style={{ color: '#94a3b8' }}>
                                                            Scope: <span style={{ color: '#22c55e' }}>{symbol.scopeLevel}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ color: '#64748b', fontStyle: 'italic' }}>
                                                No symbols defined
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 style={{
                                            color: '#22c55e',
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            margin: '0 0 0.5rem 0',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            Scope Information
                                        </h3>
                                        {symbolTable.getScopeLevels && (
                                            <div style={{
                                                padding: '0.5rem',
                                                backgroundColor: '#1e293b',
                                                border: '1px solid #334155',
                                                borderRadius: '0.375rem',
                                                fontSize: '0.875rem',
                                                color: '#94a3b8'
                                            }}>
                                                <span style={{ color: '#60a5fa', fontWeight: 600 }}>
                                                    Total Scopes:
                                                </span>
                                                {' '}
                                                <span style={{ color: '#fbbf24' }}>
                                                    {symbolTable.getScopeLevels()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div style={{ color: '#64748b', fontStyle: 'italic' }}>
                                    Compile code to see symbol table...
                                </div>
                            )}
                        </div>
                    )}

                    {activeStage === 'codegen' && (
                        <pre style={{
                            color: '#fed7aa',
                            margin: 0,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                        }}>
                            {bytecode || 'No bytecode generated'}
                        </pre>
                    )}

                    {activeStage === 'output' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {output.length === 0 ? (
                                <span style={{ color: '#64748b', fontStyle: 'italic' }}>No output</span>
                            ) : (
                                output.map((line, i) => (
                                    <div key={i} style={{ color: '#22c55e' }}>
                                        <span style={{ color: '#64748b' }}>{'> '}</span>
                                        {line}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import {
    Zap,
    Play,
    SkipForward,
    RefreshCw,
    Save,
    Download,
} from 'lucide-react';

interface ControlsProps {
    onCompile: () => void;
    onRun: () => void;
    onStep: () => void;
    onReset: () => void;
    onSave: () => void;
    onExport: () => void;
    isCompiling: boolean;
    isRunning: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
    onCompile,
    onRun,
    onStep,
    onReset,
    onSave,
    onExport,
    isCompiling,
    isRunning,
}) => {
    const buttonStyle = (bgColor: string): React.CSSProperties => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.625rem 1rem',
        borderRadius: '0.5rem',
        fontWeight: 500,
        transition: 'all 0.2s',
        border: 'none',
        cursor: isCompiling || isRunning ? 'not-allowed' : 'pointer',
        opacity: (isCompiling || isRunning) ? 0.5 : 1,
        backgroundColor: bgColor,
        color: 'white'
    });

    return (
        <div style={{
            backgroundColor: '#1e293b',
            borderBottom: '1px solid #334155',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s'
        }}>
            <div style={{
                padding: '0.75rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                {/* Primary Controls */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <button
                        onClick={onCompile}
                        disabled={isCompiling || isRunning}
                        style={buttonStyle('#2563eb')}
                        title="Compile the code (Ctrl+Shift+B)"
                        onMouseEnter={(e) => !isCompiling && !isRunning && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                    >
                        <Zap size={18} />
                        <span>Compile</span>
                    </button>

                    <button
                        onClick={onRun}
                        disabled={isRunning}
                        style={buttonStyle('#16a34a')}
                        title="Run the compiled code (Ctrl+Enter)"
                        onMouseEnter={(e) => !isRunning && (e.currentTarget.style.backgroundColor = '#15803d')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#16a34a')}
                    >
                        <Play size={18} />
                        <span>Run</span>
                    </button>

                    <button
                        onClick={onStep}
                        style={buttonStyle('#d97706')}
                        title="Step through execution (F10)"
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b45309')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#d97706')}
                    >
                        <SkipForward size={18} />
                        <span>Step</span>
                    </button>

                    <button
                        onClick={onReset}
                        style={buttonStyle('#475569')}
                        title="Reset all (Ctrl+R)"
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#374151')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#475569')}
                    >
                        <RefreshCw size={18} />
                        <span>Reset</span>
                    </button>
                </div>

                {/* Secondary Controls */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <button
                        onClick={onSave}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0.625rem 0.75rem',
                            borderRadius: '0.5rem',
                            backgroundColor: '#334155',
                            color: '#cbd5e1',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        title="Save code"
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#475569')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#334155')}
                    >
                        <Save size={16} />
                    </button>

                    <button
                        onClick={onExport}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0.625rem 0.75rem',
                            borderRadius: '0.5rem',
                            backgroundColor: '#334155',
                            color: '#cbd5e1',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        title="Export code"
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#475569')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#334155')}
                    >
                        <Download size={16} />
                    </button>
                </div>
            </div>

            {/* Status Bar */}
            <div style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#0f172a',
                borderTop: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: '#94a3b8'
            }}>
                <div style={{
                    display: 'flex',
                    gap: '1rem'
                }}>
                    {isCompiling && (
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.375rem'
                        }}>
                            <span style={{
                                display: 'inline-block',
                                width: '0.5rem',
                                height: '0.5rem',
                                backgroundColor: '#3b82f6',
                                borderRadius: '50%',
                                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                            }}></span>
                            Compiling...
                        </span>
                    )}
                    {isRunning && (
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.375rem'
                        }}>
                            <span style={{
                                display: 'inline-block',
                                width: '0.5rem',
                                height: '0.5rem',
                                backgroundColor: '#22c55e',
                                borderRadius: '50%',
                                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                            }}></span>
                            Running...
                        </span>
                    )}
                    {!isCompiling && !isRunning && (
                        <span style={{ color: '#64748b' }}>Ready</span>
                    )}
                </div>
                <span>v1.0.0</span>
            </div>
        </div>
    );
};

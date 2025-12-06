import React, { useState } from 'react';

interface OutputTabsProps {
    ast: string;
    ir: string;
    bytecode: string;
    output: string[];
    errors: string[];
}

export const OutputTabs: React.FC<OutputTabsProps> = ({
    ast,
    ir,
    bytecode,
    output,
    errors,
}) => {
    const [activeTab, setActiveTab] = useState<'console' | 'ast' | 'ir' | 'bytecode' | 'diagnostics'>('console');

    const tabs = [
        { id: 'console', label: 'Console' },
        { id: 'diagnostics', label: `Diagnostics (${errors.length})` },
        { id: 'ast', label: 'AST' },
        { id: 'ir', label: 'IR' },
        { id: 'bytecode', label: 'Bytecode' },
    ];

    return (
        <div className="flex flex-col h-full bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-lg">
            <div className="flex border-b border-slate-700 bg-slate-800">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-slate-700 text-white border-b-2 border-blue-500'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="flex-1 overflow-auto p-4 font-mono text-sm">
                {activeTab === 'console' && (
                    <div className="space-y-1">
                        {output.length === 0 ? (
                            <span className="text-slate-500 italic">No output</span>
                        ) : (
                            output.map((line, i) => (
                                <div key={i} className="text-green-400">
                                    {'> '}{line}
                                </div>
                            ))
                        )}
                    </div>
                )}
                {activeTab === 'diagnostics' && (
                    <div className="space-y-1">
                        {errors.length === 0 ? (
                            <span className="text-green-500 italic">No errors found.</span>
                        ) : (
                            errors.map((err, i) => (
                                <div key={i} className="text-red-400">
                                    {err}
                                </div>
                            ))
                        )}
                    </div>
                )}
                {activeTab === 'ast' && (
                    <pre className="text-blue-300">{ast || 'No AST generated'}</pre>
                )}
                {activeTab === 'ir' && (
                    <pre className="text-purple-300">{ir || 'No IR generated'}</pre>
                )}
                {activeTab === 'bytecode' && (
                    <pre className="text-orange-300">{bytecode || 'No Bytecode generated'}</pre>
                )}
            </div>
        </div>
    );
};

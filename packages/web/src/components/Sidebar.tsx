import React, { useState } from 'react';
import { Code, BookOpen, History, ChevronDown } from 'lucide-react';

interface SidebarProps {
    onLoadTemplate: (code: string) => void;
}

interface CodeTemplate {
    name: string;
    description: string;
    code: string;
}

const TEMPLATES: CodeTemplate[] = [
    {
        name: 'Hello World',
        description: 'Simple output',
        code: `Console.WriteLine("Hello, World!");`,
    },
    {
        name: 'Basic Arithmetic',
        description: 'Math operations',
        code: `int a = 10;
int b = 20;
int sum = a + b;
int product = a * b;
Console.WriteLine(sum);
Console.WriteLine(product);`,
    },
    {
        name: 'Conditionals',
        description: 'if/else statements',
        code: `int age = 20;

if (age >= 18) {
    Console.WriteLine("You are an adult");
} else {
    Console.WriteLine("You are a minor");
}`,
    },
    {
        name: 'Loops',
        description: 'for loops',
        code: `for (int i = 0; i < 5; i = i + 1) {
    Console.WriteLine(i);
}`,
    },
    {
        name: 'Variables & Types',
        description: 'Type declarations',
        code: `int x = 42;
float y = 3.14;
string name = "CSharp Compiler";

Console.WriteLine(x);
Console.WriteLine(y);
Console.WriteLine(name);`,
    },
];

export const Sidebar: React.FC<SidebarProps> = ({ onLoadTemplate }) => {
    const [expandedSection, setExpandedSection] = useState<string | null>('templates');

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <aside style={{
            width: '18rem',
            backgroundColor: '#0f172a',
            borderRight: '1px solid #334155',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #334155' }}>
                    <button
                        onClick={() => toggleSection('templates')}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.5rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1e293b')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <BookOpen size={18} color="#3b82f6" />
                            <span style={{ fontWeight: 600, color: '#f1f5f9' }}>Templates</span>
                        </div>
                        <ChevronDown size={18} color="#64748b" style={{
                            transition: 'transform 0.3s',
                            transform: expandedSection === 'templates' ? 'rotate(180deg)' : 'rotate(0deg)'
                        }} />
                    </button>

                    {expandedSection === 'templates' && (
                        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {TEMPLATES.map((template, idx) => (
                                <button key={idx} onClick={() => onLoadTemplate(template.code)}
                                    style={{
                                        textAlign: 'left',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        backgroundColor: '#1e293b',
                                        border: '1px solid #334155',
                                        color: '#f1f5f9',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
                                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#334155')}
                                >
                                    <p style={{ fontWeight: 500, color: '#f1f5f9', fontSize: '0.875rem', margin: 0, marginBottom: '0.25rem' }}>
                                        {template.name}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                                        {template.description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ padding: '1rem', borderBottom: '1px solid #334155' }}>
                    <button
                        onClick={() => toggleSection('history')}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.5rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1e293b')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <History size={18} color="#a855f7" />
                            <span style={{ fontWeight: 600, color: '#f1f5f9' }}>History</span>
                        </div>
                        <ChevronDown size={18} color="#64748b" style={{
                            transition: 'transform 0.3s',
                            transform: expandedSection === 'history' ? 'rotate(180deg)' : 'rotate(0deg)'
                        }} />
                    </button>

                    {expandedSection === 'history' && (
                        <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#1e293b', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>No history yet</p>
                        </div>
                    )}
                </div>

                <div style={{ padding: '1rem' }}>
                    <button
                        onClick={() => toggleSection('info')}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.5rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1e293b')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Code size={18} color="#22c55e" />
                            <span style={{ fontWeight: 600, color: '#f1f5f9' }}>Quick Info</span>
                        </div>
                        <ChevronDown size={18} color="#64748b" style={{
                            transition: 'transform 0.3s',
                            transform: expandedSection === 'info' ? 'rotate(180deg)' : 'rotate(0deg)'
                        }} />
                    </button>

                    {expandedSection === 'info' && (
                        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                            <div style={{ padding: '0.5rem', backgroundColor: '#1e293b', borderRadius: '0.25rem' }}>
                                <p style={{ fontWeight: 500, color: '#f1f5f9', margin: 0, marginBottom: '0.25rem' }}>Compile Process</p>
                                <p style={{ margin: 0 }}>1. Lexical → 2. Syntax → 3. Semantic → 4. CodeGen → 5. Run</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>


        </aside>
    );
};

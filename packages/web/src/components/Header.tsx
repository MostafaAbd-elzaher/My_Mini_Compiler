import React from 'react';

export const Header: React.FC = () => {
    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 40,
            borderBottom: `1px solid #334155`,
            backgroundColor: '#0f172a',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s'
        }}>
            <div style={{
                padding: '1rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                {/* Left spacer for balance */}
                <div style={{ flex: 1 }}></div>

                {/* Center - Title */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 2
                }}>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: '#f1f5f9',
                        margin: 0
                    }}>
                        CSharp Compiler
                    </h1>
                    <p style={{
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        fontWeight: 500,
                        margin: '0.25rem 0 0 0'
                    }}>
                        عَلى قَدرِ أَهلِ العَزمِ تَأتي العَزائِمُ        وَتَأتي عَلى قَدرِ الكِرامِ المَكارِمُ
                    </p>
                </div>

                {/* Right - Credits */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'center'
                }}>
                    <span style={{
                        fontSize: '0.875rem',
                        color: '#64748b',
                        fontWeight: 500,
                        fontStyle: 'italic'
                    }}>
                        made by mostafa abdelzaher
                    </span>
                    <span style={{
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        fontWeight: 500,
                        marginTop: '0.25rem'
                    }}>
                        اللهم صلى وسلم على نبينا محمد
                    </span>
                </div>
            </div>
        </header>
    );
};

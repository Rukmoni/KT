import { useState } from 'react';
import { useLeadStore } from '../store/leadStore';
import { sendEmail } from '../services/emailService';

export const AdminLeads = () => {
    const { leads, clearLeads } = useLeadStore();
    const [testStatus, setTestStatus] = useState<'idle' | 'sending' | 'ok' | 'fail'>('idle');

    const sendTestEmail = async () => {
        setTestStatus('sending');
        const ok = await sendEmail({
            toEmail: 'kuvanta.tech@gmail.com',
            ccEmail: '',
            subject: 'TEST EMAIL — Kuvanta Portal Integration Verified',
            body: `Dear Kuvanta Tech Sales Support Team,\n\nThis is a test email confirming the EmailJS integration is working correctly on the Kuvanta portal.\n\nDate/Time: ${new Date().toLocaleString()}\n\nAction: No action required — this is an automated test.\n\nRegards,\nKuvanta AI Support System`
        });
        setTestStatus(ok ? 'ok' : 'fail');
        setTimeout(() => setTestStatus('idle'), 5000);
    };

    return (
        <div style={{ padding: '60px 40px', background: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Sales &amp; Leads Dashboard</h1>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button
                            onClick={sendTestEmail}
                            disabled={testStatus === 'sending'}
                            style={{
                                background: testStatus === 'ok' ? '#22c55e' : testStatus === 'fail' ? '#ef4444' : 'linear-gradient(135deg, #7b5fff, #00c8ff)',
                                color: 'white', border: 'none', padding: '10px 20px',
                                borderRadius: '8px', cursor: testStatus === 'sending' ? 'wait' : 'pointer',
                                fontWeight: 'bold', transition: 'all 0.3s',
                                boxShadow: testStatus === 'ok' ? '0 0 12px rgba(34,197,94,0.5)' : '0 4px 14px rgba(123,95,255,0.4)'
                            }}
                        >
                            {testStatus === 'sending' ? '⏳ Sending...' : testStatus === 'ok' ? '✅ Email Sent!' : testStatus === 'fail' ? '❌ Failed' : '📧 Send Test Email'}
                        </button>
                        <button
                            onClick={clearLeads}
                            style={{ background: '#ff3b3b', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Clear All Leads
                        </button>
                    </div>
                </div>

                <p style={{ color: '#aaa', marginBottom: '40px' }}>All inquiries from the Chatbot and Contact Form are safely stored and logged here.</p>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                    {leads.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', background: '#111', borderRadius: '16px', border: '1px solid #222' }}>
                            <p style={{ color: '#888' }}>No leads have been captured yet.</p>
                        </div>
                    ) : null}

                    {leads.map(lead => (
                        <div key={lead.id} style={{ border: '1px solid rgba(164, 130, 255, 0.2)', padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#a482ff' }}>{lead.name}</h3>
                                <span style={{ background: lead.source === 'Chatbot' ? '#6231ff' : '#0051ff', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 'bold' }}>
                                    {lead.source}
                                </span>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', fontSize: '14px', color: '#ddd' }}>
                                <div><strong>Email:</strong> <a href={`mailto:${lead.email}`} style={{ color: '#00f0ff' }}>{lead.email}</a></div>
                                <div><strong>Phone:</strong> {lead.phone || 'N/A'}</div>
                                <div><strong>Service Required:</strong> {lead.serviceType}</div>
                                <div><strong>Date Captured:</strong> {lead.date}</div>
                            </div>
                            
                            <hr style={{ margin: '16px 0', borderColor: 'rgba(255,255,255,0.1)' }} />
                            
                            <p style={{ fontSize: '15px', lineHeight: '1.5', color: '#eee', marginBottom: '16px' }}>
                                <strong>AI Summary:</strong> {lead.summary}
                            </p>
                            
                            <details style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                               <summary style={{ cursor: 'pointer', color: '#a482ff', padding: '12px', fontWeight: '500', outline: 'none' }}>View Detailed Transcript / Minutes</summary>
                               <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                   <pre style={{ fontFamily: 'inherit', fontSize: '13px', whiteSpace: 'pre-wrap', color: '#ccc', lineHeight: '1.6' }}>
                                       {lead.fullTranscript}
                                   </pre>
                               </div>
                            </details>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

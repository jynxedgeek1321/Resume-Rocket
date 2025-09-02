import React, { useState } from 'react';

export default function Chat() {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<{ from: 'user' | 'bot'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!value.trim()) return;
    const userMessage = value.trim();
    setMessages(prev => [...prev, { from: 'user', text: userMessage }]);
    setValue('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { from: 'bot', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { from: 'bot', text: `Error: ${data.error || 'Unknown'}` }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { from: 'bot', text: 'Network error' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1>Resume Rocket — Assistant</h1>
      <div style={{ border: '1px solid #ddd', padding: 12, minHeight: 200, overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.from === 'user' ? 'right' : 'left', margin: '8px 0' }}>
            <div style={{ display: 'inline-block', background: m.from === 'user' ? '#DCF8C6' : '#F1F0F0', padding: 8, borderRadius: 8 }}>
              {m.text}
            </div>
          </div>
        ))}
        {messages.length === 0 && <p>Ask anything about your resume — e.g. "Improve my bullet for product manager role"</p>}
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <textarea value={value} onChange={e => setValue(e.target.value)} rows={3} style={{ flex: 1 }} />
        <button onClick={send} disabled={loading} style={{ width: 96 }}>
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
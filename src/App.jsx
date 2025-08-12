import { useState } from 'react';

export default function App() {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    async function handleAnalyze() {
        setLoading(true);
        setResult(null);

        const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: input }),
        });

        const data = await res.json();
        setResult(data);
        setLoading(false);
    }

    return (
        <div
            style={{
                maxWidth: 600,
                margin: '2rem auto',
                fontFamily: 'sans-serif',
            }}
        >
            <h1>Political Argument Analyzer</h1>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={5}
                placeholder="Paste a political claim here..."
                style={{ width: '100%', padding: '0.5rem' }}
            />
            <button
                onClick={handleAnalyze}
                style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}
                disabled={!input || loading}
            >
                {loading ? 'Analyzing...' : 'Analyze'}
            </button>

            {result && (
                <div
                    style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        border: '1px solid #ccc',
                    }}
                >
                    <h3>Fact Check:</h3>
                    <p>{result.facts || 'No facts found'}</p>
                    <h3>Suggested Response:</h3>
                    <p>{result.rebuttal}</p>
                </div>
            )}
        </div>
    );
}

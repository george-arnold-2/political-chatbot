import { useState } from 'react';
import './App.css';
import iconLogo from './assets/icon.svg';

export default function App() {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    //using correct vite syntax is important lol
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

    async function handleAnalyze() {
        setLoading(true);
        setResult(null);

        try {
            const res = await fetch(`${API_BASE_URL}/api/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: input }),
            });

            const data = await res.json();

            if (!res.ok) {
                const rawError =
                    data.error ||
                    'A network error occurred, we apologize for the disturbance to the force';

                // Remove leading digits + spaces (e.g., "429 ")
                let cleanedError = rawError
                    .replace(/429/g, '')
                    .replace('You', 'The developer')
                    .replace('your', 'his')
                    .replace('your plan and billing details', 'back later');
                setResult({ error: cleanedError });
            } else {
                setResult(data);
            }
        } catch (error) {
            // Get the raw error message or fallback
            console.log('ERROR UPDATE');
            const rawError =
                error.message ||
                'A network error occurred, we apologize for the disturbance to the force';

            // Remove leading digits + spaces (e.g., "429 ")
            let cleanedError = rawError
                .replace(/429/g, '')
                .replace('You', 'The developer')
                .replace('your', 'his')
                .replace('your plan and billing details', 'back later');
            setResult({ error: cleanedError });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Political Argument Analyzer</h1>
            <img src={iconLogo} alt="logo" />
            <p>
                Specialized to prompt OpenAI's ChatGPT to ensure reliability in
                fact-driven responses, in an effort to minimalize the spread of
                misinformation. Enter your prompt below, click "Analyze", and
                get information about the claim made. It will also generate a
                persuaisive rebuttal you can reply with. The rebuttal is
                programmed to avoid the normal pitfalls of human arguements,
                such as straw man arguements, Ad-Hominem attacks, slippery
                slopes, and generalizations.
            </p>
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
            {loading ? (
                <div className="error">
                    Due to use of free web service, Render.com, Requests may
                    take up to a minute on the first try
                </div>
            ) : null}

            {result && (
                <div className="results">
                    {result.error ? (
                        <div className="error">
                            <h3>Error:</h3>
                            <p>{result.error}</p>
                        </div>
                    ) : (
                        <div className="success">
                            <h3>Fact Check:</h3>
                            <p>{result.facts || 'No facts found'}</p>
                            <h3>Suggested Response:</h3>
                            <p>{result.rebuttal}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

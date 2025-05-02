import React, { useState } from 'react';
import CountdownTimer from '../components/CountdownTimer';

function BonusPage() {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const collectBonus = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/collect-bonus', { method: 'POST' });
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            setMessage('Failed to collect bonus. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Bonus Collection</h1>
            <CountdownTimer />
            <button onClick={collectBonus} disabled={loading}>
                {loading ? 'Collecting...' : 'Collect Bonus'}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default BonusPage;

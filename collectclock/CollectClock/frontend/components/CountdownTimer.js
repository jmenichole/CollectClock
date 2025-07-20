import React, { useState, useEffect } from 'react';

function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        async function fetchNextBonusTime() {
            const response = await fetch('/api/next-bonus');
            const data = await response.json();
            setTimeLeft(data.nextBonusTime - Date.now());
        }

        fetchNextBonusTime();

        const interval = setInterval(() => {
            setTimeLeft((prev) => Math.max(prev - 1000, 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (ms) => {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <div>
            {timeLeft > 0 ? `Next Bonus: ${formatTime(timeLeft)}` : 'Bonus is now available!'}
        </div>
    );
}

export default CountdownTimer;

import React, { useEffect, useState } from 'react';

const Statistics = () => {
    const [stats, setStats] = useState({
        usersToday: 0,
        usersThisWeek: 0,
        usersThisMonth: 0,
        mostCollectedCasino: '',
    });

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await fetch('/api/statistics');
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchStatistics();
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <div>Users Today: {stats.usersToday}</div>
            <div>Users This Week: {stats.usersThisWeek}</div>
            <div>Users This Month: {stats.usersThisMonth}</div>
            <div>Most Collected Casino: {stats.mostCollectedCasino}</div>
        </div>
    );
};

export default Statistics;

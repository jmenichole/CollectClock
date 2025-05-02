import React, { useEffect, useState } from 'react';

const ActiveUsersCount = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchActiveUsers = async () => {
            try {
                const response = await fetch('/api/active-users');
                const data = await response.json();
                setCount(data.activeUsers);
            } catch (error) {
                console.error('Error fetching active users count:', error);
            }
        };

        fetchActiveUsers();
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            Active Users: {count}
        </div>
    );
};

export default ActiveUsersCount;

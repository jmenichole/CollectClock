import React from 'react';
import ActiveUsersCount from '../components/ActiveUsersCount';
import Statistics from '../components/Statistics';

const HomePage = () => {
    return (
        <div>
            <ActiveUsersCount />
            <Statistics />
        </div>
    );
};

export default HomePage;

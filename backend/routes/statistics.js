const express = require('express');
const router = express.Router();

// Mock functions to get statistics
const getUsersToday = () => 10;
const getUsersThisWeek = () => 50;
const getUsersThisMonth = () => 200;
const getMostCollectedCasino = () => 'Casino Royale';

router.get('/', (req, res) => {
    res.json({
        usersToday: getUsersToday(),
        usersThisWeek: getUsersThisWeek(),
        usersThisMonth: getUsersThisMonth(),
        mostCollectedCasino: getMostCollectedCasino(),
    });
});

module.exports = router;

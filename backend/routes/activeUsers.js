const express = require('express');
const router = express.Router();

// Mock function to get active users count
const getActiveUsersCount = () => {
    // Replace this with actual logic to fetch active users count
    return 42;
};

router.get('/', (req, res) => {
    const count = getActiveUsersCount();
    res.json({ activeUsers: count });
});

module.exports = router;

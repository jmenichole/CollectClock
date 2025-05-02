const express = require('express');
const { getNextBonusTime } = require('../bonusTimer');
const router = express.Router();

let lastCollectedTime = 0; // Replace with database integration for persistence

router.get('/next-bonus', (req, res) => {
    const nextBonusTime = getNextBonusTime(lastCollectedTime);
    res.json({ nextBonusTime });
});

router.post('/collect-bonus', (req, res) => {
    lastCollectedTime = Date.now();
    res.json({ message: 'Bonus collected!', nextBonusTime: getNextBonusTime(lastCollectedTime) });
});

module.exports = router;

const BONUS_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function getNextBonusTime(lastCollectedTime) {
    const now = Date.now();
    const nextBonusTime = lastCollectedTime + BONUS_INTERVAL;
    return nextBonusTime > now ? nextBonusTime : now + BONUS_INTERVAL;
}

module.exports = { getNextBonusTime };

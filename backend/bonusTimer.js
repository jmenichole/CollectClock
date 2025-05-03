const BONUS_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function getNextBonusTime(lastCollectedTime, interval = BONUS_INTERVAL) {
    const now = Date.now();
    const nextBonusTime = lastCollectedTime + interval;
    return nextBonusTime > now ? nextBonusTime : now + interval;
}

module.exports = { getNextBonusTime };

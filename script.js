const casinos = [
    // Tier 1 - Major Sweeps Casinos
    {
        name: "Stake.us",
        url: "https://stake.us/?c=Jmenichole",
        lastCollection: null,
        nextAvailable: null,
        tier: 1
    },
    {
        name: "Pulsz",
        url: "https://www.pulsz.com/?invited_by=utfk4r",
        lastCollection: null,
        nextAvailable: null,
        tier: 1
    },
    {
        name: "Fortune Coins",
        url: "https://www.fortunecoins.com/signup/3c08936f-8979-4f87-b377-efdbff519029",
        lastCollection: null,
        nextAvailable: null,
        tier: 1
    },
    {
        name: "Wow Vegas",
        url: "https://www.wowvegas.com/?raf=3615494",
        lastCollection: null,
        nextAvailable: null,
        tier: 1
    },
    {
        name: "McLuck",
        url: "https://www.mcluck.com/?r=908900038",
        lastCollection: null,
        nextAvailable: null,
        tier: 1
    },
    // Tier 2 - Established Secondary Casinos
    {
        name: "Mega Bonanza",
        url: "https://www.megabonanza.com/?r=72781897",
        lastCollection: null,
        nextAvailable: null,
        tier: 2
    },
    {
        name: "High 5 Casino",
        url: "https://high5casino.com/gc?adId=INV001%3AJmenichole",
        lastCollection: null,
        nextAvailable: null,
        tier: 2
    },
    {
        name: "Lucky Bird",
        url: "https://luckybird.io/?c=c_jmenichole",
        lastCollection: null,
        nextAvailable: null,
        tier: 2
    },
    {
        name: "Spree",
        url: "https://spree.com/?r=440894",
        lastCollection: null,
        nextAvailable: null,
        tier: 2
    },
    {
        name: "Crown Coins",
        url: "https://crowncoinscasino.com/?utm_campaign=59048bf4-dbeb-4c58-b690-d7ad11bdb847&utm_source=friends",
        lastCollection: null,
        nextAvailable: null,
        tier: 2
    },
    // Tier 3 - Newer/Growing Platforms
    {
        name: "Real Prize",
        url: "https://www.realprize.com/refer/317136",
        lastCollection: null,
        nextAvailable: null,
        tier: 3
    },
    {
        name: "Clubs Poker",
        url: "https://play.clubs.poker/?referralCode=104192",
        lastCollection: null,
        nextAvailable: null,
        tier: 3
    },
    {
        name: "Hello Millions",
        url: "https://www.hellomillions.com/referred-by-friend?r=26d6760f%2F1236643867",
        lastCollection: null,
        nextAvailable: null,
        tier: 3
    },
    {
        name: "Chanced",
        url: "https://chanced.com/c/m9q2mi",
        lastCollection: null,
        nextAvailable: null,
        tier: 3
    },
    {
        name: "Play Fame",
        url: "https://www.playfame.com/?r=1275975417",
        lastCollection: null,
        nextAvailable: null,
        tier: 3
    },
    // Tier 4 - Additional Options
    {
        name: "Jackpota",
        url: "https://www.jackpota.com/?r=85453282",
        lastCollection: null,
        nextAvailable: null,
        tier: 4
    },
    {
        name: "Zula Casino",
        url: "https://www.zulacasino.com/signup/221ddd92-862e-45d8-acc0-4cd2c26f7cdd",
        lastCollection: null,
        nextAvailable: null,
        tier: 4
    },
    {
        name: "Ding Ding Ding",
        url: "https://dingdingding.com/?referral=190cd69a-5af4-51bf-b418-9a35effcdf04",
        lastCollection: null,
        nextAvailable: null,
        tier: 4
    },
    {
        name: "Punt",
        url: "https://punt.com/c/cg60pd",
        lastCollection: null,
        nextAvailable: null,
        tier: 4
    },
    {
        name: "Fortune Wheelz",
        url: "https://fortunewheelz.com/?invited_by=P36ZS6",
        lastCollection: null,
        nextAvailable: null,
        tier: 4
    },
    {
        name: "Zoot",
        url: "https://getzoot.us/?referralCode=ZOOTwithJMENICHOLE",
        lastCollection: null,
        nextAvailable: null,
        tier: 4
    },
    // Tier 5 - Traditional Sweeps Casinos
    {
        name: "Luckyland Slots",
        url: "https://www.luckylandslots.com",
        lastCollection: null,
        nextAvailable: null,
        tier: 5
    },
    {
        name: "Chumba Casino",
        url: "https://www.chumbacasino.com",
        lastCollection: null,
        nextAvailable: null,
        tier: 5
    },
    {
        name: "Global Poker",
        url: "https://www.globalpoker.com",
        lastCollection: null,
        nextAvailable: null,
        tier: 5
    }
];

let collectClickCount = 0;

function collectBonus(casinoName) {
    const casino = casinos.find(c => c.name === casinoName);
    if (casino) {
        // First, open the casino URL
        window.open(casino.url, '_blank');
        
        // Show confirmation dialog
        const confirmCollect = confirm(
            "Did you collect the bonus?\n\n" +
            "• Click 'OK' if you collected the bonus (starts 24h timer)\n" +
            "• Click 'Cancel' if you just wanted to visit the site"
        );
        
        if (confirmCollect) {
            // User confirmed they collected the bonus
            updateCollection(casinoName);
            playCollectSound();
            
            // Increment support dialog counter
            collectClickCount++;
            if (collectClickCount >= 4) {
                showSupportDialog();
                collectClickCount = 0;
            }
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = `${casinoName} bonus collected! Timer started.`;
            document.body.appendChild(successMessage);
            setTimeout(() => successMessage.remove(), 3000);
        }
        
        updateDisplay();
    }
}

function updateCollection(casinoName) {
    const casino = casinos.find(c => c.name === casinoName);
    if (casino) {
        const now = new Date();
        casino.lastCollection = now;
        casino.nextAvailable = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // 24 hours later
        saveToLocalStorage();
        updateDisplay();
        checkVisitCount();
    }
}

function formatTimeRemaining(targetDate) {
    if (!targetDate) return 'Ready to collect!';
    
    const now = new Date();
    const diff = targetDate - now;
    
    if (diff <= 0) return 'Ready to collect!';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m remaining`;
}

function undoCollection(casinoName) {
    const casino = casinos.find(c => c.name === casinoName);
    if (casino && casino.lastCollection) {
        // Show confirmation dialog
        const confirmUndo = confirm(
            "Undo bonus collection?\n\n" +
            "• Click 'OK' if you didn't actually collect the bonus\n" +
            "• Click 'Cancel' to keep the timer running"
        );
        
        if (confirmUndo) {
            casino.lastCollection = null;
            casino.nextAvailable = null;
            saveToLocalStorage();
            updateDisplay();
            
            // Show undo confirmation message
            const undoMessage = document.createElement('div');
            undoMessage.className = 'undo-message';
            undoMessage.textContent = `${casinoName} timer reset`;
            document.body.appendChild(undoMessage);
            setTimeout(() => undoMessage.remove(), 3000);
        }
    }
}

function saveToLocalStorage() {
    localStorage.setItem('casinoData', JSON.stringify(casinos));
    localStorage.setItem('visitCount', getVisitCount());
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('casinoData');
    if (saved) {
        const parsed = JSON.parse(saved);
        parsed.forEach((casino, index) => {
            if (casinos[index]) {
                casinos[index].lastCollection = casino.lastCollection ? new Date(casino.lastCollection) : null;
                casinos[index].nextAvailable = casino.nextAvailable ? new Date(casino.nextAvailable) : null;
            }
        });
    }
}

function updateDisplay() {
    const container = document.getElementById('casino-list');
    if (!container) return;

    container.innerHTML = '';

    casinos.forEach(casino => {
        const timeRemaining = casino.nextAvailable ? 
            formatTimeRemaining(new Date(casino.nextAvailable)) : 
            'Ready to collect!';

        const isReady = !casino.nextAvailable || new Date() >= new Date(casino.nextAvailable);

        const card = document.createElement('div');
        card.className = 'casino-card';
        
        card.innerHTML = `
            <a href="${casino.url}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="casino-name" 
               title="Click to visit ${casino.name}">
                ${casino.name}
            </a>
            <div class="casino-timer ${isReady ? 'ready' : ''}" 
                 title="${isReady ? 'Ready to collect!' : 'Time until next bonus'}">
                ${timeRemaining}
            </div>
            <div class="button-container">
                <button 
                    onclick="collectBonus('${casino.name}');"
                    class="collect-button ${!isReady ? 'disabled' : ''}"
                    ${!isReady ? 'disabled' : ''}
                    title="${isReady ? 'Click to collect bonus' : 'Wait for timer to reset'}">
                    Collect
                </button>
                <button 
                    onclick="undoCollection('${casino.name}');"
                    class="undo-button"
                    title="Reset timer if bonus wasn't collected"
                    ${!casino.lastCollection ? 'disabled' : ''}>
                    Undo
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}

function playCollectSound() {
    const sound = document.getElementById('collect-sound');
    if (sound) {
        sound.play().catch(error => console.log('Sound play failed:', error));
    }
}

function initClock() {
    const hourHand = document.querySelector('.hour-hand');
    const minuteHand = document.querySelector('.minute-hand');
    const secondHand = document.querySelector('.second-hand');

    if (!hourHand || !minuteHand || !secondHand) return;

    function updateClock() {
        const now = new Date();
        
        const seconds = now.getSeconds();
        const secondsDegrees = ((seconds / 60) * 360) + 90;
        secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
        
        const minutes = now.getMinutes();
        const minutesDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6) + 90;
        minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;
        
        const hours = now.getHours();
        const hoursDegrees = ((hours / 12) * 360) + ((minutes / 60) * 30) + 90;
        hourHand.style.transform = `rotate(${hoursDegrees}deg)`;
    }

    setInterval(updateClock, 1000);
    updateClock();
}

function getVisitCount() {
    return parseInt(localStorage.getItem('visitCount') || '0');
}

function checkVisitCount() {
    const visitCount = getVisitCount() + 1;
    localStorage.setItem('visitCount', visitCount);
    
    if (visitCount >= 5 && !localStorage.getItem('dialogShown')) {
        showSupportDialog();
    }
}

function showSupportDialog() {
    const dialog = document.querySelector('.support-dialog');
    const overlay = document.querySelector('.dialog-overlay');
    if (dialog && overlay) {
        dialog.style.display = 'block';
        overlay.style.display = 'block';
        localStorage.setItem('dialogShown', 'true');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    updateDisplay();
    initClock();
    
    setInterval(updateDisplay, 60000); // Update display every minute
    
    const dismissButton = document.querySelector('.dismiss-button');
    const dialog = document.querySelector('.support-dialog');
    const overlay = document.querySelector('.dialog-overlay');
    
    if (dismissButton && dialog && overlay) {
        dismissButton.addEventListener('click', () => {
            dialog.style.display = 'none';
            overlay.style.display = 'none';
        });
    }
});


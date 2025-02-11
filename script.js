const casinos = [
    // Tier 1 - Major Sweeps Casinos
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
        name: "High 5 Casino",
        url: "https://high5casino.com/gc?adId=INV001%3AJmenichole",
        lastCollection: null,
        nextAvailable: null,
        tier: 2
    },
    {
        name: "Sidepot",
        url: "https://sidepot.us",
        lastCollection: null,
        nextAvailable: null,
        tier: 2
    },
    {
        name: "Uptown Aces",
        url: "https://uptownaces.eu",
        lastCollection: null,
        nextAvailable: null,
        tier: 2
    },

    // Tier 3 - Newer/Growing Platforms
    {
        name: "Mega Bonanza",
        url: "https://www.megabonanza.com/?r=72781897",
        lastCollection: null,
        nextAvailable: null,
        tier: 3
    },
    {
        name: "Lucky Bird",
        url: "https://luckybird.io/?c=c_jmenichole",
        lastCollection: null,
        nextAvailable: null,
        tier: 3
    },
    {
        name: "Sportzino",
        url: "https://sportzino.com/signup/8a105ba6-7ada-45c8-b021-f478ac03c7c4",
        lastCollection: null,
        nextAvailable: null,
        tier: 3
    },
    {
        name: "MyPrize",
        url: "https://myprize.us",
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
        name: "Clubs Poker",
        url: "https://play.clubs.poker/?referralCode=104192",
        lastCollection: null,
        nextAvailable: null,
        tier: 3
    },

    // Tier 4 - Additional Options
    {
        name: "Shuffle",
        url: "https://shuffle.com?r=jHR7JnWRPF",
        lastCollection: null,
        nextAvailable: null,
        tier: 4
    },
    {
        name: "Crown Coins",
        url: "https://crowncoinscasino.com/?utm_campaign=59048bf4-dbeb-4c58-b690-d7ad11bdb847&utm_source=friends",
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
        try {
            // Open the popup window with the casino link
            const popupWindow = document.getElementById('popup-window');
            const popupIframe = document.getElementById('popup-iframe');
            popupIframe.src = casino.url;
            popupWindow.style.display = 'block';

            // Close popup window when the close button is clicked
            const closeButton = document.querySelector('.close-button');
            closeButton.onclick = function () {
                popupWindow.style.display = 'none';
                popupIframe.src = '';
            };

            // Start timer for the casino
            updateCollection(casinoName);
            collectClickCount++;
            if (collectClickCount >= 4) {
                showSupportDialog();
                collectClickCount = 0;
            }

            showNotification(`${casinoName} timer started!`, 'success');

        } catch (error) {
            console.error('Error in collectBonus:', error);
            showNotification('Error opening popup. Please try clicking the casino name instead.', 'error');
        }

        updateDisplay();
    }
}

function preloadPopupContent(url) {
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
}

// Preload popup content for all casinos
casinos.forEach(casino => preloadPopupContent(casino.url));

function updateCollection(casinoName) {
    const casino = casinos.find(c => c.name === casinoName);
    if (casino) {
        const now = new Date();
        casino.lastCollection = now;
        casino.nextAvailable = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // 24-hour reset
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

function saveToLocalStorage() {
    try {
        localStorage.setItem('casinoData', JSON.stringify(casinos));
        localStorage.setItem('visitCount', getVisitCount());
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
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

function updateDisplay(filter = 'all') {
    const container = document.getElementById('casino-list');
    if (!container) return;

    container.innerHTML = '';

    const list = document.createElement('ul');

    casinos
        .filter(casino => filter === 'all' || `tier-${casino.tier}` === filter)
        .forEach(casino => {
            const timeRemaining = casino.nextAvailable
                ? formatTimeRemaining(new Date(casino.nextAvailable))
                : 'Ready to collect!';
            const isReady = !casino.nextAvailable || new Date() >= new Date(casino.nextAvailable);

            const listItem = document.createElement('li');
            listItem.className = 'casino-card';
            listItem.innerHTML = `
                <a href="javascript:void(0);" onclick="collectBonus('${casino.name}')" class="casino-name">
                    ${casino.name}
                </a>
                <div class="casino-timer ${isReady ? 'ready' : ''}">
                    ${timeRemaining}
                </div>
                <div class="button-container">
                    <button type="button" onclick="collectBonus('${casino.name}')" class="collect-button">
                        Collect
                    </button>
                </div>
            `;
            list.appendChild(listItem);
        });

    container.appendChild(list);
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

function showNotification(message, type) {
    const existingNotifications = document.querySelectorAll('.success-message, .undo-message');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = type === 'success' ? 'success-message' : 'undo-message';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    updateDisplay();
    setInterval(updateDisplay, 60000);
});

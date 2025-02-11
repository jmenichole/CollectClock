const casinos = [
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
    // Add other casinos as needed...
];

let collectClickCount = 0;

function collectBonus(casinoName) {
    const casino = casinos.find(c => c.name === casinoName);
    if (!casino) {
        console.error(`Casino "${casinoName}" not found.`);
        showNotification('Invalid casino name. Please try again.', 'error');
        return;
    }

    try {
        const popupWindow = document.getElementById('popup-window');
        const popupIframe = document.getElementById('popup-iframe');
        popupIframe.src = casino.url;
        popupWindow.style.display = 'block';

        const closeButton = document.querySelector('.close-button');
        closeButton.onclick = () => {
            popupWindow.style.display = 'none';
            popupIframe.src = '';
        };

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

// Other utility functions (formatTimeRemaining, saveToLocalStorage, loadFromLocalStorage, etc.)
// remain unchanged.
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    updateDisplay();
    setInterval(updateDisplay, 60000);
});

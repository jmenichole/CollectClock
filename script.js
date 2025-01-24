const casinos = [
  {
    name: "Fortune Coins",
    url: "https://www.fortunecoins.com/signup/3c08936f-8979-4f87-b377-efdbff519029",
    lastCollection: null,
    nextAvailable: null
  },
  {
    name: "Pulsz",
    url: "https://www.pulsz.com/?invited_by=utfk4r",
    lastCollection: null,
    nextAvailable: null
  },
  {
    name: "Stake.us",
    url: "https://stake.us/?c=Jmenichole",
    lastCollection: null,
    nextAvailable: null
  },
  {
    name: "Wow Vegas",
    url: "https://www.wowvegas.com/?raf=3615494",
    lastCollection: null,
    nextAvailable: null
  },
  {
    name: "McLuck",
    url: "https://www.mcluck.com/?r=908900038",
    lastCollection: null,
    nextAvailable: null
  }
];

// Utility functions
function updateCollection(casinoName) {
    const casino = casinos.find(c => c.name === casinoName);
    if (casino) {
        const now = new Date();
        casino.lastCollection = now;
        casino.nextAvailable = new Date(now.getTime() + (24 * 60 * 60 * 1000));
        saveToLocalStorage();
        updateDisplay();
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
    localStorage.setItem('casinoData', JSON.stringify(casinos));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('casinoData');
    if (saved) {
        const parsed = JSON.parse(saved);
        parsed.forEach((casino, index) => {
            casinos[index].lastCollection = casino.lastCollection ? new Date(casino.lastCollection) : null;
            casinos[index].nextAvailable = casino.nextAvailable ? new Date(casino.nextAvailable) : null;
        });
    }
}

function updateDisplay() {
    const container = document.getElementById('casino-list');
    container.innerHTML = '';
    
    casinos.forEach(casino => {
        const row = document.createElement('tr');
        
        const timeRemaining = casino.nextAvailable ? 
            formatTimeRemaining(new Date(casino.nextAvailable)) : 
            'Ready to collect!';
        
        const isReady = !casino.nextAvailable || new Date() >= new Date(casino.nextAvailable);
        
        row.innerHTML = `
            <td>${casino.name}</td>
            <td class="timer ${isReady ? 'ready' : ''}">${timeRemaining}</td>
            <td>
                <button 
                    onclick="window.open('${casino.url}', '_blank'); updateCollection('${casino.name}');"
                    class="collect-button ${!isReady ? 'disabled' : ''}"
                    ${!isReady ? 'disabled' : ''}
                >
                    Collect
                </button>
            </td>
        `;
        
        container.appendChild(row);
    });
}

// Initialize clock
function initClock() {
    const hourHand = document.querySelector('.hour-hand');
    const minuteHand = document.querySelector('.minute-hand');
    const secondHand = document.querySelector('.second-hand');

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

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    updateDisplay();
    initClock();
    
    // Update display every minute
    setInterval(updateDisplay, 60000);
    
    // Handle support dialog
    const dialog = document.querySelector('.support-dialog');
    const dismissButton = document.querySelector('.dismiss-button');
    
    if (dismissButton) {
        dismissButton.addEventListener('click', () => {
            dialog.style.display = 'none';
            localStorage.setItem('dialogDismissed', 'true');
        });
    }
    
    // Show dialog if not dismissed before
    if (!localStorage.getItem('dialogDismissed')) {
        setTimeout(() => {
            dialog.style.display = 'block';
        }, 60000); // Show after 1 minute
    }
});


// Casino data structure
const casinos = [
    { name: "Chumba Casino", url: "https://chumbacasino.com", lastCollection: null, nextAvailable: null },
    { name: "Fortune Coins", url: "https://fortunecoins.com", lastCollection: null, nextAvailable: null },
    { name: "LuckyLand Slots", url: "https://luckylandslots.com", lastCollection: null, nextAvailable: null },
    { name: "Pulsz", url: "https://pulsz.com", lastCollection: null, nextAvailable: null },
    { name: "Stake.us", url: "https://stake.us", lastCollection: null, nextAvailable: null },
    { name: "WOW Vegas", url: "https://wowvegas.com", lastCollection: null, nextAvailable: null },
    { name: "McLuck", url: "https://mcluck.com", lastCollection: null, nextAvailable: null },
    { name: "MegaBonanza", url: "https://megabonanza.com", lastCollection: null, nextAvailable: null },
    { name: "Funrize", url: "https://funrize.com", lastCollection: null, nextAvailable: null },
    { name: "ZitoBox", url: "https://zitobox.com", lastCollection: null, nextAvailable: null },
    { name: "Sweeptastic", url: "https://sweeptastic.com", lastCollection: null, nextAvailable: null },
    { name: "BetRivers.net", url: "https://betrivers.net", lastCollection: null, nextAvailable: null },
    { name: "High 5 Casino", url: "https://high5casino.com", lastCollection: null, nextAvailable: null },
    { name: "Luckybird.io", url: "https://luckybird.io", lastCollection: null, nextAvailable: null },
    { name: "Spree.com", url: "https://spree.com", lastCollection: null, nextAvailable: null },
    { name: "Global Poker", url: "https://globalpoker.com", lastCollection: null, nextAvailable: null },
    { name: "Gambino Slots", url: "https://gambinoslots.com", lastCollection: null, nextAvailable: null },
    { name: "Slotomania", url: "https://slotomania.com", lastCollection: null, nextAvailable: null },
    { name: "Golden Hearts Casino", url: "https://goldenheartscasino.com", lastCollection: null, nextAvailable: null },
    { name: "Big Fish Casino", url: "https://bigfishcasino.com", lastCollection: null, nextAvailable: null },
    { name: "MyVegas Slots", url: "https://myvegas.com", lastCollection: null, nextAvailable: null }
];

// Load saved data
const savedData = localStorage.getItem('casinoData');
if (savedData) {
    const loadedCasinos = JSON.parse(savedData);
    casinos.forEach((casino, index) => {
        if (loadedCasinos[index]) {
            casino.lastCollection = loadedCasinos[index].lastCollection;
            casino.nextAvailable = loadedCasinos[index].nextAvailable;
        }
    });
}

function updateTable() {
    const tableBody = document.getElementById('casino-list');
    tableBody.innerHTML = '';
    
    const currentTime = new Date('2025-01-05 05:12:05');

    casinos.forEach(casino => {
        const row = document.createElement('tr');
        
        // Always set initial status to AVAILABLE
        let status = 'AVAILABLE';
        let timeUntil = 'Ready Now!';
        
        if (casino.lastCollection) {
            const nextTime = new Date(casino.nextAvailable);
            if (currentTime < nextTime) {
                status = 'WAITING';
                timeUntil = getTimeUntil(nextTime, currentTime);
            } else {
                status = 'AVAILABLE';
                timeUntil = 'Ready Now!';
            }
        }

        row.innerHTML = `
            <td><a href="${casino.url}" target="_blank">${casino.name}</a></td>
            <td>${casino.lastCollection || '-'}</td>
            <td>${casino.nextAvailable || '-'}</td>
            <td class="status-${status.toLowerCase()}">${status}</td>
            <td>${timeUntil}</td>
            <td><button onclick="collect('${casino.name}')" ${status === 'WAITING' ? 'disabled' : ''} style="cursor: pointer;">Collect</button></td>
        `;
        
        tableBody.appendChild(row);
    });
}

function getTimeUntil(nextTime, currentTime) {
    const diff = nextTime - currentTime;
    
    // Convert total time to hours (including hours beyond 24)
    const totalHours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Format with leading zeros
    return `${totalHours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function collect(casinoName) {
    const casino = casinos.find(c => c.name === casinoName);
    if (casino) {
        const now = new Date('2025-01-05 05:12:05');
        casino.lastCollection = now.toISOString();
        casino.nextAvailable = new Date(now.getTime() + 24*60*60*1000).toISOString();
        
        // Save to localStorage
        localStorage.setItem('casinoData', JSON.stringify(casinos));
        
        updateTable();
    }
}

// Update table every second with current time
setInterval(() => {
    const newTime = new Date(new Date('2025-01-05 05:12:05').getTime() + 1000);
    updateTable(newTime);
}, 1000);

// Initial update
document.addEventListener('DOMContentLoaded', updateTable);

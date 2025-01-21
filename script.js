// AdCash Integration
const acScript = document.createElement('script');
acScript.id = 'aclib';
acScript.type = 'text/javascript';
acScript.src = '//acscdn.com/script/aclib.js';
document.head.appendChild(acScript);

// Casino Data Array
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
    },
    {
        name: "Mega Bonanza",
        url: "https://www.megabonanza.com/?r=72781897",
        lastCollection: null,
        nextAvailable: null
    },
    {
        name: "High 5 Casino",
        url: "https://high5casino.com/gc?adId=INV001%3AJmenichole",
        lastCollection: null,
        nextAvailable: null
    },
    {
        name: "Lucky Bird",
        url: "https://luckybird.io/?c=c_jmenichole",
        lastCollection: null,
        nextAvailable: null
    },
    {
        name: "Spree",
        url: "https://spree.com/?r=440894",
        lastCollection: null,
        nextAvailable: null
    },
    {
        name: "Crown Coins",
        url: "https://crowncoinscasino.com/?utm_campaign=59048bf4-dbeb-4c58-b690-d7ad11bdb847&utm_source=friends",
        lastCollection: null,
        nextAvailable: null
    },
    {
        name: "Real Prize",
        url: "https://www.realprize.com/refer/317136",
        lastCollection: null,
        nextAvailable: null
    },
    {
        name: "Clubs Poker",
        url: "https://play.clubs.poker/?referralCode=104192",
        lastCollection: null,
        nextAvailable: null
    },
    {
        name: "Hello Millions",
        url: "https://www.hellomillions.com/referred-by-friend?r=26d6760f%2F1236643867",
        lastCollection: null,
        nextAvailable: null
    },
    {
        name: "Chanced",
        url: "https://chanced.com/c/m9q2mi",
        lastCollection: null,
        nextAvailable: null
    },
    {
        name: "Play Fame",
        url: "https://www.playfame.com/?r=1275975417",
        lastCollection: null,
        nextAvailable: null
    },
    {
        name: "Jackpota",
        url: "https://www.jackpota.com/?r=85453282",
        lastCollection: null,
        nextAvailable: null
    },
    {
        name: "Zula Casino",
        url: "https://www.zulacasino.com/signup/221ddd92-862e-45d8-acc0-4cd2c26f7cdd",
        lastCollection: null,
        nextAvailable: null
    },
    {
        name: "Ding Ding Ding",
        url: "https://dingdingding.com/?referral=190cd69a-5af4-51bf-b418-9a35effcdf04",
        lastCollection: null,
        nextAvailable: null
    },
    {
        name: "Punt",
        url: "https://punt.com/c/cg60pd",
        lastCollection: null,
        nextAvailable: null
    },
    {
        name: "Fortune Wheelz",
        url: "https://fortunewheelz.com/?invited_by=P36ZS6",
        lastCollection: null,
        nextAvailable: null
    },
    {
        name: "Zoot",
        url: "https://getzoot.us/?referralCode=ZOOTwithJMENICHOLE",
        lastCollection: null,
        nextAvailable: null
    },
    {
        name: "Luckyland Slots",
        url: "https://www.luckylandslots.com",
        lastCollection: null,
        nextAvailable: null
    },
    {
        name: "Chumba Casino",
        url: "https://www.chumbacasino.com",
        lastCollection: null,
        nextAvailable: null
    },
    {
        name: "Global Poker",
        url: "https://www.globalpoker.com",
        lastCollection: null,
        nextAvailable: null
    }
];

// API Configuration
const API_CONFIG = {
    key: 'cf97eedbe621ffabed7e15b6282cbafe',
    baseUrl: 'https://api.the-odds-api.com/v4',
    sports: ['upcoming', 'in_play'],
    regions: 'us',
    markets: 'h2h',
    oddsFormat: 'decimal'
};

// Load saved casino data
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

// Set current date/time
let currentDateTime = new Date();

// Update casino display
function updateCasinoDisplay() {
    const casinoList = document.getElementById('casino-list');
    casinoList.innerHTML = '';

    casinos.forEach(casino => {
        const isAvailable = !casino.nextAvailable || new Date() >= new Date(casino.nextAvailable);
        const card = document.createElement('div');
        card.className = 'casino-card';
        
        card.innerHTML = `
            <h3>${casino.name}</h3>
            <div class="status-badge ${isAvailable ? 'status-available' : 'status-waiting'}">
                ${isAvailable ? 'AVAILABLE' : getTimeUntil(new Date(casino.nextAvailable), new Date())}
            </div>
            <a href="${casino.url}" 
               target="_blank" 
               onclick="handleCasinoClick('${casino.name}', event)"
               class="${!isAvailable ? 'disabled-link' : ''}">
               Collect Bonus
            </a>
        `;

        casinoList.appendChild(card);
    });

    localStorage.setItem('casinoData', JSON.stringify(casinos));
}

// Time display functions
function updateTimeDisplay() {
    const timeDisplay = document.querySelector('.time-display');
    if (timeDisplay) {
        timeDisplay.textContent = currentDateTime.toLocaleTimeString();
    }
}

// Update time every second
setInterval(() => {
    currentDateTime = new Date(currentDateTime.getTime() + 1000);
    updateTimeDisplay();
    updateCasinoDisplay();
}, 1000);

// Sports odds functions
async function fetchOdds() {
    try {
        const response = await fetch(
            `${API_CONFIG.baseUrl}/sports/${API_CONFIG.sports[0]}/odds/?` + 
            `apiKey=${API_CONFIG.key}&` +
            `regions=${API_CONFIG.regions}&` +
            `markets=${API_CONFIG.markets}&` +
            `oddsFormat=${API_CONFIG.oddsFormat}`
        );

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching odds:', error);
        return [];
    }
}

async function initializeTicker() {
    const tickerContainer = document.getElementById('ticker-container');
    if (!tickerContainer) return;

    const odds = await fetchOdds();
    
    if (odds.length > 0) {
        const ticker = document.createElement('div');
        ticker.id = 'odds-ticker';
        ticker.innerHTML = `
            <div class="ticker-content">
                ${odds.map(game => 
                    `${game.sport_title}: ${game.home_team} vs ${game.away_team}`
                ).join(' || ')}
            </div>
        `;
        tickerContainer.appendChild(ticker);
    }
}

// Event Handlers
function handleCasinoClick(casinoName, event) {
    const casino = casinos.find(c => c.name === casinoName);
    if (casino && casino.nextAvailable && currentDateTime < new Date(casino.nextAvailable)) {
        event.preventDefault();
        return;
    }
    collect(casinoName);
}

function collect(casinoName) {
    const casino = casinos.find(c => c.name === casinoName);
    if (casino) {
        casino.lastCollection = currentDateTime.toISOString();
        casino.nextAvailable = new Date(currentDateTime.getTime() + 24 * 60 * 60 * 1000).toISOString();
        localStorage.setItem('casinoData', JSON.stringify(casinos));
        updateCasinoDisplay();
    }
}

// Utility Functions
function getTimeUntil(nextTime, currentTime) {
    const diff = nextTime - currentTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateTimeDisplay();
    updateCasinoDisplay();
    initializeTicker();
    
    // Refresh odds every 5 minutes
    setInterval(initializeTicker, 300000);
});

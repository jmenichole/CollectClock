// Casino data array remains the same as your original
const casinos = [/* Your existing casino data */];

// API Configuration
const API_CONFIG = {
    key: 'cf97eedbe621ffabed7e15b6282cbafe',
    baseUrl: 'https://api.the-odds-api.com/v4',
    sports: ['upcoming', 'in_play'],
    regions: 'us',
    markets: 'h2h',
    oddsFormat: 'decimal'
};

// Initialize time display
function updateTimeDisplay() {
    const timeDisplay = document.querySelector('.time-display');
    const now = new Date();
    timeDisplay.textContent = now.toLocaleTimeString();
}

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
                ${isAvailable ? 'Available' : getTimeUntil(new Date(casino.nextAvailable), new Date())}
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

// Fetch and display odds
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

// Initialize ticker
async function initializeTicker() {
    const tickerContainer = document.getElementById('ticker-container');
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
    if (casino && casino.nextAvailable && new Date() < new Date(casino.nextAvailable)) {
        event.preventDefault();
        return;
    }
    collect(casinoName);
}

function collect(casinoName) {
    const casino = casinos.find(c => c.name === casinoName);
    if (casino) {
        const now = new Date();
        casino.lastCollection = now.toISOString();
        casino.nextAvailable = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
        updateCasinoDisplay();
    }
}

// Utility Functions
function getTimeUntil(nextTime, currentTime) {
    const diff = nextTime - currentTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateTimeDisplay();
    setInterval(updateTimeDisplay, 1000);
    updateCasinoDisplay();
    initializeTicker();
    
    // Refresh odds every 5 minutes
    setInterval(initializeTicker, 300000);
});

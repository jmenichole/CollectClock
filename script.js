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

function createHourMarks() {
    const hourMarksContainer = document.querySelector('.hour-marks');
    for (let i = 0; i < 12; i++) {
        const mark = document.createElement('div');
        mark.className = 'hour-mark';
        mark.style.transform = `rotate(${i * 30}deg)`;
        hourMarksContainer.appendChild(mark);
    }
}
function updateClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;

    const secondHand = document.querySelector('.second-hand');
    const minuteHand = document.querySelector('.minute-hand');
    const hourHand = document.querySelector('.hour-hand');

    // Calculate degrees
    const secondDeg = (seconds / 60) * 360;
    const minuteDeg = ((minutes + seconds/60) / 60) * 360;
    const hourDeg = ((hours + minutes/60) / 12) * 360;

    // Apply rotations
    secondHand.style.transform = `rotate(${secondDeg}deg)`;
    minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
    hourHand.style.transform = `rotate(${hourDeg}deg)`;
}

function updateCasinoDisplay() {
    const casinoList = document.getElementById('casino-list');
    casinoList.innerHTML = '';

    casinos.forEach(casino => {
        const isAvailable = !casino.nextAvailable || new Date() >= new Date(casino.nextAvailable);
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <a href="${casino.url}" target="_blank" style="color: #FFD700; text-decoration: none;">
                    ${casino.name}
                </a>
            </td>
            <td style="color: ${isAvailable ? '#50C878' : '#FFD700'};">
                ${isAvailable ? 'AVAILABLE' : getTimeUntil(new Date(casino.nextAvailable), new Date())}
            </td>
            <td>
                <input type="checkbox" 
                       ${!isAvailable ? 'checked' : ''}
                       style="transform: scale(1.2);"
                       onclick="handleCheckboxClick('${casino.name}', this)">
            </td>
        `;

        casinoList.appendChild(row);
    });
}

function handleCheckboxClick(casinoName, checkbox) {
    const casino = casinos.find(c => c.name === casinoName);
    if (!casino) return;

    if (checkbox.checked) {
        casino.lastCollection = new Date().toISOString();
        casino.nextAvailable = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    } else {
        casino.lastCollection = null;
        casino.nextAvailable = null;
    }

    localStorage.setItem('casinoData', JSON.stringify(casinos));
    updateCasinoDisplay();
}

function getTimeUntil(futureDate, currentDate) {
    const diff = futureDate - currentDate;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}

async function fetchDiscordStats() {
    try {
        const response = await fetch('https://discord.com/api/guilds/1329107627829104783/widget.json');
        const data = await response.json();
        
        const statsContainer = document.getElementById('server-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div>🟢 ${data.members.length} members online</div>
                <div>🎮 Currently active channels: ${data.channels.length}</div>
            `;
        }
    } catch (error) {
        console.error('Error fetching Discord stats:', error);
    }
}

function initClock() {
    createHourMarks();
    updateClock();
    setInterval(updateClock, 1000);
}

// Initialize page
function initializePage() {
    initClock();
    updateCasinoDisplay();
    fetchDiscordStats();
    
    // Update casino display every minute
    setInterval(updateCasinoDisplay, 60000);
    
    // Update Discord stats every 14 hours
    setInterval(fetchDiscordStats, 50400000);
}

// Start everything when the page loads
document.addEventListener('DOMContentLoaded', initializePage);

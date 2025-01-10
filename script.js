// Casino data array with referral links
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
let currentDateTime = new Date('2025-01-09 20:29:25');

function updateTable() {
    const tableBody = document.getElementById('casino-list');
    tableBody.innerHTML = '';

    casinos.forEach(casino => {
        const row = document.createElement('tr');
        
        let isAvailable = true;
        let timeUntil = '';
        
        if (casino.lastCollection) {
            const nextTime = new Date(casino.nextAvailable);
            if (currentDateTime < nextTime) {
                isAvailable = false;
                timeUntil = getTimeUntil(nextTime, currentDateTime);
            }
        }

        const checkboxId = `checkbox-${casino.name.replace(/\s+/g, '-').toLowerCase()}`;
        
        row.innerHTML = `
            <td>
                <a href="${casino.url}" 
                   target="_blank" 
                   onclick="handleCasinoClick('${casino.name}', event)"
                   ${!isAvailable ? 'class="disabled-link"' : ''}>
                    ${casino.name}
                </a>
            </td>
            <td>${isAvailable ? 'AVAILABLE' : timeUntil}</td>
            <td>
                <input 
                    type="checkbox" 
                    id="${checkboxId}"
                    ${!isAvailable ? 'checked' : ''}
                    style="${isAvailable ? 'background-color: green;' : ''}"
                    onclick="handleCheckboxClick('${casino.name}', this)"
                >
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function handleCheckboxClick(casinoName, checkbox) {
    const casino = casinos.find(c => c.name === casinoName);
    if (casino) {
        checkbox.checked = !checkbox.checked;
        if (checkbox.checked) {
            collect(casinoName);
        } else {
            casino.lastCollection = null;
            casino.nextAvailable = null;
            localStorage.setItem('casinoData', JSON.stringify(casinos));
            updateTable();
        }
    }
}

function handleCasinoClick(casinoName, event) {
    const casino = casinos.find(c => c.name === casinoName);
    if (casino) {
        const nextTime = new Date(casino.nextAvailable || 0);
        if (currentDateTime < nextTime) {
            event.preventDefault();
            return;
        }
        collect(casinoName);
    }
}

function collect(casinoName) {
    const casino = casinos.find(c => c.name === casinoName);
    if (casino) {
        const collectionTime = new Date(currentDateTime.getTime() + 60000); // 1 minute buffer
        casino.lastCollection = collectionTime.toISOString();
        casino.nextAvailable = new Date(collectionTime.getTime() + 24*60*60*1000).toISOString();
        localStorage.setItem('casinoData', JSON.stringify(casinos));
        
        const row = document.querySelector(`#checkbox-${casino.name.replace(/\s+/g, '-').toLowerCase()}`).closest('tr');
        const statusCell = row.querySelector('td:nth-child(2)');
        
        let bufferSeconds = 60;
        statusCell.innerHTML = `<span class="buffer-countdown">Collection window: ${bufferSeconds} seconds</span>`;
        
        const bufferTimer = setInterval(() => {
            bufferSeconds--;
            if (bufferSeconds > 0) {
                statusCell.innerHTML = `<span class="buffer-countdown">Collection window: ${bufferSeconds} seconds</span>`;
            } else {
                clearInterval(bufferTimer);
                updateTable();
            }
        }, 1000);
    }
}

function getTimeUntil(nextTime, currentTime) {
    const diff = nextTime - currentTime;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Update time and table every second
setInterval(() => {
    currentDateTime = new Date(currentDateTime.getTime() + 1000);
    updateTable();
}, 1000);

// Initial table update
updateTable();

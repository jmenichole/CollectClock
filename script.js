// Casino data structure
const casinos = [
    // Casinos with Referral Links
    { name: "Fortune Coins", url: "https://www.fortunecoins.com/signup/3c08936f-8979-4f87-b377-efdbff519029", lastCollection: null, nextAvailable: null },
    { name: "Pulsz", url: "https://www.pulsz.com/?invited_by=utfk4r", lastCollection: null, nextAvailable: null },
    { name: "Stake.us", url: "https://stake.us/?c=Jmenichole", lastCollection: null, nextAvailable: null },
    { name: "WOW Vegas", url: "https://www.wowvegas.com/?raf=3615494", lastCollection: null, nextAvailable: null },
    { name: "McLuck", url: "https://www.mcluck.com/?r=908900038", lastCollection: null, nextAvailable: null },
    { name: "MegaBonanza", url: "https://www.megabonanza.com/?r=72781897", lastCollection: null, nextAvailable: null },
    { name: "High 5 Casino", url: "https://high5casino.com/gc?adId=INV001%3AJmenichole", lastCollection: null, nextAvailable: null },
    { name: "Luckybird.io", url: "https://luckybird.io/?c=c_jmenichole", lastCollection: null, nextAvailable: null },
    { name: "Spree", url: "https://spree.com/?r=440894", lastCollection: null, nextAvailable: null },
    { name: "Crown Coins Casino", url: "https://crowncoinscasino.com/?utm_campaign=59048bf4-dbeb-4c58-b690-d7ad11bdb847&utm_source=friends", lastCollection: null, nextAvailable: null },
    { name: "RealPrize", url: "https://www.realprize.com/refer/317136", lastCollection: null, nextAvailable: null },
    { name: "Clubs Poker", url: "https://play.clubs.poker/?referralCode=104192", lastCollection: null, nextAvailable: null },
    { name: "Hello Millions", url: "https://www.hellomillions.com/referred-by-friend?r=26d6760f%2F1236643867", lastCollection: null, nextAvailable: null },
    { name: "Chanced", url: "https://chanced.com/c/m9q2mi", lastCollection: null, nextAvailable: null },
    { name: "PlayFame", url: "https://www.playfame.com/?r=1275975417", lastCollection: null, nextAvailable: null },
    { name: "Jackpota", url: "https://www.jackpota.com/?r=85453282", lastCollection: null, nextAvailable: null },
    { name: "Zula Casino", url: "https://www.zulacasino.com/signup/221ddd92-862e-45d8-acc0-4cd2c26f7cdd", lastCollection: null, nextAvailable: null },
    { name: "DingDingDing", url: "https://dingdingding.com/?referral=190cd69a-5af4-51bf-b418-9a35effcdf04", lastCollection: null, nextAvailable: null },
    { name: "Punt Casino", url: "https://punt.com/c/cg60pd", lastCollection: null, nextAvailable: null },
    { name: "Fortune Wheelz", url: "https://fortunewheelz.com/?invited_by=P36ZS6", lastCollection: null, nextAvailable: null },
    { name: "Zoot", url: "https://getzoot.us/?referralCode=ZOOTwithJMENICHOLE", lastCollection: null, nextAvailable: null },
    
    // Casinos without Referral Links
    { name: "Chumba Casino", url: "https://www.chumbacasino.com", lastCollection: null, nextAvailable: null },
    { name: "LuckyLand Slots", url: "https://www.luckylandslots.com", lastCollection: null, nextAvailable: null },
    { name: "Global Poker", url: "https://www.globalpoker.com", lastCollection: null, nextAvailable: null }
];

// Casino data structure
const casinos = [
    // Your existing casino data array remains unchanged
    // ... (keep all your casino entries as they are)
];

// Timer Variables
let timer;
let isRunning = false;
let timeLeft = 0;
let totalTime = 0;
let activeTimers = new Map();

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

let currentDateTime = new Date('2025-01-06 20:12:23');

// Timer Functions
function updateCircleProgress(percentage) {
    const circle = document.querySelector('.progress-bar');
    const circumference = 283;
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    document.querySelector('.timer-display').textContent = formatTime(timeLeft);
    const percentage = (timeLeft / totalTime) * 100 || 0;
    updateCircleProgress(percentage);
}

function startTimer() {
    if (!isRunning && timeLeft > 0) {
        isRunning = true;
        timer = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) {
                clearInterval(timer);
                isRunning = false;
                timeLeft = 0;
                updateDisplay();
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = totalTime;
    updateDisplay();
    resetCheckboxes();
}

// Checkbox Functions
function initializeCheckboxes() {
    document.querySelectorAll('.timer-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            handleCheckboxChange(this);
        });
    });
}

function handleCheckboxChange(checkbox) {
    const statusSpan = checkbox.parentElement.querySelector('.availability-status');
    const timerId = checkbox.id;

    if (checkbox.checked) {
        startCheckboxTimer(timerId, statusSpan);
    } else {
        stopCheckboxTimer(timerId, statusSpan);
    }
}

function startCheckboxTimer(timerId, statusSpan) {
    if (!activeTimers.has(timerId)) {
        statusSpan.textContent = formatTime(timeLeft);
        activeTimers.set(timerId, {
            timeLeft: timeLeft,
            timer: setInterval(() => {
                updateCheckboxTimer(timerId, statusSpan);
            }, 1000)
        });
    }
}

function updateCheckboxTimer(timerId, statusSpan) {
    const timerData = activeTimers.get(timerId);
    timerData.timeLeft--;
    statusSpan.textContent = formatTime(timerData.timeLeft);
    
    if (timerData.timeLeft <= 0) {
        const checkbox = document.getElementById(timerId);
        checkbox.checked = false;
        stopCheckboxTimer(timerId, statusSpan);
    }
}

function stopCheckboxTimer(timerId, statusSpan) {
    if (activeTimers.has(timerId)) {
        clearInterval(activeTimers.get(timerId).timer);
        activeTimers.delete(timerId);
    }
    statusSpan.textContent = 'Available';
}

function resetCheckboxes() {
    document.querySelectorAll('.timer-checkbox').forEach(checkbox => {
        checkbox.checked = false;
        checkbox.parentElement.querySelector('.availability-status').textContent = 'Available';
    });
    
    activeTimers.forEach(timerData => clearInterval(timerData.timer));
    activeTimers.clear();
}

// Casino Table Functions
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
            <td><a href="${casino.url}" target="_blank">${casino.name}</a></td>
            <td>${isAvailable ? 'AVAILABLE' : timeUntil}</td>
            <td>
                <input 
                    type="checkbox" 
                    id="${checkboxId}"
                    ${!isAvailable ? 'checked disabled' : ''}
                >
            </td>
        `;
        
        tableBody.appendChild(row);

        const checkbox = document.getElementById(checkboxId);
        if (checkbox && isAvailable) {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    collect(casino.name);
                }
            });
        }
    });
}

function getTimeUntil(nextTime, currentTime) {
    const diff = nextTime - currentTime;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function collect(casinoName) {
    const casino = casinos.find(c => c.name === casinoName);
    if (casino) {
        casino.lastCollection = currentDateTime.toISOString();
        casino.nextAvailable = new Date(currentDateTime.getTime() + 24*60*60*1000).toISOString();
        localStorage.setItem('casinoData', JSON.stringify(casinos));
        updateTable();
    }
}

// Initialize everything when the document loads
document.addEventListener('DOMContentLoaded', () => {
    initializeCheckboxes();
    updateDisplay();
    updateTable();
});

// Update time and table every second
setInterval(() => {
    currentDateTime = new Date(currentDateTime.getTime() + 1000);
    updateTable();
}, 1000);

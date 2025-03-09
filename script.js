// Casino data and user state
let casinos = [
    { name: "Sportzino", url: "https://sportzino.com/signup/8a105ba6-7ada-45c8-b021-f478ac03c7c4", lastCollection: null, nextAvailable: null },
    { name: "Sidepot", url: "https://sidepot.us", lastCollection: null, nextAvailable: null },
    { name: "Casino Click", url: "https://casino.click", lastCollection: null, nextAvailable: null },
    { name: "Shuffle", url: "https://shuffle.com?r=jHR7JnWRPF", lastCollection: null, nextAvailable: null },
    { name: "Fortune Coins", url: "https://www.fortunecoins.com/signup/3c08936f-8979-4f87-b377-efdbff519029", lastCollection: null, nextAvailable: null },
    { name: "Pulsz", url: "https://www.pulsz.com/?invited_by=utfk4r", lastCollection: null, nextAvailable: null },
    { name: "Stake US", url: "https://stake.us/?c=Jmenichole", lastCollection: null, nextAvailable: null },
    { name: "Wow Vegas", url: "https://www.wowvegas.com/?raf=3615494", lastCollection: null, nextAvailable: null },
    { name: "McLuck", url: "https://www.mcluck.com/?r=908900038", lastCollection: null, nextAvailable: null },
    { name: "Mega Bonanza", url: "https://www.megabonanza.com/?r=72781897", lastCollection: null, nextAvailable: null },
    { name: "High 5 Casino", url: "https://high5casino.com/gc?adId=INV001%3AJmenichole", lastCollection: null, nextAvailable: null },
    { name: "Lucky Bird", url: "https://luckybird.io/?c=c_jmenichole", lastCollection: null, nextAvailable: null },
    { name: "Spree", url: "https://spree.com/?r=440894", lastCollection: null, nextAvailable: null },
    { name: "Crown Coins", url: "https://crowncoinscasino.com/?utm_campaign=59048bf4-dbeb-4c58-b690-d7ad11bdb847&utm_source=friends", lastCollection: null, nextAvailable: null },
    { name: "Real Prize", url: "https://www.realprize.com/refer/317136", lastCollection: null, nextAvailable: null },
    { name: "Clubs Poker", url: "https://play.clubs.poker/?referralCode=104192", lastCollection: null, nextAvailable: null },
    { name: "Hello Millions", url: "https://www.hellomillions.com/referred-by-friend?r=26d6760f%2F1236643867", lastCollection: null, nextAvailable: null },
    { name: "Chanced", url: "https://chanced.com/c/m9q2mi", lastCollection: null, nextAvailable: null },
    { name: "PlayFame", url: "https://www.playfame.com/?r=1275975417", lastCollection: null, nextAvailable: null },
    { name: "Jackpota", url: "https://www.jackpota.com/?r=85453282", lastCollection: null, nextAvailable: null },
    { name: "Zula Casino", url: "https://www.zulacasino.com/signup/221ddd92-862e-45d8-acc0-4cd2c26f7cdd", lastCollection: null, nextAvailable: null },
    { name: "Ding Ding Ding", url: "https://dingdingding.com/?referral=190cd69a-5af4-51bf-b418-9a35effcdf04", lastCollection: null, nextAvailable: null },
    { name: "Cases.gg", url: "https://cases.gg/r/JMENICHOLE", lastCollection: null, nextAvailable: null },
    { name: "Trust Dice", url: "https://trustdice.win/faucet/?ref=u_jmenichole", lastCollection: null, nextAvailable: null },
    { name: "Punt", url: "https://punt.com/c/cg60pd", lastCollection: null, nextAvailable: null },
    { name: "Fortune Wheelz", url: "https://fortunewheelz.com/?invited_by=P36ZS6", lastCollection: null, nextAvailable: null },
    { name: "Zoot", url: "https://getzoot.us/?referralCode=ZOOTwithJMENICHOLE", lastCollection: null, nextAvailable: null },
    { name: "Stake.com", url: "https://stake.com/?c=LAYP68hb", lastCollection: null, nextAvailable: null },
    { name: "MyPrize.us", url: "https://myprize.us/invite/quietMorning197", lastCollection: null, nextAvailable: null },
    { name: "Modo.us", url: "https://modo.us?referralCode=61MN6A", lastCollection: null, nextAvailable: null }
];

let currentUser = null;

// Load saved casino data from localStorage
const savedData = localStorage.getItem("casinoData");
if (savedData) {
    try {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
            casinos = parsedData;
        }
    } catch (error) {
        console.error("Error parsing saved data:", error);
    }
}

// Authentication functions
async function checkAuthStatus() {
    try {
        const response = await fetch('http://localhost:5000/user');
        if (response.ok) {
            currentUser = await response.json();
            updateUserInterface(true);
            updateStreakDisplay();
        } else {
            updateUserInterface(false);
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        updateUserInterface(false);
    }
}

function updateUserInterface(isLoggedIn) {
    const loginSection = document.getElementById('login-section');
    const userInfo = document.getElementById('user-info');
    
    if (isLoggedIn && currentUser) {
        loginSection.style.display = 'none';
        userInfo.style.display = 'flex';
        
        document.getElementById('user-avatar').src = 
            `https://cdn.discordapp.com/avatars/${currentUser.id}/${currentUser.avatar}.png`;
        document.getElementById('username').textContent = currentUser.username;
        updateStreakDisplay();
    } else {
        loginSection.style.display = 'block';
        userInfo.style.display = 'none';
    }
}

function updateStreakDisplay() {
    if (currentUser) {
        document.getElementById('current-streak').textContent = currentUser.current_streak;
        document.getElementById('highest-streak').textContent = currentUser.highest_streak;
    }
}

async function handleLogin() {
    try {
        const response = await fetch('http://localhost:5000/login');
        const data = await response.json();
        window.location.href = data.auth_url;
    } catch (error) {
        console.error('Error during login:', error);
    }
}

// Leaderboard functionality
async function updateLeaderboard() {
    try {
        const response = await fetch('http://localhost:5000/leaderboard');
        const leaderboard = await response.json();
        
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = '';
        
        leaderboard.forEach((entry, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${entry.username}</td>
                <td>${entry.highest_streak}</td>
            `;
            leaderboardList.appendChild(row);
        });
    } catch (error) {
        console.error('Error updating leaderboard:', error);
    }
}

// Function to calculate time until next bonus
function getTimeUntil(nextTime, currentTime) {
    const diff = nextTime - currentTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}

// Function to update table
function updateTable() {
    const tableBody = document.getElementById("casino-list");
    if (!tableBody) return console.error("Table body element not found!");

    tableBody.innerHTML = "";
    const currentDateTime = new Date();

    casinos.forEach((casino) => {
        const row = document.createElement("tr");
        
        let isAvailable = true;
        let timeUntil = "Bonus Ready!";
        if (casino.lastCollection && casino.nextAvailable) {
            const nextTime = new Date(casino.nextAvailable);
            if (nextTime > currentDateTime) {
                isAvailable = false;
                timeUntil = getTimeUntil(nextTime, currentDateTime);
            }
        }

        // Create casino name cell with link
        const nameCell = document.createElement("td");
        const link = document.createElement("a");
        link.href = casino.url;
        link.textContent = casino.name;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        nameCell.appendChild(link);

        // Create status cell
        const statusCell = document.createElement("td");
        statusCell.textContent = timeUntil;
        statusCell.className = isAvailable ? "available" : "unavailable";

        // Create checkbox cell
        const checkboxCell = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = !isAvailable;
        checkbox.disabled = !isAvailable;
        checkbox.addEventListener("click", () => handleCheckboxClick(casino.name, checkbox));
        checkboxCell.appendChild(checkbox);

        // Add cells to row
        row.appendChild(nameCell);
        row.appendChild(statusCell);
        row.appendChild(checkboxCell);
        tableBody.appendChild(row);
    });

    // Update progress bar
    updateProgressBar();
}

// Function to handle checkbox click
async function handleCheckboxClick(casinoName, checkbox) {
    if (!currentUser) {
        alert('Please login with Discord to track your collection streak!');
        checkbox.checked = false;
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/collect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ casinoName }) // Ensure the casino name is sent in the request body
        });

        if (response.ok) {
            const data = await response.json();
            currentUser.current_streak = data.current_streak;
            currentUser.highest_streak = data.highest_streak;
            updateStreakDisplay();
            updateLeaderboard();
            
            const casino = casinos.find(c => c.name === casinoName);
            if (casino) {
                casino.lastCollection = new Date();
                casino.nextAvailable = new Date(casino.lastCollection.getTime() + 24 * 60 * 60 * 1000);
                localStorage.setItem('casinoData', JSON.stringify(casinos));
                updateTable();
            }
        } else {
            const error = await response.json();
            alert(error.error || 'Error collecting bonus');
            checkbox.checked = false;
        }
    } catch (error) {
        console.error('Error collecting bonus:', error);
        checkbox.checked = false;
    }
}

// Function to update progress bar
function updateProgressBar() {
    const total = casinos.length;
    const collected = casinos.filter(casino => 
        casino.lastCollection && new Date(casino.nextAvailable) > new Date()
    ).length;
    
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const percentage = (collected / total) * 100;
        progressBar.style.width = `${percentage}%`;
    }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.addEventListener('click', handleLogin);
    }
    
    checkAuthStatus();
    updateLeaderboard();
    updateTable();
    
    // Update the table every minute to keep times current
    setInterval(updateTable, 60000);

    const collectButton = document.querySelector('.collect-button');

    if (collectButton) {
        collectButton.addEventListener('click', () => {
            collectButton.classList.toggle('checked');
        });
    }

    const streakCountElement = document.getElementById('streak-count');
    const lastLoginDate = localStorage.getItem('lastLoginDate');
    const currentDate = new Date().toLocaleDateString();

    if (lastLoginDate === currentDate) {
        // User has already logged in today
        streakCountElement.textContent = localStorage.getItem('streakCount');
    } else {
        // Update streak count
        let streakCount = parseInt(localStorage.getItem('streakCount')) || 0;
        if (new Date(lastLoginDate).getDate() === new Date(currentDate).getDate() - 1) {
            streakCount++;
        } else {
            streakCount = 1; // Reset streak if not consecutive days
        }
        localStorage.setItem('streakCount', streakCount);
        localStorage.setItem('lastLoginDate', currentDate);
        streakCountElement.textContent = streakCount;
    }
});

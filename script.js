document.addEventListener("DOMContentLoaded", () => {
    checkUserLogin();
    loadCasinoData();
    setInterval(updateCountdowns, 1000); // Ensure countdowns are updated every second
    updateUserStats(); // Update user stats at the top
});

// Check if user is logged in via Discord
function checkUserLogin() {
    const user = JSON.parse(localStorage.getItem('discordUser'));
    const loginButton = document.getElementById('login-button');
    
    if (user && user.id) {
        // User is logged in
        console.log('User logged in:', user.username);
        
        // Hide login button if it exists
        if (loginButton) {
            loginButton.style.display = 'none';
        }
        
        // Display user info
        const userInfoHTML = `
            <div class="user-info">
                <img src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png" 
                     alt="${user.username}" 
                     class="user-avatar" />
                <div class="user-details">
                    <span class="username">${user.username}</span>
                    <button id="logout-button" class="logout-button">Logout</button>
                </div>
            </div>
        `;
        
        // Insert user info at the top of the page
        const header = document.querySelector('header');
        if (header) {
            header.insertAdjacentHTML('beforeend', userInfoHTML);
            
            // Add logout functionality
            document.getElementById('logout-button').addEventListener('click', () => {
                localStorage.removeItem('discordUser');
                window.location.reload();
            });
        }
    } else {
        // User is not logged in
        console.log('User not logged in');
        
        // Ensure login button is visible
        if (loginButton) {
            loginButton.style.display = 'block';
        }
    }
}

function updateUserStats() {
    const user = JSON.parse(localStorage.getItem('discordUser'));
    const casinoData = JSON.parse(localStorage.getItem("casinoData")) || {};
    const userStats = document.querySelector('.user-details');

    if (user && userStats) {
        let totalCollected = 0;
        const collectionCounts = {};

        Object.values(casinoData).forEach(casino => {
            if (casino.lastCollection) {
                totalCollected++;
                collectionCounts[casino.name] = (collectionCounts[casino.name] || 0) + 1;
            }
        });

        const mostCollected = Object.entries(collectionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

        userStats.insertAdjacentHTML('beforeend', `
            <div class="user-stats">
                <p>Days Collected: <strong>${totalCollected}</strong></p>
                <p>Most Collected Casino: <strong>${mostCollected}</strong></p>
            </div>
        `);
    }
}

function loadCasinoData() {
    const casinoList = document.getElementById("casino-list");
    const unusedCasinoList = document.getElementById("unused-casino-list");

    // Clear existing content
    if (casinoList) casinoList.innerHTML = "";
    if (unusedCasinoList) unusedCasinoList.innerHTML = "";

   
    const casinos = [

  { name: "Stake US", url: "https://stake.us/?c=Jmenichole", lastCollection: null, nextAvailable: null },
  { name: "Rolla", url: "https://www.rolla.com", lastCollection: null, nextAvailable: null },
  { name: "SpinPals", url: "https://www.spinpals.com?referralcode=e851e1a8-c455-4a59-954d-b7fe0bbad04c", lastCollection: null, nextAvailable: null },
  { name: "Casino Click", url: "https://casino.click", lastCollection: null, nextAvailable: null },
  { name: "Sportzino", url: "https://sportzino.com/signup/8a105ba6-7ada-45c8-b021-f478ac03c7c4", lastCollection: null, nextAvailable: null },
  { name: "Rainbet", url: "https://rainbet.com/", lastCollection: null, nextAvailable: null },
  { name: "Bitsler.io", url: "https://bitsler.io", lastCollection: null, nextAvailable: null },
  { name: "SpinBlitz", url: "https://www.spinblitz.com/lp/raf?r=606f64a3%2F1246446739", lastCollection: null, nextAvailable: null },
  { name: "Fortune Coins", url: "https://www.fortunecoins.com/signup/3c08936f-8979-4f87-b377-efdbff519029", lastCollection: null, nextAvailable: null },
  { name: "Pulsz", url: "https://www.pulsz.com/?invited_by=utfk4r", lastCollection: null, nextAvailable: null },
  { name: "Pulsz Bingo", url: "https://pulszbingo.com", lastCollection: null, nextAvailable: null },
  { name: "Wow Vegas", url: "https://www.wowvegas.com/?raf=3615494", lastCollection: null, nextAvailable: null },
  { name: "McLuck", url: "https://www.mcluck.com/?r=908900038", lastCollection: null, nextAvailable: null },
  { name: "Winna", url: "https://winna.com/", lastCollection: null, nextAvailable: null },
  { name: "Mega Bonanza", url: "https://www.megabonanza.com/?r=72781897", lastCollection: null, nextAvailable: null },
  { name: "High 5 Casino", url: "https://high5casino.com/gc?adId=INV001%3AJmenichole", lastCollection: null, nextAvailable: null },
  { name: "Lucky Bird", url: "https://luckybird.io/?c=c_jmenichole", lastCollection: null, nextAvailable: null },
  { name: "Spree", url: "https://spree.com/?r=440894", lastCollection: null, nextAvailable: null },
  { name: "Crown Coins", url: "https://crowncoinscasino.com/?utm_campaign=59048bf4-dbeb-4c58-b690-d7ad11bdb847&utm_source=friends", lastCollection: null, nextAvailable: null },
  { name: "Real Prize", url: "https://www.realprize.com/refer/317136", lastCollection: null, nextAvailable: null },
  { name: "Clubs Poker", url: "https://play.clubs.poker/?referralCode=104192", lastCollection: null, nextAvailable: null },
  { name: "Hello Millions", url: "https://www.hellomillions.com/referred-by-friend?r=26d6760f%2F1236643867", lastCollection: null, nextAvailable: null },
  { name: "Chanced", url: "https://chanced.com/c/m9q2mi", lastCollection: null, nextAvailable: null },
  { name: "Rain.gg", url: "https://rain.gg", lastCollection: null, nextAvailable: null },
  { name: "PlayFame", url: "https://www.playfame.com/?r=1275975417", lastCollection: null, nextAvailable: null },
  { name: "Jackpota", url: "https://www.jackpota.com/?r=85453282", lastCollection: null, nextAvailable: null },
  { name: "Zula Casino", url: "https://www.zulacasino.com/signup/221ddd92-862e-45d8-acc0-4cd2c26f7cdd", lastCollection: null, nextAvailable: null },
  { name: "Cases.gg", url: "https://cases.gg/r/JMENICHOLE", lastCollection: null, nextAvailable: null },
  { name: "Trust Dice", url: "https://trustdice.win/faucet/?ref=u_jmenichole", lastCollection: null, nextAvailable: null },
  { name: "Punt", url: "https://punt.com/c/cg60pd", lastCollection: null, nextAvailable: null },
  { name: "Fortune Wheelz", url: "https://fortunewheelz.com/?invited_by=P36ZS6", lastCollection: null, nextAvailable: null },
  { name: "Zoot", url: "https://getzoot.us/?referralCode=ZOOTwithJMENICHOLE", lastCollection: null, nextAvailable: null },
  { name: "MyPrize.us", url: "https://myprize.us/invite/quietMorning197", lastCollection: null, nextAvailable: null },
  { name: "Modo.us", url: "https://modo.us?referralCode=61MN6A", lastCollection: null, nextAvailable: null },
  { name: "Spinsala", url: "https://spinsala.com/en?invite=daym", lastCollection: null, nextAvailable: null },
  { name: "Clash.gg", url: "https://clash.gg/r/stakestats", lastCollection: null, nextAvailable: null },
  { name: "Chumba", url: "https://Chumbacasino.com", lastCollection: null, nextAvailable: null },
  { name: "Luckyland Slots", url: "https://luckylandslots.com", lastCollection: null, nextAvailable: null },
  { name: "Legendz", url: "https://legendz.com/?referred_by_id=221602", lastCollection: null, nextAvailable: null },
  { name: "NoLimitCoins", url: "https://nolimitcoins.com/?invited_by=ZI1JIU", lastCollection: null, nextAvailable: null },
  { name: "Sidepot", url: "https://sidepot.us", lastCollection: null, nextAvailable: null },
  { name: "Shuffle", url: "https://shuffle.com?r=jHR7JnWRPF", lastCollection: null, nextAvailable: null },
  { name: "Ding Ding Ding", url: "https://dingdingding.com/?referral=190cd69a-5af4-51bf-b418-9a35effcdf04", lastCollection: null, nextAvailable: null },
  { name: "Gamba", url: "https://gamba.com?c=Jme", lastCollection: null, nextAvailable: null },
  { name: "Goated", url: "https://www.goated.com/r/YDRZLJ", lastCollection: null, nextAvailable: null }
];


 

        // Sports Betting Sites (no timer)
   
        { name: "Slips", category: "Sports", url: "https://slips.com/", unused: false },
        { name: "PrizePicks", category: "Sports", url: "https://app.prizepicks.com/", unused: false },
        { name: "Dabble", category: "Sports", url: "https://click.dabble.com/", unused: false }, 
        { name: "Sleeper", category: "Sports", url: "https://sleeper.com/", unused: false },
        { name: "Sports Millions", category: "Sports", url: "https://www.sportsmillions.com/", unused: false },
        { name: "ParlayPlay", category: "Sports", url: "https://parlayplay.io/", unused: false }
    ];

    // Load saved data from localStorage
    const savedData = JSON.parse(localStorage.getItem("casinoData")) || {};
    casinos.forEach(casino => {
        const savedCasino = savedData[casino.name];
        if (savedCasino) {
            casino.lastCollection = savedCasino.lastCollection;
            casino.nextAvailable = savedCasino.nextAvailable;
            casino.unused = savedCasino.unused || false;
        }
    });

    // Sort casinos by nextAvailable time
    casinos.sort((a, b) => {
        if (a.unused !== b.unused) return a.unused ? 1 : -1;
        if (!a.nextAvailable || !b.nextAvailable) return 0;
        return new Date(a.nextAvailable) - new Date(b.nextAvailable);
    });

    // Create category headers and add casinos
    if (casinoList && unusedCasinoList) {
        let currentCategory = "";
        casinos.forEach((casino, index) => {
            const targetList = casino.unused ? unusedCasinoList : casinoList;

            if (!casino.unused && casino.category !== currentCategory) {
                currentCategory = casino.category;
                const headerRow = document.createElement("tr");
                headerRow.className = "category-header";
                headerRow.innerHTML = `<td colspan="4">${currentCategory}</td>`;
                targetList.appendChild(headerRow);
            }

            casino.id = `casino-${index + 1}`;

            const row = document.createElement("tr");
            row.id = `row-${casino.id}`;
            row.className = "casino-row";

            // Different rendering for sports betting sites (no timer)
            if (casino.category === "Sports") {
                row.innerHTML = `
                    <td><a href="${casino.url}" target="_blank" class="casino-link" data-id="${casino.id}">${casino.name}</a></td>
                    <td colspan="2" style="text-align: center;">Visit Site</td>
                `;
            } else {
                row.innerHTML = `
                    <td><a href="${casino.url}" target="_blank" class="casino-link" data-id="${casino.id}">${casino.name}</a></td>
                    <td class="countdown" id="countdown-${casino.id}">${formatCountdown(casino.nextAvailable)}</td>
                    <td><input type="checkbox" class="unused-checkbox" id="checkbox-${casino.id}" ${casino.unused ? "checked" : ""}></td>
                    <td>
                        <button class="frequency-button" data-id="${casino.id}">Set Frequency</button>
                    </td>
                `;
            }

            targetList.appendChild(row);

            // Add event listener for the unused checkbox (only for non-sports casinos)
            if (casino.category !== "Sports") {
                const checkbox = document.getElementById(`checkbox-${casino.id}`);
                if (checkbox) {
                    checkbox.addEventListener("change", () => {
                        casino.unused = checkbox.checked;
                        saveCasinoData(casinos);
                        loadCasinoData(); // Reload the list to reflect changes
                    });
                }

                // Add event listener for the casino link
                const link = document.querySelector(`a[data-id="${casino.id}"]`);
                if (link) {
                    link.addEventListener("click", () => {
                        casino.lastCollection = new Date().toISOString();
                        casino.nextAvailable = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours from now
                        saveCasinoData(casinos);
                        
                        // Attempt to update Discord streak if user is logged in
                        updateStreak();
                        
                        // Reload the list to update the timer
                        loadCasinoData(); 
                    });
                }
            }
        });

        // Add event listeners for frequency buttons
        document.querySelectorAll('.frequency-button').forEach(button => {
            button.addEventListener('click', () => {
                const casinoId = button.getAttribute('data-id');
                const frequency = prompt("How often does this casino bonus restart? (e.g., 24 hours, 12 hours)");
                if (!/^\d+\s(hours|days)$/.test(frequency)) {
                    alert('Invalid format. Please use "X hours" or "X days".');
                    return;
                }
                const casino = casinos.find(c => c.id === casinoId);
                if (casino) {
                    casino.frequency = frequency;
                    saveCasinoData(casinos);
                    alert(`Frequency for ${casino.name} set to: ${frequency}`);
                }
            });
        });
    }

    // Save the updated casino data
    saveCasinoData(casinos);
}

// Function to update streak on the server if user is logged in
function updateStreak() {
    const user = JSON.parse(localStorage.getItem('discordUser'));
    if (user && user.id) {
        // If using the backend server, uncomment this:
        /*
        fetch('/collect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            console.log('Streak updated:', data);
        })
        .catch(error => {
            console.error('Error updating streak:', error);
        });
        */
        
        // For GitHub Pages version (without backend), just log
        console.log('Would update streak for user', user.username);
    }
}

// Countdown logic for each timer cell
function updateCountdowns() {
    const casinos = JSON.parse(localStorage.getItem("casinoData")) || {};
    Object.entries(casinos).forEach(([casinoName, casino]) => {
        if (!casino.nextAvailable) return;
        const countdownElement = document.getElementById(`countdown-${casinoName}`);
        if (countdownElement) {
            const timeLeft = new Date(casino.nextAvailable) - new Date();
            countdownElement.innerText = timeLeft > 0 ? formatCountdown(casino.nextAvailable) : "Available!";
        }
    });
}

// Format countdown time
function formatCountdown(nextAvailable) {
    if (!nextAvailable) return "Available!";
    const timeLeft = new Date(nextAvailable) - new Date();
    if (timeLeft <= 0) return "Available!";
    const hours = Math.floor(timeLeft / 3600000);
    const minutes = Math.floor((timeLeft % 3600000) / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Save data to localStorage
function saveCasinoData(casinos) {
    const dataToSave = {};
    casinos.forEach(casino => {
        dataToSave[casino.name] = {
            lastCollection: casino.lastCollection,
            nextAvailable: casino.nextAvailable,
            unused: casino.unused,
            frequency: casino.frequency || null
        };
    });
    localStorage.setItem("casinoData", JSON.stringify(dataToSave));
}

// Add error handling for fetch calls
async function fetchNextBonusTime() {
    try {
        const response = await fetch('/api/next-bonus');
        if (!response.ok) throw new Error('Failed to fetch next bonus time');
        const data = await response.json();
        return data.nextBonusTime;
    } catch (error) {
        console.error('Error fetching next bonus time:', error);
        return null;
    }
}





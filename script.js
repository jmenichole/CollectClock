document.addEventListener("DOMContentLoaded", () => {
    checkUserLogin();
    loadCasinoData();
    setInterval(updateCountdowns, 1000); // Ensure countdowns are updated every second
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

function loadCasinoData() {
    const casinoList = document.getElementById("casino-list");
    const unusedCasinoList = document.getElementById("unused-casino-list");

    // Clear existing content
    if (casinoList) casinoList.innerHTML = "";
    if (unusedCasinoList) unusedCasinoList.innerHTML = "";

   
    const casinos = [
        // Social Casinos
        { name: "Stake US", category: "Casino", url: "https://stake.us", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Rolla", category: "Casino", url: "https://www.rolla.com", lastCollection: null, nextCollection: null, unused: false },        { name: "SpinPals", category: "Casino", url: "https://www.spinpals.com?referralcode=e851e1a8-c455-4a59-954d-b7fe0bbad04c", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Casino Click", category: "Casino", url: "https://casino.click", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Sportzino", category: "Casino", url: "https://sportzino.com/signup", lastCollection: null, nextAvailable: null, unused: false }, // Moved here
        { name: "Rainbet", category: "Casino", url: "https://rainbet.com/", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Bitsler.io", category: "Casino", url: "https://bitsler.io", lastCollection: null, nextAvailable: null, unused: false },
        { name: "SpinBlitz", category: "Casino", url: "https://www.spinblitz.com", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Fortune Coins", category: "Casino", url: "https://www.fortunecoins.com/", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Pulsz", category: "Casino", url: "https://www.pulsz.com/", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Pulsz Bingo", category: "Casino", url: "https://pulszbingo.com", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Wow Vegas", category: "Casino", url: "https://www.wowvegas.com/", lastCollection: null, nextAvailable: null, unused: false },
        { name: "McLuck", category: "Casino", url: "https://www.mcluck.com", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Winna", category: "Casino", url: "https://winna.com/", lastCollection: null, nextAvailable: null, unused:false },
        { name: "Mega Bonanza", category: "Casino", url: "https://www.megabonanza.com/", lastCollection: null, nextAvailable: null, unused: false },
        { name: "High 5 Casino", category: "Casino", url: "https://high5casino.com/", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Lucky Bird", category: "Casino", url: "https://luckybird.io", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Spree", category: "Casino", url: "https://spree.com/", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Crown Coins", category: "Casino", url: "https://crowncoinscasino.com/", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Real Prize", category: "Casino", url: "https://www.realprize.com/", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Clubs Poker", category: "Casino", url: "https://play.clubs.poker", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Hello Millions", category: "Casino", url: "https://www.hellomillions.com/", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Chanced", category: "Casino", url: "https://chanced.com/", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Rain.gg", category: "Casino", url: "https://rain.gg", lastCollection: null, nextAvailable: null, unused: false }, 
        { name: "PlayFame", category: "Casino", url: "https://www.playfame.com", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Jackpota", category: "Casino", url: "https://www.jackpota.com/", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Zula Casino", category: "Casino", url: "https://www.zulacasino.com/", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Cases.gg", category: "Casino", url: "https://cases.gg/", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Trust Dice", category: "Casino", url: "https://trustdice.win", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Punt", category: "Casino", url: "https://punt.com", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Fortune Wheelz", category: "Casino", url: "https://fortunewheelz.com/", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Zoot", category: "Casino", url: "https://getzoot.us/", lastCollection: null, nextAvailable: null, unused: false },
        { name: "MyPrize.us", category: "Casino", url: "https://myprize.us/invite/", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Modo.us", category: "Casino", url: "https://modo.us", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Spinsala", category: "Casino", url: "https://spinsala.com/", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Clash.gg", category: "Casino", url: "https://clash.gg/r/stakestats", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Chumba", category: "Casino", url: "https://Chumbacasino.com", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Luckyland Slots", category: "Casino", url: "https://luckylandslots.com", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Legendz", category: "Casino", url: "https://legendz.com/", lastCollection: null, nextAvailable: null, unused: false },
        { name: "NoLimitCoins", category: "Casino", url: "https://nolimitcoins.com/", lastCollection: null, nextAvailable: null, unused: false },
    

 

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
    const countdownElements = document.querySelectorAll('.countdown');
    if (countdownElements.length === 0) return;
    
    const casinos = JSON.parse(localStorage.getItem("casinoData")) || {};
    
    Object.keys(casinos).forEach(casinoName => {
        const casino = casinos[casinoName];
        if (!casino.nextAvailable) return;

        const countdownElement = document.getElementById(`countdown-${casinoName}`);
        if (!countdownElement) return;

        const timeLeft = new Date(casino.nextAvailable) - new Date();
        if (timeLeft > 0) {
            countdownElement.innerText = formatCountdown(casino.nextAvailable);
        } else {
            countdownElement.innerText = "Available!";
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
            unused: casino.unused
        };
    });
    localStorage.setItem("casinoData", JSON.stringify(dataToSave));
}





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
        { name: "Stake US", url: "https://stake.us/?c=stakestats", lastCollection: null, nextAvailable: null },
        { name: "Rolla", url: "https://www.rolla.com", lastCollection: null, nextAvailable: null },
        { name: "Sportzino", url: "https://sportzino.com", lastCollection: null, nextAvailable: null },
        { name: "Rainbet", url: "https://rainbet.com/", lastCollection: null, nextAvailable: null },
        { name: "Bitsler.io", url: "https://bitsler.io", lastCollection: null, nextAvailable: null },
        { name: "SpinBlitz", url: "https://www.spinblitz.com", lastCollection: null, nextAvailable: null },
        { name: "Fortune Coins", url: "https://www.fortunecoins.com", lastCollection: null, nextAvailable: null },
        { name: "Pulsz", url: "https://www.pulsz.com", lastCollection: null, nextAvailable: null },
        { name: "Pulsz Bingo", url: "https://pulszbingo.com", lastCollection: null, nextAvailable: null },
        { name: "Wow Vegas", url: "https://www.wowvegas.com", lastCollection: null, nextAvailable: null },
        { name: "McLuck", url: "https://www.mcluck.com", lastCollection: null, nextAvailable: null },
        { name: "Winna", url: "https://winna.com/", lastCollection: null, nextAvailable: null },
        { name: "Mega Bonanza", url: "https://www.megabonanza.com", lastCollection: null, nextAvailable: null },
        { name: "High 5 Casino", url: "https://high5casino.com", lastCollection: null, nextAvailable: null },
        { name: "Lucky Bird", url: "https://luckybird.io", lastCollection: null, nextAvailable: null },
        { name: "Spree", url: "https://spree.com", lastCollection: null, nextAvailable: null },
        { name: "Crown Coins", url: "https://crowncoinscasino.com", lastCollection: null, nextAvailable: null },
        { name: "Real Prize", url: "https://www.realprize.com", lastCollection: null, nextAvailable: null },
        { name: "Clubs Poker", url: "https://play.clubs.poker", lastCollection: null, nextAvailable: null },
        { name: "Hello Millions", url: "https://www.hellomillions.com", lastCollection: null, nextAvailable: null },
        { name: "Rain.gg", url: "https://rain.gg", lastCollection: null, nextAvailable: null },
        { name: "PlayFame", url: "https://www.playfame.com", lastCollection: null, nextAvailable: null },
        { name: "Jackpota", url: "https://www.jackpota.com", lastCollection: null, nextAvailable: null },
        { name: "Zula Casino", url: "https://www.zulacasino.com", lastCollection: null, nextAvailable: null },
        { name: "Cases.gg", url: "https://cases.gg/r/stakestats", lastCollection: null, nextAvailable: null },
        { name: "Trust Dice", url: "https://trustdice.win", lastCollection: null, nextAvailable: null },
        { name: "Punt", url: "https://punt.com", lastCollection: null, nextAvailable: null },
        { name: "Fortune Wheelz", url: "https://fortunewheelz.com", lastCollection: null, nextAvailable: null },
        { name: "Zoot", url: "https://getzoot.us", lastCollection: null, nextAvailable: null },
        { name: "MyPrize.us", url: "https://myprize.us", lastCollection: null, nextAvailable: null },
        { name: "Modo.us", url: "https://modo.us", lastCollection: null, nextAvailable: null },
        { name: "Spinsala", url: "https://spinsala.com/", lastCollection: null, nextAvailable: null },
        { name: "Clash.gg", url: "https://clash.gg/r/stakestats", lastCollection: null, nextAvailable: null },
        { name: "Chumba", url: "https://Chumbacasino.com", lastCollection: null, nextAvailable: null },
        { name: "Luckyland Slots", url: "https://luckylandslots.com", lastCollection: null, nextAvailable: null },
        { name: "Legendz", url: "https://legendz.com", lastCollection: null, nextAvailable: null },
        { name: "Sidepot", url: "https://sidepot.us", lastCollection: null, nextAvailable: null },
        { name: "Shuffle", url: "https://shuffle.com", lastCollection: null, nextAvailable: null },
        { name: "Gamba", url: "https://gamba.com", lastCollection: null, nextAvailable: null },
        { name: "Goated", url: "https://www.goated.com/", lastCollection: null, nextAvailable: null },
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
        } else {
            // Default values for new casinos
            casino.unused = false;
            casino.category = casino.category || "Casinos";
        }
    });

    // Sort casinos by unused status and nextAvailable time
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
                        updateStreak();
                        loadCasinoData(); // Reload the list to update the timer
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





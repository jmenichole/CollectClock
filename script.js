document.addEventListener("DOMContentLoaded", () => {
    loadCasinoData();
});

function loadCasinoData() {
    const casinoList = document.getElementById("casino-list");

    const casinos = [
        { name: "Stake US", url: "https://stake.us/?c=Jmenichole", lastCollection: null, nextAvailable: null },
        { name: "Sportzino", url: "https://sportzino.com/signup/8a105ba6-7ada-45c8-b021-f478ac03c7c4", lastCollection: null, nextAvailable: null },
        { name: "Casino Click", url: "https://casino.click", lastCollection: null, nextAvailable: null },
        { name: "Rainbet", url: "https://rainbet.com/?r=jmenichole", lastCollection: null, nextAvailable: null},
        { name: "Bitsler.io", url: "https://bitsler.io/?ref=jmenichole", lastCollection: null, nextAvailable: null },
        { name: "SpinBlitz", url: "https://www.spinblitz.com/lp/raf?r=606f64a3%2F1246446739", lastCollection: null, nextAvailable: null },
        { name: "Fortune Coins", url: "https://www.fortunecoins.com/signup/3c08936f-8979-4f87-b377-efdbff519029", lastCollection: null, nextAvailable: null },
        { name: "Pulsz", url: "https://www.pulsz.com/?invited_by=utfk4r", lastCollection: null, nextAvailable: null },
        { name: "Pulsz Bingo", url: "https://pulszbingo.com", lastCollection: null, nextAvailable: null },
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
        { name: "Needs VPN Goated", url: "https://www.goated.com/r/YDRZLJ", lastCollection: null, nextAvailable: null },
        { name: "Needs VPN Shuffle", url: "https://shuffle.com?r=jHR7JnWRPF", lastCollection: null, nextAvailable: null },
        { name: "Needs VPN Gamba", url: "https://gamba.com?c=Jme", lastCollection: null, nextAvailable: null },
    ];

    casinos.forEach((casino, index) => {
        casino.id = `casino-${index + 1}`;
        // Initialize all casinos with a neutral sort value
        casinoTimeData[casino.id] = { 
            timeLeft: -1,  // -1 means not set yet
            status: "unknown", // "available", "countdown", or "unknown"
            hidden: false // New property to track if casino is hidden
        };

        const row = document.createElement("tr");
        row.id = `row-${casino.id}`;
        row.className = "casino-row"; // Add class for animations
        row.innerHTML = `
            <td><a href="${casino.url}" target="_blank" class="casino-link" data-id="${casino.id}">${casino.name}</a></td>
            <td class="countdown" id="countdown-${casino.id}">-</td>
            <td><input type="checkbox" class="collect-checkbox" id="checkbox-${casino.id}"></td>
            <td class="action-buttons">
                <button class="hide-button" data-id="${casino.id}">
                    <i class="fas fa-eye-slash"></i>
                </button>
            </td>
        `;
        casinoList.appendChild(row);
    });

    document.querySelectorAll(".casino-link").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const casinoId = event.target.dataset.id;
            startCountdown(casinoId);
            markCheckbox(casinoId);
            window.open(event.target.href, "_blank");
        });
    });

    // Add event listeners to checkboxes to save state when clicked
    document.querySelectorAll(".collect-checkbox").forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            saveCasinoData();
        });
    });

    // Add event listeners to hide buttons
    document.querySelectorAll(".hide-button").forEach((button) => {
        button.addEventListener("click", (event) => {
            const casinoId = event.currentTarget.dataset.id;
            toggleCasinoVisibility(casinoId);
        });
    });

    // Load saved data after creating all casino elements
    const dataLoaded = loadSavedCasinoData();
    
    // If data was successfully loaded, sort the list
    if (dataLoaded) {
        sortCasinoList();
        applyHiddenState(); // Apply hidden state after loading data
    }

    // Set up automatic sorting every minute
    setInterval(sortCasinoList, 60000);
}

// Function to toggle casino visibility
function toggleCasinoVisibility(casinoId) {
    const row = document.getElementById(`row-${casinoId}`);
    
    // Toggle the hidden state in our data structure
    casinoTimeData[casinoId].hidden = !casinoTimeData[casinoId].hidden;
    
    // Apply visual change with animation
    if (casinoTimeData[casinoId].hidden) {
        row.classList.add("hiding");
        setTimeout(() => {
            row.classList.add("hidden");
            row.classList.remove("hiding");
        }, 500); // Match this to the CSS transition time
    } else {
        row.classList.remove("hidden");
        row.classList.add("revealing");
        setTimeout(() => {
            row.classList.remove("revealing");
        }, 500);
    }
    
    // Save the updated state
    saveCasinoData();
}

// Function to apply hidden state based on saved data
function applyHiddenState() {
    Object.keys(casinoTimeData).forEach(casinoId => {
        const row = document.getElementById(`row-${casinoId}`);
        if (row && casinoTimeData[casinoId].hidden) {
            row.classList.add("hidden");
        }
    });
}

// Global object to store casino time data for sorting
const casinoTimeData = {};

// Storage key for casino data
const STORAGE_KEY = 'collectClockCasinoData';

// Function to save casino data to localStorage
function saveCasinoData() {
    const dataToSave = {
        casinoTimeData: casinoTimeData,
        checkboxes: {},
        lastUpdated: new Date().getTime()
    };
    
    // Save checkbox states
    document.querySelectorAll('.collect-checkbox').forEach(checkbox => {
        const id = checkbox.id.replace('checkbox-', '');
        dataToSave.checkboxes[id] = checkbox.checked;
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
}

// Function to load casino data from localStorage
function loadSavedCasinoData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) return false;
    
    try {
        const parsedData = JSON.parse(savedData);
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - parsedData.lastUpdated) / 1000); // in seconds
        
        // Restore casino time data
        Object.keys(parsedData.casinoTimeData).forEach(casinoId => {
            const casinoData = parsedData.casinoTimeData[casinoId];
            
            // Preserve hidden state if it exists in saved data
            if (casinoData.hidden !== undefined) {
                casinoTimeData[casinoId].hidden = casinoData.hidden;
            }
            
            // Skip if status is unknown
            if (casinoData.status === "unknown") {
                casinoTimeData[casinoId].status = casinoData.status;
                return;
            }
            
            // If it was in countdown status, adjust the time
            if (casinoData.status === "countdown") {
                const newTimeLeft = casinoData.timeLeft - elapsedTime;
                
                if (newTimeLeft <= 0) {
                    // Timer has expired, mark as available
                    casinoTimeData[casinoId].timeLeft = -1;
                    casinoTimeData[casinoId].status = "available";
                    
                    // Update the countdown display
                    const countdownEl = document.getElementById(`countdown-${casinoId}`);
                    if (countdownEl) {
                        countdownEl.textContent = "AVAILABLE";
                        countdownEl.classList.add("available"); // Add class for styling
                    }
                } else {
                    // Timer still running
                    casinoTimeData[casinoId].timeLeft = newTimeLeft;
                    casinoTimeData[casinoId].status = "countdown";
                    
                    // Restart the countdown with adjusted time
                    restartCountdown(casinoId, newTimeLeft);
                }
            } else {
                // For available status, just restore it
                casinoTimeData[casinoId].timeLeft = casinoData.timeLeft;
                casinoTimeData[casinoId].status = casinoData.status;
                
                // Update the countdown display
                const countdownEl = document.getElementById(`countdown-${casinoId}`);
                if (countdownEl && casinoData.status === "available") {
                    countdownEl.textContent = "AVAILABLE";
                    countdownEl.classList.add("available"); // Add class for styling
                }
            }
        });
        
        // Restore checkbox states
        Object.keys(parsedData.checkboxes).forEach(casinoId => {
            const checkbox = document.getElementById(`checkbox-${casinoId}`);
            if (checkbox) {
                checkbox.checked = parsedData.checkboxes[casinoId];
                
                // Add visual indicator for checked items
                const row = document.getElementById(`row-${casinoId}`);
                if (row && parsedData.checkboxes[casinoId]) {
                    row.classList.add("collected");
                }
            }
        });
        
        return true;
    } catch (error) {
        console.error("Error loading saved casino data:", error);
        return false;
    }
}

function startCountdown(casinoId) {
    const countdownEl = document.getElementById(`countdown-${casinoId}`);
    let timeLeft = 86400; // 24 hours in seconds

    // Remove available class if it exists
    countdownEl.classList.remove("available");

    // Update casino time data
    casinoTimeData[casinoId] = {
        timeLeft: timeLeft,
        status: "countdown",
        hidden: casinoTimeData[casinoId].hidden // Preserve hidden state
    };

    // Add animation class to the row
    const row = document.getElementById(`row-${casinoId}`);
    row.classList.add("countdown-started");
    setTimeout(() => {
        row.classList.remove("countdown-started");
    }, 1000);

    // Save data immediately when a countdown starts
    saveCasinoData();

    function updateCountdown() {
        let hours = Math.floor(timeLeft / 3600);
        let minutes = Math.floor((timeLeft % 3600) / 60);
        let seconds = timeLeft % 60;

        countdownEl.textContent = `${hours}h ${minutes}m ${seconds}s`;
        
        // Update the timeLeft in our data structure for sorting
        casinoTimeData[casinoId].timeLeft = timeLeft;

        if (timeLeft > 0) {
            timeLeft--;
            setTimeout(updateCountdown, 1000);
            
            // Sort every minute (to avoid too frequent DOM updates)
            if (timeLeft % 60 === 0) {
                sortCasinoList();
                // Save data every minute
                saveCasinoData();
            }
        } else {
            countdownEl.textContent = "AVAILABLE";
            countdownEl.classList.add("available"); // Add class for styling
            casinoTimeData[casinoId].status = "available";
            casinoTimeData[casinoId].timeLeft = -1;
            
            // Add animation class for available notification
            row.classList.add("countdown-finished");
            setTimeout(() => {
                row.classList.remove("countdown-finished");
            }, 2000);
            
            sortCasinoList();
            saveCasinoData();
        }
    }

    updateCountdown();
    sortCasinoList();
}

// Function to restart a countdown from a saved timeLeft value
function restartCountdown(casinoId, savedTimeLeft) {
    const countdownEl = document.getElementById(`countdown-${casinoId}`);
    if (!countdownEl) return;
    
    let timeLeft = savedTimeLeft;

    // Remove available class if it exists
    countdownEl.classList.remove("available");

    function updateCountdown() {
        let hours = Math.floor(timeLeft / 3600);
        let minutes = Math.floor((timeLeft % 3600) / 60);
        let seconds = timeLeft % 60;

        countdownEl.textContent = `${hours}h ${minutes}m ${seconds}s`;
        
        // Update the timeLeft in our data structure for sorting
        casinoTimeData[casinoId].timeLeft = timeLeft;

        if (timeLeft > 0) {
            timeLeft--;
            setTimeout(updateCountdown, 1000);
            
            // Sort every minute (to avoid too frequent DOM updates)
            if (timeLeft % 60 === 0) {
                sortCasinoList();
                // Save data every minute
                saveCasinoData();
            }
        } else {
            countdownEl.textContent = "AVAILABLE";
            countdownEl.classList.add("available"); // Add class for styling
            casinoTimeData[casinoId].status = "available";
            casinoTimeData[casinoId].timeLeft = -1;
            
            // Add animation class for available notification
            const row = document.getElementById(`row-${casinoId}`);
            row.classList.add("countdown-finished");
            setTimeout(() => {
                row.classList.remove("countdown-finished");
            }, 2000);
            
            sortCasinoList();
            saveCasinoData();
        }
    }

    updateCountdown();
}

// Function to sort the casino list
function sortCasinoList() {
    const casinoList = document.getElementById("casino-list");
    const rows = Array.from(casinoList.querySelectorAll("tr"));
    
    // Sort the rows based on their status and timeLeft
    rows.sort((a, b) => {
        const aId = a.id.replace('row-', '');
        const bId = b.id.replace('row-', '');
        
        const aData = casinoTimeData[aId] || { status: "unknown", timeLeft: -1, hidden: false };
        const bData = casinoTimeData[bId] || { status: "unknown", timeLeft: -1, hidden: false };
        
        // Hidden items go to the bottom
        if (aData.hidden && !bData.hidden) return 1;
        if (!aData.hidden && bData.hidden) return -1;
        
        // First sort by status: "available" > "countdown" > "unknown"
        if (aData.status === "available" && bData.status !== "available") return -1;
        if (aData.status !== "available" && bData.status === "available") return 1;
        
        // If both are countdown, sort by timeLeft (ascending)
        if (aData.status === "countdown" && bData.status === "countdown") {
            return aData.timeLeft - bData.timeLeft;
        }
        
        // If both are unknown or mix of countdown and unknown
        return 0;
    });
    
    // Reappend the rows in the new order with animation
    rows.forEach(row => {
        row.classList.add("sorting");
        casinoList.appendChild(row);
        // Remove the class after animation completes
        setTimeout(() => {
            row.classList.remove("sorting");
        }, 300);
    });
}

function markCheckbox(casinoId) {
    const checkbox = document.getElementById(`checkbox-${casinoId}`);
    checkbox.checked = true;
    
    // Add visual indicator for collected items
    const row = document.getElementById(`row-${casinoId}`);
    row.classList.add("collected");
    
    saveCasinoData(); // Save when a checkbox is checked
}

// Add an event listener to save data before the page is unloaded
window.addEventListener('beforeunload', () => {
    saveCasinoData();
});

// Add button to toggle visibility of hidden casinos
document.addEventListener("DOMContentLoaded", () => {
    const controlsDiv = document.createElement("div");
    controlsDiv.className = "controls";
    controlsDiv.innerHTML = `
        <button id="toggle-hidden" class="control-button">
            <i class="fas fa-eye"></i> Show Hidden
        </button>
        <button id="reset-all" class="control-button">
            <i class="fas fa-redo"></i> Reset All
        </button>
    `;
    
    document.querySelector("header").appendChild(controlsDiv);
    
    // Toggle hidden casinos
    document.getElementById("toggle-hidden").addEventListener("click", () => {
        const button = document.getElementById("toggle-hidden");
        const hiddenRows = document.querySelectorAll(".hidden");
        
        if (button.classList.contains("showing-hidden")) {
            // Hide them again
            hiddenRows.forEach(row => {
                row.style.display = "none";
            });
            button.innerHTML = '<i class="fas fa-eye"></i> Show Hidden';
            button.classList.remove("showing-hidden");
        } else {
            // Show them
            hiddenRows.forEach(row => {
                row.style.display = "table-row";
                row.style.opacity = "0.5";
            });
            button.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Hidden';
            button.classList.add("showing-hidden");
        }
    });
    
    // Reset all button
    document.getElementById("reset-all").addEventListener("click", () => {
        if (confirm("Reset all timers and checkboxes?")) {
            localStorage.removeItem(STORAGE_KEY);
            location.reload();
        }
    });
});
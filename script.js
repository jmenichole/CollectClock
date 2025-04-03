document.addEventListener("DOMContentLoaded", () => {
    loadCasinoData();
    loadMostCollectedCasino();
});

let clickCount = 0;
function incrementClickCounter() {
    clickCount++;
    if (clickCount === 10) {
        showCongratsPopup();
    }
}

function showCongratsPopup() {
    const popup = document.createElement("div");
    popup.classList.add("congrats-popup");
    popup.innerHTML = `
        <div class="popup-content">
            <h2>💸 Way to get that money!</h2>
            <img src="https://media.tenor.com/twtTj9mRY5kAAAAd/louknae.gif" alt="Congrats" />
            <button id="close-popup">Keep Collecting!</button>
        </div>
    `;
    document.body.appendChild(popup);

    document.getElementById("close-popup").addEventListener("click", () => {
        popup.remove();
    });
}

// Global object to store casino time data for sorting
const casinoTimeData = {};

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
            status: "unknown" // "available", "countdown", or "unknown"
        };

        const row = document.createElement("tr");
        row.id = `row-${casino.id}`;
        row.innerHTML = `
            <td><a href="${casino.url}" target="_blank" class="casino-link" data-id="${casino.id}">${casino.name}</a></td>
            <td>-</td>
            <td class="countdown" id="countdown-${casino.id}">-</td>
            <td><input type="checkbox" class="collect-checkbox" id="checkbox-${casino.id}"></td>
        `;
        casinoList.appendChild(row);
    });

    document.querySelectorAll(".casino-link").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const casinoId = event.target.dataset.id;
            startCountdown(casinoId);
            markCheckbox(casinoId);
            incrementClickCounter();
            window.open(event.target.href, "_blank");
        });
    });
}

function startCountdown(casinoId) {
    const countdownEl = document.getElementById(`countdown-${casinoId}`);
    let timeLeft = 86400; // 24 hours in seconds

    // Update casino time data
    casinoTimeData[casinoId] = {
        timeLeft: timeLeft,
        status: "countdown"
    };

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
            }
        } else {
            countdownEl.textContent = "AVAILABLE";
            casinoTimeData[casinoId].status = "available";
            casinoTimeData[casinoId].timeLeft = -1;
            sortCasinoList();
        }
    }

    updateCountdown();
    sortCasinoList();
}

// Function to sort the casino list
function sortCasinoList() {
    const casinoList = document.getElementById("casino-list");
    const rows = Array.from(casinoList.querySelectorAll("tr"));
    
    // Sort the rows based on their status and timeLeft
    rows.sort((a, b) => {
        const aId = a.id.replace('row-', '');
        const bId = b.id.replace('row-', '');
        
        const aData = casinoTimeData[aId] || { status: "unknown", timeLeft: -1 };
        const bData = casinoTimeData[bId] || { status: "unknown", timeLeft: -1 };
        
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
    
    // Reappend the rows in the new order
    rows.forEach(row => casinoList.appendChild(row));
}

function markCheckbox(casinoId) {
    document.getElementById(`checkbox-${casinoId}`).checked = true;
}

function loadMostCollectedCasino() {
    const mostCollectedEl = document.getElementById("most-collected");
    mostCollectedEl.textContent = "Loading...";

    setTimeout(() => {
        mostCollectedEl.textContent = "Stake.us";
    }, 2000);
}

document.addEventListener("DOMContentLoaded", async function () {
    const loginButton = document.getElementById("login-button");
    const userInfoContainer = document.getElementById("user-info");

    // Check if user data is already stored
    const storedUser = localStorage.getItem("discordUser");
    if (storedUser) {
        displayUserInfo(JSON.parse(storedUser));
    } else {
        // Check if there's an auth code in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        if (code) {
            await fetchUserData(code);
        }
    }

    async function fetchUserData(authCode) {
        try {
            const clientId = "1336968746450812928";
            const clientSecret = "gR0uv3QZ0UL6xYW1U7nrXohtthpuU-Or";
            const redirectUri = "https://jmenichole.github.io/CollectClock/";
            
            // Exchange the auth code for an access token
            const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: "authorization_code",
                    code: authCode,
                    redirect_uri: redirectUri,
                }),
            });

            const tokenData = await tokenResponse.json();
            if (!tokenData.access_token) return;

            // Fetch user info using the access token
            const userResponse = await fetch("https://discord.com/api/users/@me", {
                headers: { Authorization: `Bearer ${tokenData.access_token}` },
            });

            const userData = await userResponse.json();
            localStorage.setItem("discordUser", JSON.stringify(userData));

            displayUserInfo(userData);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    function displayUserInfo(user) {
        if (!loginButton) return;
        
        loginButton.style.display = "none"; // Hide login button

        userInfoContainer.innerHTML = `
            <img src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png" alt="Avatar" width="50">
            <span>Welcome, ${user.username}!</span>
            <button id="logout-button">Logout</button>
        `;

        document.getElementById("logout-button").addEventListener("click", function () {
            localStorage.removeItem("discordUser");
            window.location.href = "https://jmenichole.github.io/CollectClock/"; // Refresh
        });
    }
});
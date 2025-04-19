document.addEventListener("DOMContentLoaded", () => {
    loadCasinoData();
    setInterval(updateCountdowns, 1000); // Ensure countdowns are updated every second
});

function loadCasinoData() {
    const casinoList = document.getElementById("casino-list");
    const unusedCasinoList = document.getElementById("unused-casino-list");

    // Clear existing content
    casinoList.innerHTML = "";
    unusedCasinoList.innerHTML = "";

    const casinos = [
        // Social Casinos
        { name: "Stake US", category: "Casino", url: "https://stake.us/?c=Jmenichole", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Rolla", category: "Casino", url: "https://www.rolla.com/?raf=3873", lastCollection: null, nextCollection: null, unused: false },        { name: "SpinPals", category: "Casino", url: "https://www.spinpals.com?referralcode=e851e1a8-c455-4a59-954d-b7fe0bbad04c", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Casino Click", category: "Casino", url: "https://casino.click", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Sportzino", category: "Casino", url: "https://sportzino.com/signup/8a105ba6-7ada-45c8-b021-f478ac03c7c4", lastCollection: null, nextAvailable: null, unused: false }, // Moved here
        { name: "Rainbet", category: "Casino", url: "https://rainbet.com/?r=jmenichole", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Bitsler.io", category: "Casino", url: "https://bitsler.io/?ref=jmenichole", lastCollection: null, nextAvailable: null, unused: false },
        { name: "SpinBlitz", category: "Casino", url: "https://www.spinblitz.com/lp/raf?r=606f64a3%2F1246446739", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Fortune Coins", category: "Casino", url: "https://www.fortunecoins.com/signup/3c08936f-8979-4f87-b377-efdbff519029", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Pulsz", category: "Casino", url: "https://www.pulsz.com/?invited_by=utfk4r", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Pulsz Bingo", category: "Casino", url: "https://pulszbingo.com", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Wow Vegas", category: "Casino", url: "https://www.wowvegas.com/?raf=3615494", lastCollection: null, nextAvailable: null, unused: false },
        { name: "McLuck", category: "Casino", url: "https://www.mcluck.com/?r=908900038", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Mega Bonanza", category: "Casino", url: "https://www.megabonanza.com/?r=72781897", lastCollection: null, nextAvailable: null, unused: false },
        { name: "High 5 Casino", category: "Casino", url: "https://high5casino.com/gc?adId=INV001%3AJmenichole", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Lucky Bird", category: "Casino", url: "https://luckybird.io/?c=c_jmenichole", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Spree", category: "Casino", url: "https://spree.com/?r=440894", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Crown Coins", category: "Casino", url: "https://crowncoinscasino.com/?utm_campaign=59048bf4-dbeb-4c58-b690-d7ad11bdb847&utm_source=friends", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Real Prize", category: "Casino", url: "https://www.realprize.com/refer/317136", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Clubs Poker", category: "Casino", url: "https://play.clubs.poker/?referralCode=104192", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Hello Millions", category: "Casino", url: "https://www.hellomillions.com/referred-by-friend?r=26d6760f%2F1236643867", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Chanced", category: "Casino", url: "https://chanced.com/c/m9q2mi", lastCollection: null, nextAvailable: null, unused: false },
        { name: "PlayFame", category: "Casino", url: "https://www.playfame.com/?r=1275975417", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Jackpota", category: "Casino", url: "https://www.jackpota.com/?r=85453282", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Zula Casino", category: "Casino", url: "https://www.zulacasino.com/signup/221ddd92-862e-45d8-acc0-4cd2c26f7cdd", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Cases.gg", category: "Casino", url: "https://cases.gg/r/JMENICHOLE", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Trust Dice", category: "Casino", url: "https://trustdice.win/faucet/?ref=u_jmenichole", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Punt", category: "Casino", url: "https://punt.com/c/cg60pd", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Fortune Wheelz", category: "Casino", url: "https://fortunewheelz.com/?invited_by=P36ZS6", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Zoot", category: "Casino", url: "https://getzoot.us/?referralCode=ZOOTwithJMENICHOLE", lastCollection: null, nextAvailable: null, unused: false },
        { name: "MyPrize.us", category: "Casino", url: "https://myprize.us/invite/quietMorning197", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Modo.us", category: "Casino", url: "https://modo.us?referralCode=61MN6A", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Spinsala", category: "Casino", url: "https://spinsala.com/en?invite=daym", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Clash.gg", category: "Casino", url: "https://clash.gg/r/stakestats", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Chumba", category: "Casino", url: "https://Chumbacasino.com", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Luckyland Slots", category: "Casino", url: "https://luckylandslots.com", lastCollection: null, nextAvailable: null, unused: false },
        { name: "Legendz", category: "Casino", url: "https://legendz.com/?referred_by_id=221602", lastCollection: null, nextAvailable: null, unused: false },
        { name: "NoLimitCoins", category: "Casino", url: "https://nolimitcoins.com/?invited_by=ZI1JIU", lastCollection: null, nextAvailable: null, unused: false },
    

 

        // Sports Betting Sites (no timer)
   
        { name: "Slips", category: "Sports", url: "https://slips.com/invite?code=6901", unused: false },
        { name: "PrizePicks", category: "Sports", url: "https://app.prizepicks.com/sign-up?invite_code=PR-43MTIEY", unused: false },
        { name: "Dabble", category: "Sports", url: "https://click.dabble.com/GaFA/uurlzxu2", unused: false }, 
        { name: "Sleeper", category: "Sports", url: "https://sleeper.com/promo/RF-AKRAUS1298", unused: false },
        { name: "Sports Millions", category: "Sports", url: "https://www.sportsmillions.com/referred-by-friend?r=918d9a2f%2F1780990270", unused: false },
        { name: "ParlayPlay", category: "Sports", url: "https://parlayplay.io/account/signup?coupon=em4919", unused: false }
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
            checkbox.addEventListener("change", () => {
                casino.unused = checkbox.checked;
                saveCasinoData(casinos);
                loadCasinoData(); // Reload the list to reflect changes
            });

            // Add event listener for the casino link
            const link = document.querySelector(`a[data-id="${casino.id}"]`);
            link.addEventListener("click", () => {
                casino.lastCollection = new Date().toISOString();
                casino.nextAvailable = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours from now
                saveCasinoData(casinos);
                loadCasinoData(); // Reload the list to update the timer
            });
        }
    });

    // Save the updated casino data
    saveCasinoData(casinos);
}

// Countdown logic for each timer cell
function updateCountdowns() {
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

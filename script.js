// Casino data including referral links and last collection times
let casinos = [
    { name: "Sportzino", url: "https://sportzino.com/signup/8a105ba6-7ada-45c8-b021-f478ac03c7c4", lastCollection: null, nextAvailable: null },
    { name: "Sidepot", url: "https://sidepot.com", lastCollection: null, nextAvailable: null },
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
    { name: "Play Fame", url: "https://www.playfame.com/?r=1275975417", lastCollection: null, nextAvailable: null },
    { name: "Jackpota", url: "https://www.jackpota.com/?r=85453282", lastCollection: null, nextAvailable: null },
    { name: "Zula Casino", url: "https://www.zulacasino.com/signup/221ddd92-862e-45d8-acc0-4cd2c26f7cdd", lastCollection: null, nextAvailable: null },
    { name: "Ding Ding Ding", url: "https://dingdingding.com/?referral=190cd69a-5af4-51bf-b418-9a35effcdf04", lastCollection: null, nextAvailable: null },
    { name: "Cases.gg", url: "https://cases.gg/r/JMENICHOLE", lastCollection: null, nextAvailable: null },
    { name: "Trust Dice", url: "https://trustdice.win/faucet/?ref=u_jmenichole", lastCollection: null, nextAvailable: null },
    { name: "Punt", url: "https://punt.com/c/cg60pd", lastCollection: null, nextAvailable: null },
    { name: "Fortune Wheelz", url: "https://fortunewheelz.com/?invited_by=P36ZS6", lastCollection: null, nextAvailable: null },
    { name: "Get Zoot", url: "https://getzoot.us/?referralCode=ZOOTwithJMENICHOLE", lastCollection: null, nextAvailable: null },
    { name: "Luckyland Slots", url: "https://luckylandslots.com", lastCollection: null, nextAvailable: null },
    { name: "Chumba Casino", url: "https://chumbacasino.com", lastCollection: null, nextAvailable: null },
    { name: "Global Poker", url: "https://globalpoker.com", lastCollection: null, nextAvailable: null }
];

// Load saved casino data from localStorage
const savedData = localStorage.getItem("casinoData");
if (savedData) {
    const parsedData = JSON.parse(savedData);
    casinos = casinos.map(casino => {
        const savedCasino = parsedData.find(c => c.name === casino.name);
        return savedCasino ? savedCasino : casino;
    });
}

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
            if (currentDateTime < nextTime) {
                isAvailable = false;
                timeUntil = `Next in ${getTimeUntil(nextTime, currentDateTime)}`;
            }
        }

        row.innerHTML = `
            <td><a href="${casino.url}" target="_blank" class="casino-link">${casino.name}</a></td>
            <td class="${isAvailable ? 'bonus-ready' : 'waiting'}">${timeUntil}</td>
            <td><input type="checkbox" ${isAvailable ? "" : "checked disabled"} onclick="handleCheckboxClick('${casino.name}', this)"></td>
        `;
        tableBody.appendChild(row);
    });
}

function handleCheckboxClick(casinoName, checkbox) {
    const casino = casinos.find((c) => c.name === casinoName);
    if (casino && checkbox.checked) {
        const collectionTime = new Date();
        casino.lastCollection = collectionTime.toISOString();
        casino.nextAvailable = new Date(collectionTime.getTime() + 24 * 60 * 60 * 1000).toISOString();
        localStorage.setItem("casinoData", JSON.stringify(casinos));
        updateTable();
    }
}

function getTimeUntil(nextTime, currentTime) {
    const diff = nextTime - currentTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}

// Initialize table on page load
document.addEventListener("DOMContentLoaded", updateTable);


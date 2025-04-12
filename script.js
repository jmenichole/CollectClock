document.addEventListener("DOMContentLoaded", () => {
    loadCasinoData();
});

function loadCasinoData() {
    const casinoList = document.getElementById("casino-list");

    const casinos = [
        // Sports Betting Sites
        { name: "PrizePicks", category: "Sports", url: "https://prizepicks.com/sign-up?invite_code=PR-43MTIEY", lastCollection: null, nextAvailable: null },
        { name: "Sleeper", category: "Sports", url: "https://sleeper.com/promo/RF-AKRAUS1298", lastCollection: null, nextAvailable: null },
        { name: "ParlayPlay", category: "Sports", url: "https://parlayplay.io/account/signup?coupon=em4919", lastCollection: null, nextAvailable: null },
        { name: "Sportzino", category: "Sports", url: "https://sportzino.com/signup/8a105ba6-7ada-45c8-b021-f478ac03c7c4", lastCollection: null, nextAvailable: null },
        
        // Regular Casinos
        { name: "Stake US", category: "Casino", url: "https://stake.us/?c=Jmenichole", lastCollection: null, nextAvailable: null },
        { name: "SpinPals", category: "Casino", url: "https://www.spinpals.com?referralcode=e851e1a8-c455-4a59-954d-b7fe0bbad04c", lastCollection: null, nextAvailable: null },
        { name: "Casino Click", category: "Casino", url: "https://casino.click", lastCollection: null, nextAvailable: null },
        { name: "Rainbet", category: "Casino", url: "https://rainbet.com/?r=jmenichole", lastCollection: null, nextAvailable: null},
        { name: "Bitsler.io", category: "Casino", url: "https://bitsler.io/?ref=jmenichole", lastCollection: null, nextAvailable: null },
        { name: "SpinBlitz", category: "Casino", url: "https://www.spinblitz.com/lp/raf?r=606f64a3%2F1246446739", lastCollection: null, nextAvailable: null },
        { name: "Fortune Coins", category: "Casino", url: "https://www.fortunecoins.com/signup/3c08936f-8979-4f87-b377-efdbff519029", lastCollection: null, nextAvailable: null },
        { name: "Pulsz", category: "Casino", url: "https://www.pulsz.com/?invited_by=utfk4r", lastCollection: null, nextAvailable: null },
        { name: "Pulsz Bingo", category: "Casino", url: "https://pulszbingo.com", lastCollection: null, nextAvailable: null },
        { name: "Wow Vegas", category: "Casino", url: "https://www.wowvegas.com/?raf=3615494", lastCollection: null, nextAvailable: null },
        { name: "McLuck", category: "Casino", url: "https://www.mcluck.com/?r=908900038", lastCollection: null, nextAvailable: null },
        { name: "Mega Bonanza", category: "Casino", url: "https://www.megabonanza.com/?r=72781897", lastCollection: null, nextAvailable: null },
        { name: "High 5 Casino", category: "Casino", url: "https://high5casino.com/gc?adId=INV001%3AJmenichole", lastCollection: null, nextAvailable: null },
        { name: "Lucky Bird", category: "Casino", url: "https://luckybird.io/?c=c_jmenichole", lastCollection: null, nextAvailable: null },
        { name: "Spree", category: "Casino", url: "https://spree.com/?r=440894", lastCollection: null, nextAvailable: null },
        { name: "Crown Coins", category: "Casino", url: "https://crowncoinscasino.com/?utm_campaign=59048bf4-dbeb-4c58-b690-d7ad11bdb847&utm_source=friends", lastCollection: null, nextAvailable: null },
        { name: "Real Prize", category: "Casino", url: "https://www.realprize.com/refer/317136", lastCollection: null, nextAvailable: null },
        { name: "Clubs Poker", category: "Casino", url: "https://play.clubs.poker/?referralCode=104192", lastCollection: null, nextAvailable: null },
        { name: "Hello Millions", category: "Casino", url: "https://www.hellomillions.com/referred-by-friend?r=26d6760f%2F1236643867", lastCollection: null, nextAvailable: null },
        { name: "Chanced", category: "Casino", url: "https://chanced.com/c/m9q2mi", lastCollection: null, nextAvailable: null },
        { name: "PlayFame", category: "Casino", url: "https://www.playfame.com/?r=1275975417", lastCollection: null, nextAvailable: null },
        { name: "Jackpota", category: "Casino", url: "https://www.jackpota.com/?r=85453282", lastCollection: null, nextAvailable: null },
        { name: "Zula Casino", category: "Casino", url: "https://www.zulacasino.com/signup/221ddd92-862e-45d8-acc0-4cd2c26f7cdd", lastCollection: null, nextAvailable: null },
        { name: "Cases.gg", category: "Casino", url: "https://cases.gg/r/JMENICHOLE", lastCollection: null, nextAvailable: null },
        { name: "Trust Dice", category: "Casino", url: "https://trustdice.win/faucet/?ref=u_jmenichole", lastCollection: null, nextAvailable: null },
        { name: "Punt", category: "Casino", url: "https://punt.com/c/cg60pd", lastCollection: null, nextAvailable: null },
        { name: "Fortune Wheelz", category: "Casino", url: "https://fortunewheelz.com/?invited_by=P36ZS6", lastCollection: null, nextAvailable: null },
        { name: "Zoot", category: "Casino", url: "https://getzoot.us/?referralCode=ZOOTwithJMENICHOLE", lastCollection: null, nextAvailable: null },
        { name: "MyPrize.us", category: "Casino", url: "https://myprize.us/invite/quietMorning197", lastCollection: null, nextAvailable: null },
        { name: "Modo.us", category: "Casino", url: "https://modo.us?referralCode=61MN6A", lastCollection: null, nextAvailable: null },
        { name: "Spinsala", category: "Casino", url: "https://spinsala.com/en?invite=daym", lastCollection: null, nextAvailable: null },
        { name: "Clash.gg", category: "Casino", url: "https://clash.gg/r/stakestats", lastCollection: null, nextAvailable: null },
        { name: "Chumba", category: "Casino", url: "https://Chumbacasino.com", lastCollection: null, nextAvailable: null },
        { name: "Luckyland Slots", category: "Casino", url: "https://luckylandslots.com", lastCollection: null, nextAvailable: null },
        { name: "Legendz", category: "Casino", url: "https://legendz.com/?referred_by_id=221602", lastCollection: null, nextAvailable: null },
        { name: "NoLimitCoins", category: "Casino", url: "https://nolimitcoins.com/?invited_by=ZI1JIU", lastCollection: null, nextAvailable: null },
        
        // VPN Required Casinos
        { name: "Goated", category: "VPN Required", url: "https://www.goated.com/r/YDRZLJ", lastCollection: null, nextAvailable: null },
        { name: "Shuffle", category: "VPN Required", url: "https://shuffle.com?r=jHR7JnWRPF", lastCollection: null, nextAvailable: null },
        { name: "Gamba", category: "VPN Required", url: "https://gamba.com?c=Jme", lastCollection: null, nextAvailable: null }
    ];

    // Sort casinos by category
    casinos.sort((a, b) => {
        // First sort by category
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;
        // Then by name within each category
        return a.name.localeCompare(b.name);
    });

    // Create category headers and add casinos
    let currentCategory = "";
    
    casinos.forEach((casino, index) => {
        // Add category header if it's a new category
        if (casino.category !== currentCategory) {
            currentCategory = casino.category;
            const headerRow = document.createElement("tr");
            headerRow.className = "category-header";
            headerRow.innerHTML = `<td colspan="4">${currentCategory}</td>`;
            casinoList.appendChild(headerRow);
        }

        casino.id = `casino-${index + 1}`;
        casinoTimeData[casino.id] = { 
            timeLeft: -1,
            status: "unknown",
            hidden: false
        };

        const row = document.createElement("tr");
        row.id = `row-${casino.id}`;
        row.className = "casino-row";
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

    // Rest of your existing code...
    [REST OF THE EXISTING JAVASCRIPT CODE REMAINS THE SAME]
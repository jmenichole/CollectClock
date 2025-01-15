// Casino data array with referral links
const casinos = [
    {
        name: "Fortune Coins",
        url: "https://www.fortunecoins.com/signup/3c08936f-8979-4f87-b377-efdbff519029",
        lastCollection: null,
        nextAvailable: null
    },
    // ... (other casino objects omitted for brevity)
    {
        name: "Global Poker",
        url: "https://www.globalpoker.com",
        lastCollection: null,
        nextAvailable: null
    }
];

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

// Set current date/time
let currentDateTime = new Date();

// Update table every second
setInterval(() => {
    currentDateTime = new Date(currentDateTime.getTime() + 1000);
    updateTable();
}, 1000);

// Initial table update
updateTable();

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
            <td>
                <a href="${casino.url}" 
                   target="_blank" 
                   onclick="handleCasinoClick('${casino.name}', event)"
                   ${!isAvailable ? 'class="disabled-link"' : ''}>
                   ${casino.name}
                </a>
            </td>
            <td>${isAvailable ? 'AVAILABLE' : timeUntil}</td>
            <td>
                <input 
                    type="checkbox" 
                    id="${checkboxId}"
                    ${!isAvailable ? 'checked' : ''}
                    onclick="handleCheckboxClick('${casino.name}', this)"
                >
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Save the current state of the casinos
    localStorage.setItem('casinoData', JSON.stringify(casinos));
}

function handleCheckboxClick(casinoName, checkbox) {
    const casino = casinos.find(c => c.name === casinoName);
    if (casino) {
        if (checkbox.checked) {
            collect(casinoName);
        } else {
            casino.lastCollection = null;
            casino.nextAvailable = null;
            localStorage.setItem('casinoData', JSON.stringify(casinos));
            updateTable();
        }
    }
}

function handleCasinoClick(casinoName, event) {
    const casino = casinos.find(c => c.name === casinoName);
    if (casino) {
        const nextTime = new Date(casino.nextAvailable || 0);
        if (currentDateTime < nextTime) {
            event.preventDefault();
            return;
        }
        collect(casinoName);
    }
}

function collect(casinoName) {
    const casino = casinos.find(c => c.name === casinoName);
    if (casino) {
        const collectionTime = new Date(currentDateTime.getTime());
        casino.lastCollection = collectionTime.toISOString();
        casino.nextAvailable = new Date(collectionTime.getTime() +

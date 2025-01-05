// Keep the casino data structure and savedData loading the same

let currentDateTime = new Date('2025-01-05 05:16:48');

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

        row.innerHTML = `
            <td><a href="${casino.url}" target="_blank">${casino.name}</a></td>
            <td>${casino.lastCollection || '-'}</td>
            <td>${casino.nextAvailable || '-'}</td>
            <td class="status-${isAvailable ? 'available' : 'not-available'}">AVAILABLE</td>
            <td>${!isAvailable ? timeUntil : ''}</td>
            <td><button onclick="collect('${casino.name}')" ${!isAvailable ? 'disabled' : ''} style="cursor: pointer;">Collect</button></td>
        `;
        
        tableBody.appendChild(row);
    });
}

function getTimeUntil(nextTime, currentTime) {
    const diff = nextTime - currentTime;
    
    const totalHours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${totalHours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function collect(casinoName) {
    const casino = casinos.find(c => c.name === casinoName);
    if (casino) {
        casino.lastCollection = currentDateTime.toISOString();
        casino.nextAvailable = new Date(currentDateTime.getTime() + 24*60*60*1000).toISOString();
        
        // Start countdown immediately
        updateTable();
        
        // Save to localStorage
        localStorage.setItem('casinoData', JSON.stringify(casinos));
    }
}

// Update time and table every second
setInterval(() => {
    currentDateTime = new Date(currentDateTime.getTime() + 1000);
    updateTable();
}, 1000);

// Initial update
document.addEventListener('DOMContentLoaded', () => {
    updateTable();
});

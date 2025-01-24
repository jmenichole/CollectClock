const casinos = [
  {
    name: "Fortune Coins",
    url: "https://www.fortunecoins.com/signup/3c08936f-8979-4f87-b377-efdbff519029",
    lastCollection: null,
    nextAvailable: null
  },
  {
    name: "Pulsz",
    url: "https://www.pulsz.com/?invited_by=utfk4r",
    lastCollection: null,
    nextAvailable: null
  },
  {
    name: "Stake.us",
    url: "https://stake.us/?c=Jmenichole",
    lastCollection: null,
    nextAvailable: null
  },
  {
    name: "Wow Vegas",
    url: "https://www.wowvegas.com/?raf=3615494",
    lastCollection: null,
    nextAvailable: null
  },
  {
    name: "McLuck",
    url: "https://www.mcluck.com/?r=908900038",
    lastCollection: null,
    nextAvailable: null
  }
];

// Add these utility functions
function updateCollection(casinoName) {
  const casino = casinos.find(c => c.name === casinoName);
  if (casino) {
    const now = new Date();
    casino.lastCollection = now;
    casino.nextAvailable = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // Add 24 hours
    saveToLocalStorage();
    updateDisplay();
  }
}

function formatTimeRemaining(targetDate) {
  if (!targetDate) return 'Ready to collect!';
  
  const now = new Date();
  const diff = targetDate - now;
  
  if (diff <= 0) return 'Ready to collect!';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m remaining`;
}

function saveToLocalStorage() {
  localStorage.setItem('casinoData', JSON.stringify(casinos));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('casinoData');
  if (saved) {
    const parsed = JSON.parse(saved);
    parsed.forEach((casino, index) => {
      casinos[index].lastCollection = casino.lastCollection ? new Date(casino.lastCollection) : null;
      casinos[index].nextAvailable = casino.nextAvailable ? new Date(casino.nextAvailable) : null;
    });
  }
}

function updateDisplay() {
  const container = document.getElementById('casino-list');
  container.innerHTML = '';
  
  casinos.forEach(casino => {
    const div = document.createElement('div');
    div.className = 'casino-item';
    
    const timeRemaining = casino.nextAvailable ? 
      formatTimeRemaining(new Date(casino.nextAvailable)) : 
      'Ready to collect!';
    
    const isReady = !casino.nextAvailable || new Date() >= new Date(casino.nextAvailable);
    
    div.innerHTML = `
      <h3>${casino.name}</h3>
      <p class="timer ${isReady ? 'ready' : ''}">${timeRemaining}</p>
      <button 
        onclick="window.open('${casino.url}', '_blank'); updateCollection('${casino.name}');"
        ${!isReady ? 'disabled' : ''}
      >
        Collect
      </button>
    `;
    
    container.appendChild(div);
  });
}

// Add this CSS to your stylesheet
const styles = `
  .casino-item {
    border: 1px solid #ccc;
    padding: 15px;
    margin: 10px 0;
    border-radius: 5px;
  }
  
  .timer.ready {
    color: green;
    font-weight: bold;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  // Create style element
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
  
  // Create container if it doesn't exist
  if (!document.getElementById('casino-list')) {
    const container = document.createElement('div');
    container.id = 'casino-list';
    document.body.appendChild(container);
  }
  
  // Load saved data and start updates
  loadFromLocalStorage();
  updateDisplay();
  
  // Update display every minute
  setInterval(updateDisplay, 60000);
});

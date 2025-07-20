const gifUrls = [
  "https://media.giphy.com/media/3og0IPxMM0erATueVW/giphy.gif",
  "https://media.giphy.com/media/1rNWzT3lbTi9K/giphy.gif",
  "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif",
  "https://media.giphy.com/media/3o6gE5aYpXz5E1ZkQo/giphy.gif"
];

// Toast notification
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Render casino table dynamically from casinoData.json
async function renderCasinoTable() {
  const table = document.getElementById('casino-table');
  if (!table) return;
  let data = [];
  try {
    const res = await fetch('casinoData.json');
    data = await res.json();
  } catch (e) {
    table.innerHTML = '<div>Error loading casino data.</div>';
    return;
  }
  let html = '<div class="table-header"><div>Casino</div><div>Collected</div><div>Last Collected</div></div>';
  data.forEach(casino => {
    html += `<div class="table-row" data-casino="${casino.name}">
      <div class="tooltip">${casino.name}
        <span class="tooltiptext">${casino.tooltip || ''}</span>
      </div>
      <div><input type="checkbox" class="collect-checkbox" /></div>
      <div class="last-collected">Available!</div>
    </div>`;
  });
  table.innerHTML = html;
}

// Render user stats dashboard (now includes most collected category)
function renderUserStats() {
  const stats = document.getElementById('user-stats');
  if (!stats) return;
  let collectedCount = parseInt(localStorage.getItem('collect_count') || '0');
  // Gather per-casino and per-category stats
  let casinoStats = JSON.parse(localStorage.getItem('casinoStats') || '{}');
  let categoryStats = JSON.parse(localStorage.getItem('categoryStats') || '{}');
  // Find most collected casino and category
  let mostCasino = '', mostCasinoCount = 0;
  let mostCategory = '', mostCategoryCount = 0;
  for (const [casino, count] of Object.entries(casinoStats)) {
    if (count > mostCasinoCount) {
      mostCasino = casino;
      mostCasinoCount = count;
    }
  }
  for (const [cat, count] of Object.entries(categoryStats)) {
    if (count > mostCategoryCount) {
      mostCategory = cat;
      mostCategoryCount = count;
    }
  }
  stats.innerHTML = `<div><b>Bonuses Collected:</b> ${collectedCount}</div>
    <div><b>Most Collected Casino:</b> ${mostCasino || '-'}</div>
    <div><b>Most Collected Category:</b> ${mostCategory || '-'}</div>`;
}

// Render category filters (auto from casinoData.json)
async function renderCategoryFilters() {
  const filters = document.getElementById('category-filters');
  if (!filters) return;
  let data = [];
  try {
    const res = await fetch('casinoData.json');
    data = await res.json();
  } catch (e) {
    filters.innerHTML = '';
    return;
  }
  // Collect unique categories
  const cats = Array.from(new Set(data.map(c => c.category || 'Other')));
  filters.innerHTML = cats.map(cat => `<button class="cat-filter" data-cat="${cat}">${cat}</button>`).join(' ');
  filters.addEventListener('click', e => {
    if (e.target.classList.contains('cat-filter')) {
      const cat = e.target.getAttribute('data-cat');
      document.querySelectorAll('.table-row').forEach(row => {
        const casino = row.getAttribute('data-casino');
        const casinoData = data.find(c => c.name === casino);
        if (!casinoData || (casinoData.category || 'Other') !== cat) {
          row.style.display = 'none';
        } else {
          row.style.display = '';
        }
      });
    }
  });
}

// Animated countdown (flip clock style)
function renderCountdownTimer(label, msLeft) {
  const minsLeft = Math.ceil(msLeft / (1000 * 60));
  const hours = Math.floor(minsLeft / 60);
  const mins = minsLeft % 60;
  label.innerHTML = `<span class="flip-clock"><span class="digit">${hours}</span>h <span class="digit">${mins}</span>m</span> until reset`;
}

// Settings panel (stub)
function renderSettingsPanel() {
  const panel = document.getElementById('settings-panel');
  if (!panel) return;
  panel.innerHTML = '<div>Settings coming soon...</div>';
}

// Removed duplicate toggleDegenMode function
function toggleDegenMode() {
  const body = document.body;
  if (body.classList.contains("tilt")) {
    body.classList.remove("tilt");
    body.classList.add("untilt");
    localStorage.setItem("tiltMode", "untilt");
  } else {
    body.classList.remove("untilt");
    body.classList.add("tilt");
    localStorage.setItem("tiltMode", "tilt");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }

  await renderCasinoTable();
  renderUserStats();
  renderCategoryFilters();
  renderSettingsPanel();
  updateTimers();
  setInterval(updateTimers, 60000);

  let collectedCount = parseInt(localStorage.getItem("collect_count") || "0");

  // Event delegation for checkboxes
  document.getElementById('casino-table').addEventListener('change', function(e) {
    if (!e.target.classList.contains('collect-checkbox')) return;
    const checkbox = e.target;
    const row = checkbox.closest('.table-row');
    const casino = row.getAttribute('data-casino');
    // Fetch casinoData for category
    fetch('casinoData.json').then(res => res.json()).then(data => {
      const casinoData = data.find(c => c.name === casino);
      const category = (casinoData && casinoData.category) || 'Other';
      // Update casinoStats
      let casinoStats = JSON.parse(localStorage.getItem('casinoStats') || '{}');
      let categoryStats = JSON.parse(localStorage.getItem('categoryStats') || '{}');
      if (checkbox.checked) {
        casinoStats[casino] = (casinoStats[casino] || 0) + 1;
        categoryStats[category] = (categoryStats[category] || 0) + 1;
      } else {
        casinoStats[casino] = Math.max(0, (casinoStats[casino] || 1) - 1);
        categoryStats[category] = Math.max(0, (categoryStats[category] || 1) - 1);
      }
      localStorage.setItem('casinoStats', JSON.stringify(casinoStats));
      localStorage.setItem('categoryStats', JSON.stringify(categoryStats));
      renderUserStats();
    });
    const confirmCollected = confirm("Did you collect your bonus?");
    if (!confirmCollected) {
      checkbox.checked = false;
      return;
    }
    const is24hr = confirm("Is the next collection time for this bonus 24 hrs from now?");
    let nextTime = 24 * 60; // default 24 hours in minutes
    if (!is24hr) {
      const userInput = prompt("How many minutes until your next bonus? (Enter a number)");
      const mins = parseInt(userInput);
      if (isNaN(mins) || mins <= 0) {
        checkbox.checked = false;
        showToast('Please enter a valid number of minutes.');
        return;
      }
      nextTime = mins;
    }
    // Store the next collection time as a timestamp
    const nextTimestamp = Date.now() + nextTime * 60 * 1000;
    localStorage.setItem("casino_" + casino, nextTimestamp);
    collectedCount++;
    localStorage.setItem("collect_count", collectedCount);
    updateTimers();
    renderUserStats();
    showToast('Bonus collected!');
    if (collectedCount % 5 === 0) {
      showGifPopup();
    }
  });
});

function updateTimers() {
  document.querySelectorAll(".table-row").forEach(row => {
    const casino = row.getAttribute("data-casino");
    const checkbox = row.querySelector(".collect-checkbox");
    const label = row.querySelector(".last-collected");
    const nextTimestamp = localStorage.getItem("casino_" + casino);
    const now = Date.now();

    if (nextTimestamp) {
      const msLeft = parseInt(nextTimestamp) - now;
      if (msLeft > 0) {
        checkbox.checked = true;
        checkbox.disabled = true;
        renderCountdownTimer(label, msLeft);
      } else {
        checkbox.checked = false;
        checkbox.disabled = false;
        label.textContent = "Available!";
        localStorage.removeItem("casino_" + casino);
      }
    } else {
      checkbox.checked = false;
      checkbox.disabled = false;
      label.textContent = "Available!";
    }
  });
}

function showGifPopup() {
  // 80% chance show gif, 20% chance show Ko-fi
  const showKofi = Math.random() < 0.2;
  const popup = document.getElementById("gif-popup");
  if (showKofi) {
    popup.innerHTML = `<a href="https://ko-fi.com/jmenichole0" target="_blank" style="display:inline-block;"><img src="https://ko-fi.com/img/githubbutton_sm.svg" alt="Buy Me a Coffee" /></a>`;
  } else {
    const gif = gifUrls[Math.floor(Math.random() * gifUrls.length)];
    popup.innerHTML = `<img src="${gif}" alt="funny gif" />`;
  }
  popup.style.display = "block";
  setTimeout(() => popup.style.display = "none", 5000);
}

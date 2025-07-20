document.addEventListener("DOMContentLoaded", () => {
  const casinoTable = document.getElementById("casino-table");
  const collectedSummary = document.getElementById("collected-summary");
  const modeToggle = document.getElementById("modeToggle");
  const msIn24Hours = 24 * 60 * 60 * 1000;

  // Apply saved theme preference
  const userPref = localStorage.getItem("theme");
  if (userPref === "dark") document.body.classList.add("dark");

  // Mode toggle logic
  modeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const mode = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", mode);
  });

  fetch("./casinoData.json")
    .then(res => res.json())
    .then(casinos => {
      casinos.forEach(casino => {
        if (!casino.name || !casino.link) return;

        const row = document.createElement("tr");
        const lastCollected = parseInt(localStorage.getItem(`collected_${casino.name}`));
        const now = Date.now();
        const isCooldown = lastCollected && now - lastCollected < msIn24Hours;

        row.innerHTML = `
          <td><a href="${casino.link}" class="casino-link" data-name="${casino.name}" target="_blank">${casino.name}</a></td>
          <td><input type="checkbox" class="collect-checkbox" ${isCooldown ? "disabled checked" : ""}></td>
          <td class="last-collected">${formatTimeRemaining(lastCollected)}</td>
        `;

        const checkbox = row.querySelector(".collect-checkbox");
        const timeDisplay = row.querySelector(".last-collected");

        if (isCooldown) updateCountdown();

        function updateCountdown() {
          const interval = setInterval(() => {
            const updatedTime = parseInt(localStorage.getItem(`collected_${casino.name}`));
            const now = Date.now();
            const diff = updatedTime + msIn24Hours - now;

            if (diff <= 0) {
              clearInterval(interval);
              checkbox.disabled = false;
              checkbox.checked = false;
              timeDisplay.innerText = "Available!";
              localStorage.removeItem(`collected_${casino.name}`);
              updateSummary();
            } else {
              timeDisplay.innerText = formatMs(diff);
              timeDisplay.classList.remove("timer-update");
              void timeDisplay.offsetWidth; // force reflow
              timeDisplay.classList.add("timer-update");
            }
          }, 60000);
        }

        casinoTable.appendChild(row);
      });

      updateSummary();
      attachLinkHandlers();

      function updateSummary() {
        const checkboxes = document.querySelectorAll(".collect-checkbox");
        const collected = Array.from(checkboxes).filter(cb => cb.checked && cb.disabled).length;
        const total = checkboxes.length;
        collectedSummary.innerText = `You've collected ${collected} of ${total} today`;
      }

      function formatTimeRemaining(timestamp) {
        if (!timestamp) return "Available!";
        const diff = timestamp + msIn24Hours - Date.now();
        return diff > 0 ? formatMs(diff) : "Available!";
      }

      function formatMs(ms) {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
      }

      function attachLinkHandlers() {
        document.querySelectorAll(".casino-link").forEach(link => {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            const name = link.dataset.name;
            const href = link.getAttribute("href");

            const collected = confirm("Did you collect your bonus?");
            if (!collected) return;

            const is24h = confirm("Is the next bonus available in 24 hours?");
            let durationMs = msIn24Hours;

            if (!is24h) {
              const custom = prompt("When is your next bonus available? (e.g. 3h, 2:30, 45m)");
              if (custom) {
                const parsed = parseCustomTime(custom.trim());
                if (parsed) {
                  durationMs = parsed;
                } else {
                  alert("Invalid format. Try '3h', '2:30', or '45m'.");
                  return;
                }
              }
            }

            const timestamp = Date.now();
            localStorage.setItem(`collected_${name}`, timestamp);
            const row = link.closest("tr");
            const checkbox = row.querySelector(".collect-checkbox");
            const timeDisplay = row.querySelector(".last-collected");

            checkbox.checked = true;
            checkbox.disabled = true;
            timeDisplay.innerText = formatMs(durationMs);
            timeDisplay.classList.add("timer-update");

            setTimeout(() => {
              checkbox.checked = false;
              checkbox.disabled = false;
              timeDisplay.innerText = "Available!";
              localStorage.removeItem(`collected_${name}`);
              updateSummary();
            }, durationMs);

            updateSummary();
            window.open(href, "_blank");
          });
        });
      }

      function parseCustomTime(input) {
        if (/^\d+h$/.test(input)) {
          return parseInt(input) * 60 * 60 * 1000;
        } else if (/^\d+m$/.test(input)) {
          return parseInt(input) * 60 * 1000;
        } else if (/^\d+:\d+$/.test(input)) {
          const [h, m] = input.split(":").map(n => parseInt(n));
          return (h * 60 + m) * 60 * 1000;
        }
        return null;
      }
    });
});

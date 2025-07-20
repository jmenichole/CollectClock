
document.addEventListener("DOMContentLoaded", () => {
  const casinoTable = document.getElementById("casino-table");
  const collectedSummary = document.getElementById("collected-summary");

  fetch("casinoData.json")
    .then(res => res.json())
    .then(casinos => {
      casinos.forEach(casino => {
        if (!casino.name || !casino.link) return;

        const row = document.createElement("tr");
        const lastCollected = parseInt(localStorage.getItem(`collected_${casino.name}`));
        const now = Date.now();
        const msIn24Hours = 24 * 60 * 60 * 1000;
        const isCooldown = lastCollected && now - lastCollected < msIn24Hours;

        row.innerHTML = \`
          <td><a href="\${casino.link}" target="_blank">\${casino.name}</a></td>
          <td><button class="copy-btn" data-link="\${casino.link}">Copy</button></td>
          <td><input type="checkbox" class="collect-checkbox" \${isCooldown ? "disabled checked" : ""}></td>
          <td class="last-collected">\${formatTimeRemaining(lastCollected)}</td>
        \`;

        const checkbox = row.querySelector(".collect-checkbox");
        const timeDisplay = row.querySelector(".last-collected");

        if (!isCooldown) {
          checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
              const timestamp = Date.now();
              localStorage.setItem(`collected_${casino.name}`, timestamp);
              checkbox.disabled = true;
              updateCountdown();
            }
          });
        }

        // Countdown updater
        function updateCountdown() {
          const interval = setInterval(() => {
            const updatedTime = parseInt(localStorage.getItem(`collected_${casino.name}`));
            const now = Date.now();
            const diff = msIn24Hours - (now - updatedTime);

            if (diff <= 0) {
              clearInterval(interval);
              checkbox.disabled = false;
              checkbox.checked = false;
              timeDisplay.innerText = "Available!";
              localStorage.removeItem(`collected_${casino.name}`);
              updateSummary();
            } else {
              timeDisplay.innerText = formatMs(diff);
            }
          }, 60000);
        }

        if (isCooldown) {
          updateCountdown();
        }

        casinoTable.appendChild(row);
      });

      updateSummary();

      function updateSummary() {
        const checkboxes = document.querySelectorAll(".collect-checkbox");
        const collected = Array.from(checkboxes).filter(cb => cb.disabled).length;
        const total = checkboxes.length;
        collectedSummary.innerText = \`You've collected \${collected} of \${total} today\`;
      }

      function formatTimeRemaining(timestamp) {
        if (!timestamp) return "Available!";
        const diff = msIn24Hours - (now - timestamp);
        return diff > 0 ? formatMs(diff) : "Available!";
      }

      function formatMs(ms) {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        return \`\${hours}h \${minutes}m\`;
      }
    });

  // Copy-to-clipboard event delegation
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("copy-btn")) {
      const link = e.target.getAttribute("data-link");
      navigator.clipboard.writeText(link);
      alert("Copied: " + link);
    }
  });
});

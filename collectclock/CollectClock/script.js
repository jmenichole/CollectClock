const gifUrls = [
  "https://media.giphy.com/media/3og0IPxMM0erATueVW/giphy.gif",
  "https://media.giphy.com/media/1rNWzT3lbTi9K/giphy.gif",
  "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif",
  "https://media.giphy.com/media/3o6gE5aYpXz5E1ZkQo/giphy.gif"
];

function toggleDegenMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}
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

document.addEventListener("DOMContentLoaded", () => {
  const savedMode = localStorage.getItem("tiltMode") || "tilt";
  document.body.classList.add(savedMode);
  updateTimers();
  // ... rest of your existing code
});

function showGifPopup() {
  const gif = gifUrls[Math.floor(Math.random() * gifUrls.length)];
  const popup = document.getElementById("gif-popup");
  popup.querySelector("img").src = gif;
  popup.style.display = "block";
  setTimeout(() => popup.style.display = "none", 5000);
}

function updateTimers() {
  document.querySelectorAll(".table-row").forEach(row => {
    const casino = row.getAttribute("data-casino");
    const checkbox = row.querySelector(".collect-checkbox");
    const label = row.querySelector(".last-collected");
    const lastCollected = localStorage.getItem("casino_" + casino);
    const now = Date.now();

    if (lastCollected) {
      const diff = now - parseInt(lastCollected);
      const hoursLeft = 24 - (diff / (1000 * 60 * 60));
      if (hoursLeft > 0) {
        checkbox.checked = true;
        checkbox.disabled = true;
        label.textContent = `${hoursLeft.toFixed(1)}h until reset`;
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

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }

  updateTimers();
  setInterval(updateTimers, 60000);

  let collectedCount = parseInt(localStorage.getItem("collect_count") || "0");

  document.querySelectorAll(".collect-checkbox").forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      const row = checkbox.closest(".table-row");
      const casino = row.getAttribute("data-casino");

      if (checkbox.checked) {
        const confirmCollected = confirm("Did you collect your bonus?");
        if (confirmCollected) {
          localStorage.setItem("casino_" + casino, Date.now());
          collectedCount++;
          localStorage.setItem("collect_count", collectedCount);
          updateTimers();

          if (collectedCount % 5 === 0) {
            showGifPopup();
          }
        } else {
          const hours = prompt("How many hours until your next bonus?");
          const hoursNum = parseFloat(hours);
          if (!isNaN(hoursNum) && hoursNum > 0) {
            const delay = Date.now() - ((24 - hoursNum) * 60 * 60 * 1000);
            localStorage.setItem("casino_" + casino, delay);
            updateTimers();
          } else {
            checkbox.checked = false;
          }
        }
      }
    });
  });
});

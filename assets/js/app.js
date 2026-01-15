const grid = document.getElementById("bonus-grid");
const modal = document.getElementById("modal");

let casinos = JSON.parse(localStorage.getItem("casinos") || "[]");
let submissions = JSON.parse(localStorage.getItem("submissions") || "[]");

function save() {
  localStorage.setItem("casinos", JSON.stringify(casinos));
  localStorage.setItem("submissions", JSON.stringify(submissions));
}

function render() {
  grid.innerHTML = "";
  casinos.forEach(c => {
    const card = document.createElement("div");
    card.className = "bonus-card";
    card.innerHTML = `
      <button class="card-options-btn">⚙</button>
      <h3>${c.name}</h3>
      <p>${c.bonus}</p>
      <p class="meta">Last collected: <span>${c.lastCollected || "Never"}</span></p>
      <a href="${c.url}" target="_blank" class="btn visit">Visit</a>

      <div class="options">
        <input value="${c.amount}" placeholder="Bonus amount">
        <input value="${c.window}" placeholder="Collect window">
      </div>
    `;

    const optionsBtn = card.querySelector(".card-options-btn");
    const options = card.querySelector(".options");
    optionsBtn.onclick = () => options.style.display =
      options.style.display === "block" ? "none" : "block";

    card.querySelector(".visit").onclick = () => {
      c.lastCollected = new Date().toLocaleString();
      save(); render();
    };

    options.querySelectorAll("input").forEach((input, i) => {
      input.onblur = () => {
        if (i === 0) c.amount = input.value;
        if (i === 1) c.window = input.value;
        save();
      };
    });

    grid.appendChild(card);
  });
}

document.getElementById("add-casino-btn").onclick = () => modal.classList.remove("hidden");
document.getElementById("close-modal").onclick = () => modal.classList.add("hidden");

document.getElementById("submit-casino").onclick = () => {
  const c = {
    id: crypto.randomUUID(),
    name: name.value,
    url: url.value,
    bonus: bonus.value,
    amount: amount.value,
    window: window.value,
    lastCollected: null
  };

  if (document.getElementById("global-submit").checked) {
    submissions.push(c);
  } else {
    casinos.push(c);
  }

  save();
  modal.classList.add("hidden");
  render();
};

render();

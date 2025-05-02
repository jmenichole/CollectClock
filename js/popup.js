
let clickCount = 0;

document.addEventListener('click', () => {
    clickCount++;

    if (clickCount === 7 || clickCount === 15) {
        showPopup(clickCount);
    }
});

function showPopup(clickNumber) {
    const popup = document.createElement('div');
    popup.className = 'funny-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <p>${clickNumber === 7 ? "Lucky 7! You're rolling in funny money!" : "15 clicks! You're a money meme legend!"}</p>
            <button class="close-popup">Close</button>
        </div>
    `;
    document.body.appendChild(popup);

    document.querySelector('.close-popup').addEventListener('click', () => {
        popup.remove();
    });
}

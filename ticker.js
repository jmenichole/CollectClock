// Add this CSS to your style.css file
.sports-ticker {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.8);
    overflow: hidden;
    height: 40px;
    z-index: 1000;
}

.ticker-content {
    white-space: nowrap;
    overflow: hidden;
    height: 100%;
}

.ticker-scroll {
    display: inline-block;
    padding: 10px 0;
    color: var(--casino-gold);
    animation: ticker 30s linear infinite;
    white-space: nowrap;
}

@keyframes ticker {
    0% {
        transform: translateX(100%);
    }
    100% {
        transform: translateX(-100%);
    }
}

// Replace your ticker.js content with this:
class SportsTicker {
    constructor() {
        this.tickerElement = null;
        this.retryCount = 0;
        this.maxRetries = 3;
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }

    initialize() {
        this.createTickerElement();
        this.updateTickerContent();
        setInterval(() => this.updateTickerContent(), 5 * 60 * 1000); // Update every 5 minutes
    }

    createTickerElement() {
        const ticker = document.querySelector('.ticker-scroll');
        if (!ticker) throw new Error('Ticker element not found');
        this.tickerElement = ticker;
    }

    updateTickerContent() {
        if (!this.tickerElement) return;

        const updates = [
            "Welcome to CollectClock! | ",
            "Click casino names to visit sites | ",
            "Use Collect button to track your bonuses | ",
            "Undo button resets collection timer | ",
            "Check back daily for more rewards! | "
        ];

        this.tickerElement.textContent = updates.join('').repeat(3);
    }
}

// Initialize the ticker
document.addEventListener('DOMContentLoaded', () => {
    const ticker = new SportsTicker();
    ticker.initialize();
});

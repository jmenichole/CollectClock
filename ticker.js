class SportsTicker {
    constructor() {
        this.tickerElement = null;
        this.retryCount = 0;
        this.maxRetries = 3;
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }

    initialize() {
        this.createTickerElement();
        if (!this.tickerElement) {
            this.displayFallbackMessage();
            return;
        }
        this.updateTickerContent();
        setInterval(() => this.updateTickerContent(), 5 * 60 * 1000); // Update every 5 minutes
    }

    createTickerElement() {
        this.tickerElement = document.querySelector('.ticker-scroll');
        if (!this.tickerElement) {
            console.warn('Ticker element not found.');
            return;
        }

        if (this.isMobile) {
            const tickerContent = document.querySelector('.ticker-content');
            tickerContent?.addEventListener('touchstart', () => {
                this.tickerElement.style.animationPlayState = 'paused';
            });

            tickerContent?.addEventListener('touchend', () => {
                this.tickerElement.style.animationPlayState = 'running';
            });
        }
    }

    updateTickerContent() {
        if (!this.tickerElement) return;

        const updates = [
            "Welcome to CollectClock! | ",
            "Click casino names to visit sites | ",
            "Use 'Collect' button after claiming your bonus | ",
            "Times reset every 24 hours | ",
            "Support the project to keep it running | ",
            "Bookmark for daily use | ",
            "Thanks for using CollectClock! | ",
            "Made with ♥ by jmenichole | "
        ];

        this.tickerElement.textContent = updates.join('').repeat(3);

        if (!this.isMobile) {
            const tickerContent = document.querySelector('.ticker-content');
            tickerContent?.addEventListener('mouseenter', () => {
                this.tickerElement.style.animationPlayState = 'paused';
            });

            tickerContent?.addEventListener('mouseleave', () => {
                this.tickerElement.style.animationPlayState = 'running';
            });
        }
    }

    displayFallbackMessage() {
        const fallbackMessage = 'Welcome to CollectClock! Your bonuses are ready to be collected.';
        const tickerFallback = document.querySelector('.ticker-content');
        if (tickerFallback) tickerFallback.textContent = fallbackMessage;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const ticker = new SportsTicker();
    ticker.initialize();
});


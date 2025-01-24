class SportsTicker {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.tickerElement = null;
        this.odds = [];
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    async initialize() {
        try {
            this.createTickerElement();
            await this.fetchOdds();
            this.startTicker();
            
            // Update odds every 6 hours
            setInterval(() => this.fetchOdds(), 6 * 60 * 60 * 1000);
        } catch (error) {
            console.error('Failed to initialize ticker:', error);
            this.handleError();
        }
    }

    createTickerElement() {
        const ticker = document.querySelector('.ticker-scroll');
        if (!ticker) throw new Error('Ticker element not found');
        this.tickerElement = ticker;
    }

    async fetchOdds() {
        try {
            const response = await fetch(`https://api.the-odds-api.com/v4/sports/upcoming/odds/?apiKey=${this.apiKey}&regions=us&markets=h2h`);
            if (!response.ok) throw new Error('Failed to fetch odds');
            
            const data = await response.json();
            this.odds = data.slice(0, 10); // Limit to 10 events
            this.updateTickerContent();
        } catch (error) {
            console.error('Error fetching odds:', error);
            this.handleError();
        }
    }

    updateTickerContent() {
        if (!this.tickerElement) return;

        const content = this.odds.map(event => {
            const homeTeam = event.home_team;
            const awayTeam = event.away_team;
            const sport = event.sport_title;
            return `${sport}: ${homeTeam} vs ${awayTeam} | `;
        }).join('');

        this.tickerElement.textContent = content || 'Loading sports updates...';
    }

    handleError() {
        if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            setTimeout(() => this.fetchOdds(), 5000 * this.retryCount);
        } else {
            if (this.tickerElement) {
                this.tickerElement.textContent = 'Sports updates temporarily unavailable';
            }
        }
    }
}

// Initialize the ticker
document.addEventListener('DOMContentLoaded', () => {
    const ticker = new SportsTicker('cf97eedbe621ffabed7e15b6282cbafe');
    ticker.initialize();
});

class SportsTicker {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.tickerElement = null;
        this.odds = [];
        this.retryCount = 0;
        this.maxRetries = 3;
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }

    async initialize() {
        try {
            this.createTickerElement();
            await this.fetchOdds();
            this.setupTicker();
            
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
        
        // Add touch events for mobile
        if (this.isMobile) {
            const tickerContent = document.querySelector('.ticker-content');
            if (tickerContent) {
                tickerContent.addEventListener('touchstart', () => {
                    this.tickerElement.style.animationPlayState = 'paused';
                });
                
                tickerContent.addEventListener('touchend', () => {
                    this.tickerElement.style.animationPlayState = 'running';
                });
            }
        }
    }

    setupTicker() {
        // Reset animation when it completes
        this.tickerElement.addEventListener('animationend', () => {
            this.tickerElement.style.animation = 'none';
            this.tickerElement.offsetHeight; // Trigger reflow
            this.tickerElement.style.animation = null;
        });
    }

    async fetchOdds() {
        try {
            const response = await fetch(`https://api.the-odds-api.com/v4/sports/upcoming/odds/?apiKey=${this.apiKey}&regions=us&markets=h2h`);
            if (!response.ok) throw new Error('Failed to fetch odds');
            
            const data = await response.json();
            this.odds = data.slice(0, this.isMobile ? 5 : 10); // Show fewer items on mobile
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
            const startTime = new Date(event.commence_time).toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit'
            });
            
            // Shorter format for mobile
            return this.isMobile ? 
                `${awayTeam} @ ${homeTeam} (${startTime}) | ` :
                `${sport}: ${awayTeam} @ ${homeTeam} (${startTime}) | `;
        }).join('');

        // Repeat content for smoother loop
        this.tickerElement.textContent = content.repeat(2);
    }

    handleError() {
        if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            setTimeout(() => this.fetchOdds(), 5000 * this.retryCount);
        } else {
            if (this.tickerElement) {
                this.tickerElement.textContent = this.isMobile ? 
                    'Updates unavailable' : 
                    'Sports updates temporarily unavailable';
            }
        }
    }
}

// Initialize the ticker with performance monitoring
document.addEventListener('DOMContentLoaded', () => {
    const ticker = new SportsTicker('cf97eedbe621ffabed7e15b6282cbafe');

    // Check for animation performance
    const checkPerformance = () => {
        const tickerElement = document.querySelector('.ticker-scroll');
        if (tickerElement && tickerElement.getAnimations) {
            const animation = tickerElement.getAnimations()[0];
            if (animation && animation.playState === 'pending') {
                // Fallback to simpler animation if performance is poor
                tickerElement.style.animation = 'none';
                tickerElement.style.transform = 'translateX(-100%)';
                tickerElement.style.transition = 'transform 30s linear';
                setInterval(() => {
                    tickerElement.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        tickerElement.style.transition = 'none';
                        tickerElement.style.transform = 'translateX(-100%)';
                        setTimeout(() => {
                            tickerElement.style.transition = 'transform 30s linear';
                        }, 50);
                    }, 30000);
                }, 30050);
            }
        }
    };

    ticker.initialize().then(() => {
        setTimeout(checkPerformance, 1000);
    });
});

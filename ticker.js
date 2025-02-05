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

    updateTickerContent() {
        if (!this.tickerElement) return;

        const updates = [
            "Welcome to CollectClock! | ",
            "Click casino names to visit sites | ",
            "Use 'Collect' button after claiming your bonus | ",
            "Use 'Undo' if you didn't collect the bonus | ",
            "Times reset every 24 hours | ",
            "Support the project to keep it running | ",
            "Bookmark for daily use | ",
            "Check back daily for more rewards! | ",
            "Thanks for using CollectClock! | ",
            "Made with ♥ by jmenichole | "
        ];

        // Different messages for mobile
        if (this.isMobile) {
            updates.push(
                "Swipe to pause ticker | ",
                "Release to resume | "
            );
        } else {
            updates.push(
                "Hover to pause ticker | ",
                "Move mouse away to resume | "
            );
        }

        // Repeat the content multiple times for smooth scrolling
        this.tickerElement.textContent = updates.join('').repeat(3);

        // Add hover pause functionality for desktop
        if (!this.isMobile) {
            const tickerContent = document.querySelector('.ticker-content');
            if (tickerContent) {
                tickerContent.addEventListener('mouseenter', () => {
                    this.tickerElement.style.animationPlayState = 'paused';
                });
                
                tickerContent.addEventListener('mouseleave', () => {
                    this.tickerElement.style.animationPlayState = 'running';
                });
            }
        }
    }

    handleError() {
        if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            setTimeout(() => this.updateTickerContent(), 5000 * this.retryCount);
        } else {
            if (this.tickerElement) {
                this.tickerElement.textContent = this.isMobile ? 
                    'Welcome to CollectClock!' : 
                    'Welcome to CollectClock! Click casino names to visit sites and use Collect button to track your bonuses.';
            }
        }
    }
}

// Initialize the ticker with performance monitoring
document.addEventListener('DOMContentLoaded', () => {
    const ticker = new SportsTicker();

    // Initialize with error handling
    try {
        ticker.initialize();

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

        // Check performance after a short delay
        setTimeout(checkPerformance, 1000);

    } catch (error) {
        console.error('Error initializing ticker:', error);
        ticker.handleError();
    }
});


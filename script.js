// Keep the casino <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CollectClock - From One Gambler to Another - Wen Bonus?</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <header>
        <div class="header-content">
            <h1>CollectClock</h1>
            <p class="tagline">From One Gambler to Another - Wen Bonus?</p>
        </div>
    </header>

    <main>
        <div class="tracker-container">
            <div class="donation-info">
                <h3>Support CollectClock</h3>
                <p>If you find this tool helpful, consider supporting:</p>
                <div class="donate-options">
                    <div class="donate-item">
                        <a href="https://cash.app/$godzillamasters" target="_blank" class="donate-button cashapp-button">
                            💸 Donate via CashApp
                        </a>
                        <div class="copy-wrapper">
                            <span class="donate-address">$godzillamasters</span>
                            <button class="copy-btn" onclick="copyToClipboard('$godzillamasters')">📋</button>
                        </div>
                    </div>
                    <div class="donate-item">
                        <a href="litecoin:MSfEK5UHm6efSC58q73RcPiAQNptef8bFE" target="_blank" class="donate-button crypto-button">
                            🪙 Pay with Litecoin
                        </a>
                        <div class="copy-wrapper">
                            <span class="donate-address">MSfEK5UHm6efSC58q73RcPiAQNptef8bFE</span>
                            <button class="copy-btn" onclick="copyToClipboard('MSfEK5UHm6efSC58q73RcPiAQNptef8bFE')">📋</button>
                        </div>
                    </div>
                    <div class="donate-item">
                        <a href="https://github.com/sponsors/jmenichole" target="_blank" class="donate-button github-button">
                            ❤️ Sponsor on GitHub
                        </a>
                    </div>
                </div>
            </div>

            <table class="tracker-table">
                <thead>
                    <tr>
                        <th>Casino Name</th>
                        <th>Last Collection</th>
                        <th>Next Available</th>
                        <th>Status</th>
                        <th>Time Until Available</th>
                        <th>Collect</th>
                    </tr>
                </thead>
                <tbody id="casino-list">
                    <!-- Casino rows will be added here via JavaScript -->
                </tbody>
            </table>
        </div>
    </main>

    <footer>
        <p>© 2025 CollectClock</p>
    </footer>

    <div class="copy-notification" id="copyNotification">Copied to clipboard!</div>

    <script src="script.js"></script>
</body>
</html>
 structure and savedData loading the same

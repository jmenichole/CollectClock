# CodePsychee Data Update Guide

## Overview
The CodePsychee predictions page now uses a dynamic data loading system that fetches bonus drop data from `bonus-drops-data.json`. This makes it easy to keep predictions current without modifying the HTML code.

## How to Update Bonus Drop Data

### Option 1: Edit JSON File Directly
1. Open `bonus-drops-data.json`
2. Update the `lastUpdated` timestamp to current UTC time
3. Add new drops to the `drops` array:
   ```json
   { "date": "2025-11-03", "time": "02:30", "amount": 10 }
   ```
   - Use `null` for amount if unknown
   - Time is in UTC 24-hour format
4. Save the file
5. The page will auto-detect changes within 5 minutes, or users can click "Refresh"

### Option 2: Update Text File (Backward Compatible)
The `stake instagram code trends` file is still maintained for manual reference. To update predictions:
1. Add new entries to the text file
2. Copy the data format to JSON using this pattern:
   ```
   2025-11-XX HH:MM — $XX  →  { "date": "2025-11-XX", "time": "HH:MM", "amount": XX }
   ```

## Data Format

### JSON Structure
```json
{
  "lastUpdated": "2025-11-02T03:21:00Z",  // ISO 8601 UTC timestamp
  "drops": [
    { "date": "YYYY-MM-DD", "time": "HH:MM", "amount": 5 },
    { "date": "YYYY-MM-DD", "time": "HH:MM", "amount": 10 },
    { "date": "YYYY-MM-DD", "time": "HH:MM", "amount": 11 },
    { "date": "YYYY-MM-DD", "time": "HH:MM", "amount": null }  // Unknown amount
  ]
}
```

### Important Notes
- **Date Format**: YYYY-MM-DD (e.g., "2025-11-02")
- **Time Format**: HH:MM in UTC 24-hour format (e.g., "02:30")
- **Amount**: Numbers 5, 10, 11, or `null` for unknown
- **Always update `lastUpdated`** when adding new drops

## Features

### Data Freshness Indicator
The page displays:
- ✅ Green badge: Updated within 24 hours
- ⚠️ Yellow badge: Updated 1-2 days ago
- ❌ Red badge: Updated 3+ days ago

### Auto-Refresh
- Automatic check every 5 minutes
- Manual refresh button available
- Shows "Updated Xh ago" or "Updated X days ago"

### Holiday Awareness
The following holidays are recognized and increase prediction confidence:
- New Year's Day (Jan 1)
- Valentine's Day (Feb 14)
- St. Patrick's Day (Mar 17)
- Independence Day (Jul 4)
- Halloween (Oct 31)
- **Thanksgiving Eve (Nov 27)**
- **Thanksgiving (Nov 28)**
- **Thanksgiving Weekend (Nov 29)**
- Black Friday (Nov 24-25)
- Christmas Eve/Day (Dec 24-25)
- New Year's Eve (Dec 31)

## API Integration (Future)
For automated updates, you could create an API endpoint that:
1. Scrapes Instagram for new bonus codes
2. Updates `bonus-drops-data.json`
3. Returns the updated data

Example workflow:
```javascript
// POST new drop to your API
fetch('/api/bonus-drops', {
  method: 'POST',
  body: JSON.stringify({
    date: '2025-11-03',
    time: '02:30',
    amount: 10
  })
});
```

## Validation

Before committing changes, validate your JSON:
```bash
python3 -m json.tool bonus-drops-data.json
```

Or use an online JSON validator.

## Best Practices
1. ✅ Always update within 24 hours of a new drop for best accuracy
2. ✅ Keep `stake instagram code trends` text file in sync as backup
3. ✅ Validate JSON before committing
4. ✅ Use UTC timezone consistently
5. ✅ Document unknown amounts as `null` rather than omitting them

## Troubleshooting

**Q: Page shows old predictions**
- Check if `lastUpdated` timestamp was updated
- Click the "🔄 Refresh" button
- Clear browser cache (Ctrl+F5 or Cmd+Shift+R)

**Q: Predictions seem inaccurate**
- Verify recent drops are added to the data
- Ensure amounts are correct (5, 10, 11, or null)
- Check that times are in UTC, not local time

**Q: JSON file won't load**
- Validate JSON syntax
- Check file is named exactly `bonus-drops-data.json`
- Ensure file is in the same directory as `predictions.html`

---

**Made with 💜 by CodePsychee**

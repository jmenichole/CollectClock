# CodePsychee Prediction Verification & Correction System

## Overview

The Prediction Verification & Correction System is a comprehensive feedback loop that allows users to verify actual bonus drops against CodePsychee's predictions, calculate accuracy metrics, and continuously improve prediction algorithms based on real-world data.

## Features

### 1. Prediction Tracking
- **Automatic Storage**: Every prediction made by CodePsychee is automatically stored with:
  - Unique ID
  - Prediction timestamp
  - Predicted drop date/time
  - Predicted amount
  - Confidence level
- **Persistence**: Predictions are stored in both `prediction-accuracy.json` and localStorage for redundancy

### 2. Verification Interface
- **"Report Actual Drop" Button**: Prominently displayed on the Next Predicted Drop card
- **User-Friendly Form**: Allows users to input:
  - Actual drop date (pre-filled with current date)
  - Actual drop time in UTC (pre-filled with current time)
  - Actual bonus amount ($5, $10, $11, or Other/Unknown)
  - Optional notes
- **Smart Matching**: Automatically matches verifications with predictions within a 24-hour window

### 3. Accuracy Metrics
The system calculates and displays comprehensive accuracy metrics:

#### Core Metrics
- **Overall Accuracy**: Percentage of predictions that were both time-accurate (within 3 hours) and amount-accurate
- **Verified Predictions**: Total number of user-reported verifications
- **Average Time Difference**: Average time difference between predicted and actual drops (in minutes)
- **Amount Accuracy**: Percentage of predictions where the bonus amount matched

#### Accuracy Classification
- **Excellent**: Within 60 minutes AND amount matched
- **Good**: Within 3 hours AND amount matched
- **Fair**: Within 6 hours (regardless of amount)
- **Needs Improvement**: More than 6 hours difference

#### Trend Analysis
- Compares recent 10 verifications vs previous 10 verifications
- Shows improvement trend with visual indicators (📈 up, 📉 down, ➡️ stable)
- Displays percentage change in accuracy over time

### 4. Feedback Loop

#### Automatic Learning
The system uses verification data to improve predictions:

1. **Historical Data Enhancement**: Verified drops can be automatically added to `bonus-drops-data.json`
2. **Pattern Recognition**: The prediction algorithm considers verified drops in its analysis
3. **Real-time Updates**: When verified drops are added, predictions are immediately recalculated

#### User Benefits
- **Transparency**: See exactly how accurate the predictions have been
- **Community Contribution**: Help improve the system for all users
- **Reward System**: Visual feedback showing how verifications improve accuracy

### 5. Recent Verifications Display
- Shows the 5 most recent verifications
- Color-coded accuracy badges
- Detailed breakdown of:
  - Actual drop time
  - Time difference from prediction
  - Amount match status
  - Accuracy rating

## Data Structure

### prediction-accuracy.json

```json
{
  "version": "1.0",
  "lastUpdated": "ISO 8601 timestamp",
  "predictions": [
    {
      "id": "unique_id",
      "predictionDate": "when prediction was made",
      "predictedDropDate": "predicted drop time",
      "predictedAmount": 10,
      "confidence": 0.75,
      "verified": false,
      "verificationId": null
    }
  ],
  "verifications": [
    {
      "id": "unique_id",
      "verificationDate": "when reported",
      "actualDropDate": "actual drop time",
      "actualAmount": 10,
      "predictionId": "matched_prediction_id",
      "timeDifferenceMinutes": 45,
      "amountMatch": true,
      "addedToHistorical": false,
      "notes": "optional user notes"
    }
  ],
  "accuracyMetrics": {
    "totalPredictions": 0,
    "totalVerifications": 0,
    "successfulPredictions": 0,
    "averageTimeDifferenceMinutes": 0,
    "amountAccuracy": 0,
    "overallAccuracyRate": 0,
    "improvementTrend": []
  }
}
```

### localStorage Backup
All prediction and verification data is also stored in localStorage under the key `codepsychee_accuracy_local` as a backup mechanism.

## User Workflow

### Reporting a Drop

1. User sees a bonus drop on Stake.us Instagram
2. Clicks "✅ Report Actual Drop" button
3. Form opens with current date/time pre-filled
4. User adjusts date/time if needed and selects amount
5. Clicks "📊 Submit Verification"
6. System:
   - Finds matching prediction (if within 24 hours)
   - Calculates time difference and amount accuracy
   - Stores verification
   - Updates metrics
   - Shows success message
7. User is prompted to add verified drop to historical database
8. If confirmed, drop is added and predictions are recalculated

### Viewing Accuracy

Users can immediately see:
- Overall accuracy percentage
- Number of verified predictions
- Average time difference
- Amount accuracy percentage
- Improvement trend
- Recent verifications with details

## Technical Implementation

### Key Functions

#### Data Loading
- `loadAccuracyData()`: Loads prediction-accuracy.json and merges with localStorage
- `loadHistoricalData()`: Loads bonus-drops-data.json

#### Prediction Tracking
- `storePrediction(prediction)`: Stores a new prediction
- `saveAccuracyDataLocally()`: Saves to localStorage

#### Verification
- `handleVerificationSubmit(e)`: Processes verification form
- `addVerifiedDropToHistorical(verification)`: Adds to historical data

#### Metrics
- `calculateAccuracyMetrics()`: Computes all accuracy metrics
- `displayAccuracyMetrics()`: Renders metrics to UI
- `displayRecentVerifications()`: Shows recent verifications

#### UI
- `initializeVerificationModal()`: Sets up modal and event handlers
- `displayAccuracyMetrics()`: Updates accuracy display
- `displayRecentVerifications()`: Shows verification history

### Accuracy Calculation

```javascript
// Time accuracy: within 180 minutes (3 hours)
successfulTime = verifications.filter(v => 
  Math.abs(v.timeDifferenceMinutes) <= 180
).length

// Amount accuracy
amountAccuracy = (amountMatches / totalVerifications) * 100

// Overall accuracy: both time AND amount correct
overallSuccess = verifications.filter(v => 
  v.amountMatch === true && 
  Math.abs(v.timeDifferenceMinutes) <= 180
).length

overallAccuracyRate = (overallSuccess / totalVerifications) * 100
```

### Improvement Trend

```javascript
recentAccuracy = (last 10 verifications success rate) * 100
previousAccuracy = (previous 10 verifications success rate) * 100
improvementTrend = recentAccuracy - previousAccuracy
```

## Future Enhancements

### Planned Features
1. **Server-Side Integration**: Sync prediction-accuracy.json to GitHub automatically
2. **Advanced Analytics**: 
   - Accuracy by day of week
   - Accuracy by time of day
   - Accuracy trends over longer periods
3. **Machine Learning**: Use TensorFlow.js to improve predictions based on accuracy data
4. **Collaborative Features**: Show community accuracy stats
5. **Gamification**: Reward users for accurate verifications
6. **Export/Import**: Allow users to export/import their verification history

### Server Integration TODO

For production deployment, implement:

```javascript
// Save to server
async function saveAccuracyDataToServer() {
  await fetch('/api/accuracy-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(accuracyData)
  });
}

// Update bonus-drops-data.json
async function updateHistoricalDataOnServer(newDrop) {
  await fetch('/api/bonus-drops', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newDrop)
  });
}
```

## Design Decisions

### Why localStorage + JSON?
- **Offline Support**: Users can verify drops even without server access
- **Privacy**: Data stays on user's device
- **Simplicity**: No authentication/database required initially
- **Gradual Enhancement**: Can add server sync later

### Why 24-Hour Matching Window?
- Balances being lenient enough to catch predictions vs. being too loose
- Most drops should be verified within a day
- Prevents false matches

### Why 3-Hour Success Threshold?
- Industry standard for "close enough" in prediction systems
- Gives users enough time to catch the drop
- Balances accuracy with practicality

### Why Separate Amount and Time Accuracy?
- Provides granular feedback
- Amount is often easier to predict than exact time
- Helps identify specific areas for improvement

## Best Practices for Users

1. **Verify Promptly**: Report drops as soon as you see them for maximum accuracy
2. **Be Accurate**: Double-check the time zone (UTC) when reporting
3. **Add Notes**: Include any relevant context (e.g., "Holiday drop", "Special event")
4. **Review Regularly**: Check the accuracy metrics to see how predictions are improving
5. **Add to Historical**: Always add verified drops to the database to improve future predictions

## Troubleshooting

### Verification Not Matching Prediction
- Ensure the actual drop time is within 24 hours of a prediction
- Check that date/time are in UTC
- Verify the form was filled out completely

### Metrics Not Updating
- Check browser console for errors
- Verify localStorage isn't full
- Try refreshing the page
- Clear cache and reload

### Data Loss
- Data is stored in localStorage - clearing browser data will erase it
- Consider exporting verification history periodically (feature coming soon)
- Server sync will prevent data loss (planned feature)

## Privacy & Security

- All data is stored locally in the user's browser
- No personal information is collected
- Verification data is anonymous
- Future server integration will be optional

## Contributing

Users contribute by:
1. Reporting actual drops accurately
2. Adding verified drops to historical database
3. Providing feedback on prediction accuracy
4. Sharing insights about patterns they notice

## Support

For issues or questions:
- Check the console for error messages
- Verify your browser supports localStorage
- Ensure JavaScript is enabled
- Contact via the CollectClock Discord server

## License

Part of the CollectClock project - made for degens by degens ❤️

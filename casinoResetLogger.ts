import * as fs from 'fs';
import * as path from 'path';

const logFilePath = path.join(__dirname, 'casinoResetLog.json');

export function logCasinoResetTime(resetTime: string): void {
    const logEntry = {
        resetTime,
        timestamp: new Date().toISOString(),
    };

    let logData: any[] = [];
    if (fs.existsSync(logFilePath)) {
        const existingData = fs.readFileSync(logFilePath, 'utf-8');
        logData = JSON.parse(existingData);
    }

    logData.push(logEntry);

    fs.writeFileSync(logFilePath, JSON.stringify(logData, null, 2), 'utf-8');
    console.log('Casino reset time logged successfully.');
}

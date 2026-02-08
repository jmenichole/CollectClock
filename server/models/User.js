const mongoose = require('mongoose');

const CasinoSettingsSchema = new mongoose.Schema({
    name: String,
    lastCollected: Number,
    cooldownHours: { type: Number, default: 24 },
    bonusAmount: { type: String, default: '' },
    notes: { type: String, default: '' },
    hidden: { type: Boolean, default: false },
    isConfigured: { type: Boolean, default: false },
    lastNotifiedAt: { type: Number, default: 0 },
    history: [{
        bonusAmount: String,
        timestamp: { type: Date, default: Date.now }
    }]
});

const UserSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    username: String,
    discriminator: String,
    avatar: String,
    casinoSettings: [CasinoSettingsSchema],
    globalSettings: {
        soundEnabled: { type: Boolean, default: true },
        notificationVolume: { type: Number, default: 0.5 },
        dmNotifications: { type: Boolean, default: false }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);

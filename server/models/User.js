const mongoose = require('mongoose');

const CasinoSettingsSchema = new mongoose.Schema({
    name: String,
    lastCollected: Number,
    cooldownHours: { type: Number, default: 24 },
    bonusAmount: { type: String, default: '' },
    notes: { type: String, default: '' },
    hidden: { type: Boolean, default: false },
    isConfigured: { type: Boolean, default: false } // To track if the user has set up this casino
});

const UserSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    username: String,
    discriminator: String,
    avatar: String,
    casinoSettings: [CasinoSettingsSchema],
    globalSettings: {
        soundEnabled: { type: Boolean, default: true },
        notificationVolume: { type: Number, default: 0.5 }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);

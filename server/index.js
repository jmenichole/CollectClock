require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
require('./config/passport'); // Import passport configuration

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('MongoDB connection error:', err));
}

// Basic Route
app.get('/', (req, res) => {
    res.send('Collect Clock API is running');
});

// Auth Routes
app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/auth/failure',
    successRedirect: '/auth/success'
}));

app.get('/auth/success', (req, res) => {
    if (req.user) {
        res.json({ message: 'Success', user: req.user });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

// API Routes
app.post('/api/submit-casino', async (req, res) => {
    const { name, url } = req.body;
    const DISCORD_WEBHOOK_URL = process.env.DISCORD_SUBMISSION_WEBHOOK;

    if (!name) return res.status(400).json({ error: 'Name is required' });

    console.log(`New Casino Submission: ${name} (${url || 'No URL'})`);

    if (DISCORD_WEBHOOK_URL) {
        try {
            await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: `<@1153034319271559328> **New Casino Submission!**`,
                    embeds: [{
                        title: "Submission Details",
                        fields: [
                            { name: "Casino Name", value: name, inline: true },
                            { name: "URL", value: url || "N/A", inline: true },
                            { name: "User", value: req.user ? req.user.username : "Guest", inline: true }
                        ],
                        color: 5763719 // Green
                    }]
                })
            });
        } catch (err) {
            console.error('Failed to send Discord webhook:', err);
        }
    }

    res.json({ message: 'Submitted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

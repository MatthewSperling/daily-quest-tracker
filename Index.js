const fs = require('fs');
const https = require('https');
const express = require('express');
const path = require('path');

const app = express();

// Middleware 
app.use((req, res, next) => {

    if (req.url.startsWith('/')) {
        res.set('Cache-Control', 'public, max-age=3600'); // Cache static assets for 1 hour
    }
    next();
});

// Static files
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1h'
}));

// Main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// API with its own caching header for 5 min
app.get('/api/daily-quests', (req, res) => {
    const quests = [
        { id: 1, quest: 'Drink Water', xp: 5 },
        { id: 2, quest: 'Walk 10,000 steps', xp: 20 },
        { id: 3, quest: 'Read 20 pages', xp: 15 }
    ];
    res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    res.json(quests);
});

// HTTPS 
const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
};

const PORT = process.env.PORT || 3000;
https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`HTTPS Server running on https://localhost:${PORT}`);
});

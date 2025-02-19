const fs = require('fs');
const https = require('https');
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const data = require('./public/Data/data');

const app = express();

app.use(express.json());

// Security middleware with Helmet
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                "default-src": ["'self'"],
                "script-src": ["'self'", "https:"],
                "style-src": ["'self'", "https:"],
                "img-src": ["'self'", "data:"],
                "object-src": ["'none'"],
            },
        },
        frameguard: { action: 'deny' },
    })
);

// Serve static files
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1h' }));

// Path to the data file
const postsFilePath = path.join(__dirname, 'public', 'data', 'posts.json');

// routes 
//GET /posts 

app.get('/posts', (req, res) => {
    const posts = data;
    res.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=30');
    res.json(posts);
});

//GET /posts/:id 

app.get('/posts/:id', (req, res) => {

    const postId = parseInt(req.params.id, 10);
    const post = data.find((p) => p.id === postId);
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    res.set('Cache-Control', 'public, max-age=3600');
    res.json(post);
});


// Main page route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// HTTPS self-signed certificates 
const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
};

const PORT = process.env.PORT || 3000;
https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`HTTPS Server running on https://localhost:${PORT}`);
});

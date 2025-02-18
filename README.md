Daily Quest Tracker 

**SETUP INSTRUCTIONS** --------------------------------------------------------------------

To configure and run the server for the Daily Quest Tracker:

**Prerequisites**
Make sure the following pre-requisites are installed in your end-device:
- Node.js (Latest LTS version)
- Express 

**Download/Run Instructions**
1. Clone Repository using the following command:
   git clone https://github.com/MatthewSperling/daily-quest-tracker/
   
2. Install Dependencies using the following command in your work environment:
   npm install
   
3. Configure Environment Variables in a file called .env in the project root using the following:
	PORT = 3000
	NODE_ENV = production
	SSL_KEY_PATH = ./cert/key.pem
	SSL_CERT_PATH = ./cert/cert.pem

4. Start the server:
   node server.js

By doing the following you should recieve a message in the console that says the following:
"HTTPS Server running on https://localhost:3000

**SSL CONFIGURATION** ---------------------------------------------------------------------

Our program has a configured SSL using OpenSSL which we generated as followed: 

1. Download OpenSSL
   
2. Run this command to generate SSL certificate:
   openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes

Additionally, the server was set up to listen on HTTPS to enfore secure connections. 

We used the helmet middleware to add security and prevent vulnerabilities: 

const helmet = require('helmet');

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

**CACHING STRATEGIES** ------------------------------------------------------------------------

Using Express middleware we implemented caching.

/posts are cached using Cache-Control headers to reduce the amount of redundant requests: 

//GET /posts 

app.get('/posts', (req, res) => {
    const posts = data;
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=30');
    res.json(posts);
});

//GET /posts/:id 

app.get('/posts/:id', (req, res) => {

    const postId = parseInt(req.params.id, 10);
    const post = data.find((p) => p.id === postId);
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    res.set('Cache-Control', 'public, max-age=300');
    res.json(post);
});

**LESSONS LEARNED** ---------------------------------------------------------------------

1. We learned how to implement SSL certificates and how to manually add it to the trusted list
   for local development as the browser did not recognize the certificate initally.
   
2. We also learned how to find to handle cache duration. At times it was complicated to load
   changes so we had to clear the browser cache and/or use incognito mode to view changes.

3. During the process of learning what security headers were, we learned how to use helmet to prevent common web vulnerabilities such as XSS and clickjacking.

**CONTRIBUTORS**

Matthew Sperling
Milan Djordjevic 

This project is for SAIT Web Security. 






   

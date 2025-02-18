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





   

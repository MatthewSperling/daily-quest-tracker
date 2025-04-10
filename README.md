Daily Quest Tracker 

**SETUP INSTRUCTIONS** --------------------------------------------------------------------

To configure and run the server for the Daily Quest Tracker:

**Prerequisites**
Make sure the following pre-requisites are installed in your end-device:
- Node.js (LTS version)
- Express
- MongoDB (Community Server or Atlas)
- OpenSSL (for local HTTPS)
- Git

**Download/Run Instructions**
1. Clone Repository using the following command:
   
   git clone https://github.com/MatthewSperling/daily-quest-tracker/
   cd daily-quest-tracker

2. If you encounter `EACCES` permission errors on install:
   - Avoid using `sudo`.
   - Consider using Node Version Manager (nvm).
   
3. Install Dependencies using the following command in your work environment:
   npm install
   
4. Configure your environment:
   Create a `.env` file in the root directory and add the following:
   
   PORT=3000
   DB_CONNECTION=mongodb://127.0.0.1:27017/authentication
   SESSION_SECRET=your_random_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   SSL_KEY_PATH=./cert/key.pem
   SSL_CERT_PATH=./cert/cert.pem

5. Generate SSL certificates for local development:
   openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes

6. Run the server:
   node app.js

7. By doing the following you should recieve a message in the console that says the following:
   "Server is running on port 3000"

8. Open on browser:
   http://localhost:3000

**INPUT VALIDATION** ---------------------------------------------------------------------

All user inputs are validated both client-side and server-side to prevent injection and malformed data.

- **Techniques Used**:
  - HTML5 form validation (`required`, `type=email`)
  - Mongoose schema validation (e.g., `required`, `unique`, `enum`)
  - Middleware sanitization

- **Validation Rules**:
  - `username`: required, string, unique
  - `email`: required, email format
  - `password`: required, minimum 8 characters

- **Edge Case Handling**:
  - Empty strings and nulls rejected
  - Duplicate entries rejected
  - Unexpected field types casted or rejected

- **Attack Mitigation**:
  - Prevents XSS by rejecting embedded script input
  - Blocks NoSQL injection with strict schema validation
    
**OUTPUT ENCODING** ------------------------------------------------------------------------

- **Libraries Used**:
  - `escape-html`: encodes user content before rendering
  - Helmet CSP settings: block unsafe inline scripts

- **Methods**:
  - Server-side content is escaped before insertion into views
  - Client-side DOM insertion uses `textContent` rather than `innerHTML`

- **Example**:
  ```js
  const escape = require('escape-html');
  res.send(`<p>${escape(userInput)}</p>`);
  ```

**ENCRYPTION METHODS** ---------------------------------------------------------------------

- **Password Hashing**:
  - `argon2` for password hashing with salt
  - Protects against brute-force and rainbow table attacks

- **Data in Transit**:
  - HTTPS is enforced in development using self-signed certs
  - Helmet middleware enforces HTTPS headers

- **Session & JWT Security**:
  - Sessions stored with `express-session` and signed with secure secret
  - JWTs signed using environment secret

- **Sensitive Data at Rest**:
  - Environment variables managed via `.env` file and `dotenv`
  - MongoDB stores hashed passwords, no plaintext stored

**DEPENDENCY MANAGEMENT** ------------------------------------------------------------------------

- **Installation**:
  - `npm install` installs dependencies from `package.json`

- **Tracking**:
  - All versions locked via `package-lock.json`

- **Security**:
  - Helmet, CSRF protection, and other dependencies secured
  - Regular `npm audit` and `npm outdated` checks recommended

- **Version Control**:
  - Do not commit `node_modules`
  - `.env` and cert files are excluded via `.gitignore`

**LESSONS LEARNED** --------------------------------------------------------------------

1. **Certificate Trust Challenges**:
   - Local HTTPS required manual certificate trust setup. We had to add generated certs to the trusted list to avoid browser warnings.

2. **Form Validation Pitfalls**:
   - Browser-level validation was bypassed with tools like Postman. Server-side schema validation prevented malicious bypasses.

3. **Security Headers and CSP**:
   - Using Helmet taught us about attack vectors like XSS and clickjacking, and how to mitigate them with CSP and Frameguard.

4. **OAuth Role Logic**:
   - Balancing traditional login and Google SSO was complex. Managing roles via JWT claims and MongoDB simplified this dual-login system.

5. **Caching Hurdles**:
   - Static file updates didn’t reflect due to browser caching. We had to configure cache headers and use Incognito for testing changes.
  
6. **Security Testing**:
   - We manually tested for XSS and SQL/NoSQL injection with inputs like:
      - <script>alert('XSS')</script>
      - ' OR '1'='1
   - Inputs were correctly rejected or escaped by the validation and encoding layers.
  
**CONTRIBUTORS** -------------------------------------------------------------------------------------------------------

Matthew Sperling
Milan Djordjevic 

This project is for SAIT Web Security. 

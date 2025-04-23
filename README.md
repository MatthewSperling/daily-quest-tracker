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

**SECURITY TESTING** ------------------------------------------------------------------------

Both manual and automated testing methods were conducted.

- **Automated Testing**:
   - Ran npm audit to identify known vulnerabilities in dependencies.
   - - Used Burp Suite for dynamic application scanning, which highlighted certain security risks but didn’t function fully due to errors in the app during testing.

- **Manual Testing**:
  - Performed SQL injection and XSS attack simulations on various user input fields, checking if any unwanted actions (like database manipulation or script execution) occurred.
  - Validated that input sanitization and CSP headers were working as intended to block harmful inputs.
 
**VULNERABILITY FIXES** ---------------------------------------------------------------------

- **SQL Injection Prevention**:
  - Implemented parameterized queries and ORM frameworks to safely interact with the database.
  - Validated all user inputs to ensure they cannot be exploited by SQL injection attacks.

- **XSS Mitigation**:
   - Utilized HTML escaping techniques (using the escape-html library) to prevent script injection.
   - Enhanced Content Security Policy (CSP) headers to block inline scripts and untrusted sources.

- **Authentication Bypass Fix**:
   - Improved server-side logic for validating user inputs, ensuring that login requests are thoroughly authenticated and not vulnerable to bypass attacks.

**TESTING TOOLS** -----------------------------------------------------------------------

- **Burp Suite**: Used for dynamic scanning and intercepting web traffic to identify vulnerabilities in real-time. Unfortunately, it faced limitations due to application errors.

- **npm audit**: Automated tool to check for vulnerabilities in dependencies. Ensured that all packages were up to date and free of known security issues. Fixed vulnerabilities with npx audit fix.

**ETHICAL RESPONSIBILITIES OF SECURITY PROFESSIONALS** ---------------------------------

When performing security testing, it’s important to adhere to ethical guidelines. We ensured that all testing, including SQL injection and XSS simulations, was conducted only within controlled, authorized environments. Testing was done exclusively on our own web application, with full consent, and was designed to identify vulnerabilities and strengthen security rather than exploit weaknesses maliciously. Ethical hacking requires respect for the privacy and data integrity of users, ensuring that no unauthorized access or harm occurs during testing, for this reason we used dummy data as well.

**LEGAL IMPLICATIONS OF SECURITY TESTING** ---------------------------------------------- 

Security testing must always comply with relevant legal frameworks. For this application, it’s important to consider data protection laws such as the General Data Protection Regulation (GDPR) for users based in the EU, and Data Protection Acts in other jurisdictions. Testing must be conducted with awareness of user privacy, ensuring that sensitive data is handled securely and in compliance with legal obligations. Any testing on production systems should always have explicit consent from the application owner, ensuring that legal boundaries are respected. This application followed the laws above as no real user information was used, only dummy data was used for testing purposes.

**LESSONS LEARNED** --------------------------------------------------------------------

1. **NoSQL Injection Prevention**:
During testing, we realized that NoSQL injection could occur through crafted JSON payloads in login or registration endpoints. This reinforced the need to validate and sanitize user input, ensuring that only safe data is processed by the database.

2. **XSS Attack via Malicious Content**:
Stored XSS attacks were identified as a potential risk through malicious quest titles. We learned that input sanitization and escaping user input is crucial to prevent XSS vulnerabilities, especially when rendering content provided by users.

3. **Session Hijacking Risk**:
The risk of session hijacking due to insecure cookie handling (e.g., missing Secure flag) was highlighted. This highlighted the importance of using secure cookie attributes (HttpOnly, Secure, SameSite) to protect session data from interception.

4. **Dependency Management**:
Outdated or insecure dependencies, such as vulnerable express-session versions, can be exploited remotely. This underlined the necessity of regularly running npm audit and keeping dependencies up to date to prevent security breaches from compromised packages.
  
**CONTRIBUTORS** -------------------------------------------------------------------------------------------------------

Matthew Sperling
Milan Djordjevic 

This project is for SAIT Web Security. 

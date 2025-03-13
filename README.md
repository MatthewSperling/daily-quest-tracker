Daily Quest Tracker 

**SETUP INSTRUCTIONS** --------------------------------------------------------------------

To configure and run the server for the Daily Quest Tracker:

**Prerequisites**
Make sure the following pre-requisites are installed in your end-device:
- Node.js (Latest LTS version)
- Express
- MongoDB

**Download/Run Instructions**
1. Clone Repository using the following command:
   git clone https://github.com/MatthewSperling/daily-quest-tracker/
   
2. Install Dependencies using the following command in your work environment:
   npm install express mongoose express-session helmet passport passport-google-oauth20 argon2 dotenv csurf express-rate-limit cookie-parser
   
3. Start MongoDB:
   mongod

5. Start the server:
   node app.js

6. By doing the following you should recieve a message in the console that says the following:
   "Server is running on port 3000"

7. Open on browser:
   http://localhost:3000

**Authentication Mechanisms** ---------------------------------------------------------------------

Authentication in this project is implemented using both local authentication (username & password) and Single Sign-On (SSO) with Google OAuth.

1. Local Authentication:
   Users register with a hashed password (Argon2) stored in MongoDB.
   During login, the server verifies the password and issues a session (session-based auth) or JWT (token-based auth).

2. SSO Authentication (Google OAuth):
   Users are redirected to Google for authentication.
   Google sends back an OAuth token, which is validated by the server.
   If the user is new, an account is created; otherwise, they are logged in.

   3. Session Management:
      Session-based auth: Express-session stores the session in memory (destroyed upon logout).
      JWT-based auth: Tokens are stored in local storage and validated on each request.
      Logout: Clears session or removes JWT from local storage.

**Role Based Access Control** ------------------------------------------------------------------------

User roles determine access permissions for different parts of the application.

1. User:
   Access profile, complete daily quests, view dashboard
2. Admin:
   Manage users, view all data, access admin dashboard, other admin features

**Lessons Learned** ---------------------------------------------------------------------

We faced persistent authentication issues, particularly a "ForbiddenError: invalid CSRF token", which prevented user registration and login. Despite multiple debugging attempts, we were unable to resolve it, which meant we couldn’t fully implement or test authentication and session management.

This experience highlighted the importance of testing security features in isolation before integrating them. The combination of CSRF protection, session-based authentication, and JWT handling introduced conflicts that were difficult to troubleshoot under time constraints.

We also planned to conduct penetration testing for vulnerabilities like session hijacking and token tampering, but authentication issues prevented further progress. Moving forward, we would prioritize getting core functionality working first before adding security layers.

Ultimately, the project did not run as expected, but we gained insight into the challenges of implementing authentication and security in a structured system.

**CONTRIBUTORS** ------------------------------------------------------------------------

Matthew Sperling
Milan Djordjevic 

This project is for SAIT Web Security. 






   

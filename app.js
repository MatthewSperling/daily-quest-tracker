require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

// Environment variables and settings
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';


let refreshTokens = [];


const mockUser = {
  id: '123',
  username: 'testuser',
  role: 'user'
};

/*
  LOGIN ROUTE
*/
app.post('/login', (req, res) => {

  const user = mockUser;
  const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });


  refreshTokens.push(refreshToken);


  res.cookie('accessToken', accessToken, { httpOnly: true, secure: false });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false });

  res.json({ message: 'Logged in successfully' });
});

/*
  MIDDLEWARE
 
*/
const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.sendStatus(401); // Unauthorized
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden 
    req.user = user;
    next();
  });
};


app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected content accessed successfully', user: req.user });
});

/*
  TOKEN REFRESH ENDPOINT
  - Reads the refresh token from the HttpOnly cookie then verifies it and, if valid, generates a new access token.
  
*/
app.post('/token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    // Generate new access token
    const newAccessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: false });
    res.json({ message: 'Access token refreshed' });
  });
});

/*
  LOGOUT ROUTE
  - Clears the tokens 
*/
app.post('/logout', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  refreshTokens = refreshTokens.filter(token => token !== refreshToken);
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

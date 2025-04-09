const express = require('express');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const { encrypt, decrypt } = require('./cryptoUtils');
const escapeHtml = require('escape-html');

const app = express();
app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let fakeUserDB = {
  name: encrypt('John Smith'),
  email: encrypt('john.smith@example.com'),
  bio: encrypt('This is a placeholder bio.')
};

app.get('/dashboard', (req, res) => {
  const user = {
    name: escapeHtml(decrypt(fakeUserDB.name)),
    email: escapeHtml(decrypt(fakeUserDB.email)),
    bio: escapeHtml(decrypt(fakeUserDB.bio))
  };
  res.render('dashboard', { user });
});

app.post('/dashboard/update',
  body('name').trim().isLength({ min: 3, max: 50 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('bio').trim().isLength({ max: 500 }).matches(/^[A-Za-z0-9 .,!?'"\-\n\r]*$/),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send('Validation failed');
    }

    const { name, email, bio } = req.body;
    fakeUserDB.name = encrypt(name);
    fakeUserDB.email = encrypt(email);
    fakeUserDB.bio = encrypt(bio);
    res.redirect('/dashboard');
  }
);

https.createServer({
  key: fs.readFileSync('cert/key.pem'),
  cert: fs.readFileSync('cert/cert.pem')
}, app).listen(443, () => {
  console.log('HTTPS Server running on port 443');
});

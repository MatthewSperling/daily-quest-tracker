const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const hash = await bcrypt.hash(password, 10);
  console.log(`Hash for "${password}":`, hash);
}

hashPassword('password123'); // for user
hashPassword('adminpass');   // for admin

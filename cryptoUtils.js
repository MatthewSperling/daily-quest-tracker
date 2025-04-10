const crypto = require('crypto');
const algorithm = 'aes-128-cbc';
const key = Buffer.from('mysecretkey12345'); // 16 bytes
const iv = Buffer.from('a1b2c3d4e5f6g7h8');  // 16 bytes

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };

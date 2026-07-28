const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
// 32-byte secret key generation (Environment variable ya fallback key)
const SECRET_KEY = process.env.ENCRYPTION_SECRET || 'dataguard_secret_encryption_key_32b';
const ENCRYPTION_KEY = crypto.scryptSync(SECRET_KEY, 'salt', 32); 
const IV_LENGTH = 16; // Initialization Vector length

// 🔒 Encrypt Function (Plaintext -> Encrypted Hex)
function encrypt(text) {
  if (!text) return '';
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// 🔓 Decrypt Function (Encrypted Hex -> Plaintext)
function decrypt(text) {
  if (!text) return '';
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = { encrypt, decrypt };
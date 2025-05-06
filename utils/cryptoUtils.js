const crypto = require('crypto');

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_SECRET_KEY, 'utf8'); // 32 bytes
const IV = Buffer.from(process.env.ENCRYPTION_IV, 'utf8'); // 16 bytes

if (ENCRYPTION_KEY.length !== 32) {
  throw new Error('ENCRYPTION_SECRET_KEY must be 32 bytes');
}

if (IV.length !== 16) {
  throw new Error('ENCRYPTION_IV must be 16 bytes');
}

const encrypt = (text) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decrypt = (encryptedText) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = { encrypt, decrypt };

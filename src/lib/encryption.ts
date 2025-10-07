import CryptoJS from 'crypto-js';

// Generate a key from user's password and email
export function generateKey(password: string, email: string): string {
  return CryptoJS.PBKDF2(password, email, {
    keySize: 256 / 32,
    iterations: 10000,
  }).toString();
}

// Encrypt data using the generated key
export function encrypt(text: string, key: string): string {
  const encrypted = CryptoJS.AES.encrypt(text, key).toString();
  return encrypted;
}

// Decrypt data using the generated key
export function decrypt(encryptedText: string, key: string): string {
  const decrypted = CryptoJS.AES.decrypt(encryptedText, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// Encrypt vault item
export function encryptVaultItem(item: any, key: string) {
  return {
    ...item,
    username: encrypt(item.username, key),
    password: encrypt(item.password, key),
    notes: encrypt(item.notes, key),
  };
}

// Decrypt vault item
export function decryptVaultItem(item: any, key: string) {
  return {
    ...item,
    username: decrypt(item.username, key),
    password: decrypt(item.password, key),
    notes: decrypt(item.notes, key),
  };
}

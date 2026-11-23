import crypto from 'crypto';

// AES-256-GCM Configuration
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits recommended for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits auth tag

/**
 * Derives a 32-byte Buffer key from the environment variable ENCRYPTION_KEY or a secure fallback.
 */
function getEncryptionKey(): Buffer {
  const rawKey =
    process.env.ENCRYPTION_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    'betashop_default_secure_aes256_encryption_master_key_2026';

  // Hash key with SHA-256 to guarantee exact 32 bytes
  return crypto.createHash('sha256').update(rawKey).digest();
}

/**
 * Encrypts plaintext string using AES-256-GCM.
 * Output format: "ivHex:authTagHex:ciphertextHex"
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) return '';
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts AES-256-GCM ciphertext formatted as "ivHex:authTagHex:ciphertextHex".
 */
export function decrypt(ciphertextWithTag: string): string {
  if (!ciphertextWithTag) return '';

  const parts = ciphertextWithTag.split(':');
  if (parts.length !== 3) {
    throw new Error('Định dạng mã hóa không hợp lệ (cần iv:authTag:ciphertext)');
  }

  const [ivHex, authTagHex, encryptedHex] = parts;
  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  if (authTag.length !== AUTH_TAG_LENGTH) {
    throw new Error('Auth tag AES-256-GCM không đúng độ dài 16 bytes');
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Masks sensitive keys or passwords, displaying only the last characters (e.g. "****abcd").
 */
export function mask(value: string, visibleChars = 4): string {
  if (!value) return '';
  if (value.length <= visibleChars) {
    return '*'.repeat(value.length);
  }
  const prefix = '*'.repeat(Math.max(4, value.length - visibleChars));
  const suffix = value.slice(-visibleChars);
  return `${prefix}${suffix}`;
}

/**
 * Computes a SHA-256 hash of a string to detect duplicate keys or credentials.
 */
export function hashSha256(data: string): string {
  if (!data) return '';
  return crypto.createHash('sha256').update(data.trim()).digest('hex');
}

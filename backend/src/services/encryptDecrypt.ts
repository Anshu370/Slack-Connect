import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Encryption function
export const encrypt = (text: string) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(`${process.env.ENCRYPTION_KEY}`, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

// Decryption function
export const decrypt = (encryptedText: string) => {
    const [iv, encrypted] = encryptedText.split(':');
    const plainText = crypto.createDecipheriv('aes-256-cbc', Buffer.from(`${process.env.ENCRYPTION_KEY}`, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = plainText.update(encrypted, 'hex', 'utf8');
    decrypted += plainText.final('utf8');
    return decrypted;
};

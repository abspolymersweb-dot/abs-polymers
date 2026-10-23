import crypto from 'crypto';
import { cookies } from 'next/headers';
import { verifyAdminCredentials, getDb } from './db';

const SESSION_COOKIE_NAME = 'abs_admin_session';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'abs-polymers-coimbatore-secret-salt-2026';

export interface AdminSession {
  userId: string;
  username: string;
  role: string;
  issuedAt: number;
  expiresAt: number;
}

export function signToken(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(data)
    .digest('base64url');
  return `${data}.${signature}`;
}

export function verifyToken(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [data, signature] = parts;

    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(data)
      .digest('base64url');

    if (signature !== expectedSignature) return null;

    const decoded = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
    if (decoded.expiresAt && decoded.expiresAt < Date.now()) {
      return null; // Expired
    }
    return decoded;
  } catch (err) {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}


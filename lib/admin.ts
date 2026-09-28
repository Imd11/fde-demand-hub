import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { Pool } from 'pg';

const scrypt = promisify(scryptCallback);
export const pool = new Pool({
  host: process.env.PGHOST || '/var/run/postgresql',
  database: process.env.PGDATABASE || 'fde',
  user: process.env.PGUSER || 'fde',
  max: 5,
  connectionTimeoutMillis: 5000,
});
const cookieName = 'fde_admin_session';
const sessionSeconds = 8 * 60 * 60;

export function digest(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${hash.toString('hex')}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [algorithm, salt, hex] = stored.split(':');
  if (algorithm !== 'scrypt' || !/^[a-f0-9]{32}$/.test(salt || '') || !/^[a-f0-9]{128}$/.test(hex || '')) return false;
  const expected = Buffer.from(hex, 'hex');
  const actual = (await scrypt(password, salt, expected.length)) as Buffer;
  return timingSafeEqual(actual, expected);
}

export function sameOrigin(request: Request) {
  return request.headers.get('origin') === (process.env.APP_ORIGIN || 'https://fde.cloudsequ.com');
}

export async function jsonBody(request: Request): Promise<Record<string, unknown> | null> {
  if (!request.headers.get('content-type')?.startsWith('application/json')) return null;
  const length = Number(request.headers.get('content-length') || 0);
  if (length > 8192) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 8192) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  try {
    const data: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    return data && typeof data === 'object' && !Array.isArray(data) ? data as Record<string, unknown> : null;
  } catch { return null; }
}

export function noStore(data: object, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function currentAdmin(request: Request): Promise<number | null> {
  const raw = request.headers.get('cookie')?.split(';').map(x => x.trim()).find(x => x.startsWith(cookieName + '='))?.slice(cookieName.length + 1);
  if (!raw || !/^[a-f0-9]{64}$/.test(raw)) return null;
  const result = await pool.query('SELECT admin_id FROM admin_sessions WHERE token_hash=$1 AND expires_at > now()', [digest(raw)]);
  return result.rows[0]?.admin_id ?? null;
}

export function sessionCookie(token: string, maxAge = sessionSeconds) {
  return `${cookieName}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

export async function newSession(adminId: number) {
  const token = randomBytes(32).toString('hex');
  await pool.query('INSERT INTO admin_sessions (token_hash, admin_id, expires_at) VALUES ($1,$2,now()+interval \'8 hours\')', [digest(token), adminId]);
  return token;
}

export function filters(url: URL) {
  const company = (url.searchParams.get('company') || '').trim();
  const status = url.searchParams.get('status') || '';
  const from = url.searchParams.get('from') || '';
  const to = url.searchParams.get('to') || '';
  if (company.length > 160 || !['', 'new', 'in_progress', 'done'].includes(status) ||
      (from && !/^\d{4}-\d{2}-\d{2}$/.test(from)) || (to && !/^\d{4}-\d{2}-\d{2}$/.test(to)) ||
      (from && Number.isNaN(Date.parse(from))) || (to && Number.isNaN(Date.parse(to))) ||
      (from && to && from > to)) return null;
  const clauses: string[] = [];
  const params: unknown[] = [];
  if (company) { params.push(`%${company.replace(/[\\%_]/g, '\\$&')}%`); clauses.push(`company ILIKE $${params.length} ESCAPE '\\'`); }
  if (status) { params.push(status); clauses.push(`status=$${params.length}`); }
  if (from) { params.push(`${from}T00:00:00+08:00`); clauses.push(`created_at >= $${params.length}::timestamptz`); }
  if (to) { params.push(`${to}T00:00:00+08:00`); clauses.push(`created_at < ($${params.length}::timestamptz + interval '1 day')`); }
  return { where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params };
}

export function csvCell(value: string | number | null | undefined) {
  let text = String(value ?? '');
  if (/^[=+@-]/.test(text.trimStart())) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

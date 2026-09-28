import { digest, hashPassword, jsonBody, newSession, noStore, pool, sameOrigin, sessionCookie } from '@/lib/admin';

export async function POST(request: Request) {
  if (!sameOrigin(request)) return noStore({ error: '请求来源不受支持。' }, 403);
  const body = await jsonBody(request);
  if (!body || typeof body.setupCode !== 'string' || typeof body.password !== 'string' ||
      body.setupCode.length > 128 || body.password.length < 12 || body.password.length > 128) {
    return noStore({ error: '请输入有效的启用码和至少 12 位的新密码。' }, 400);
  }
  try {
    const passwordHash = await hashPassword(body.password);
    const result = await pool.query(
      "UPDATE admin_users SET password_hash=$1, setup_token_hash=NULL, setup_expires_at=NULL WHERE username='admin' AND password_hash IS NULL AND setup_token_hash=$2 AND setup_expires_at > now() RETURNING id",
      [passwordHash, digest(body.setupCode)],
    );
    if (!result.rowCount) return noStore({ error: '启用码无效或已过期。' }, 403);
    const token = await newSession(result.rows[0].id);
    const response = noStore({ authenticated: true });
    response.headers.set('Set-Cookie', sessionCookie(token));
    return response;
  } catch {
    return noStore({ error: '管理员账号启用失败，请稍后再试。' }, 503);
  }
}

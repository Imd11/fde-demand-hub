import { hashPassword, jsonBody, newSession, noStore, pool, sameOrigin, sessionCookie, verifyPassword } from '@/lib/admin';

export async function POST(request: Request) {
  if (!sameOrigin(request)) return noStore({ error: '请求来源不受支持。' }, 403);
  const body = await jsonBody(request);
  if (!body || typeof body.username !== 'string' || typeof body.password !== 'string' ||
      body.username.length > 80 || body.password.length > 128 || !body.password) return noStore({ error: '账号或密码不正确。' }, 400);
  try {
    const result = await pool.query('SELECT id,password_hash,locked_until FROM admin_users WHERE username=$1', [body.username]);
    const user = result.rows[0];
    if (!user || !user.password_hash) {
      // Equalize the expensive password check for an unknown username.
      await hashPassword(body.password);
      return noStore({ error: '账号或密码不正确。' }, 401);
    }
    if (user.locked_until && new Date(user.locked_until) > new Date()) return noStore({ error: '尝试次数过多，请 15 分钟后再试。' }, 429);
    if (!(await verifyPassword(body.password, user.password_hash))) {
      await pool.query("UPDATE admin_users SET failed_login_count=failed_login_count+1, locked_until=CASE WHEN failed_login_count+1 >= 5 THEN now()+interval '15 minutes' ELSE NULL END WHERE id=$1", [user.id]);
      return noStore({ error: '账号或密码不正确。' }, 401);
    }
    await pool.query('UPDATE admin_users SET failed_login_count=0, locked_until=NULL WHERE id=$1', [user.id]);
    const token = await newSession(user.id);
    const response = noStore({ authenticated: true });
    response.headers.set('Set-Cookie', sessionCookie(token));
    return response;
  } catch {
    return noStore({ error: '登录暂时不可用。' }, 503);
  }
}

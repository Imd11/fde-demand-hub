import { currentAdmin, digest, noStore, pool, sameOrigin, sessionCookie } from '@/lib/admin';

export async function POST(request: Request) {
  if (!sameOrigin(request)) return noStore({ error: '请求来源不受支持。' }, 403);
  try {
    const admin = await currentAdmin(request);
    const raw = request.headers.get('cookie')?.split(';').map(x => x.trim()).find(x => x.startsWith('fde_admin_session='))?.split('=')[1];
    if (admin && raw) await pool.query('DELETE FROM admin_sessions WHERE token_hash=$1 AND admin_id=$2', [digest(raw), admin]);
    const response = noStore({ authenticated: false });
    response.headers.set('Set-Cookie', sessionCookie('', 0));
    return response;
  } catch {
    return noStore({ error: '退出失败，请重试。' }, 503);
  }
}

import { currentAdmin, noStore, pool } from '@/lib/admin';

export async function GET(request: Request) {
  try {
    const adminId = await currentAdmin(request);
    if (adminId) return noStore({ authenticated: true, username: 'admin' });
    const result = await pool.query("SELECT password_hash IS NULL AS pending FROM admin_users WHERE username='admin'");
    return noStore({ authenticated: false, setupAvailable: result.rows[0]?.pending === true });
  } catch {
    return noStore({ error: '后台暂时不可用。' }, 503);
  }
}

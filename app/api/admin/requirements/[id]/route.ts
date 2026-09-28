import { currentAdmin, jsonBody, noStore, pool, sameOrigin } from '@/lib/admin';

export async function PATCH(request: Request) {
  if (!sameOrigin(request)) return noStore({ error: '请求来源不受支持。' }, 403);
  try {
    if (!await currentAdmin(request)) return noStore({ error: '请先登录。' }, 401);
    const id = new URL(request.url).pathname.split('/').pop();
    const body = await jsonBody(request);
    if (!id || !/^\d+$/.test(id) || !body || !['new', 'in_progress', 'done'].includes(String(body.status)) ||
        typeof body.internalNote !== 'string' || body.internalNote.length > 4000) return noStore({ error: '状态或备注不正确。' }, 400);
    const result = await pool.query('UPDATE requirements SET status=$1, internal_note=$2 WHERE id=$3 RETURNING id,status,internal_note', [body.status, body.internalNote.trim(), id]);
    if (!result.rowCount) return noStore({ error: '需求不存在。' }, 404);
    return noStore({ item: result.rows[0] });
  } catch {
    return noStore({ error: '保存失败。' }, 503);
  }
}

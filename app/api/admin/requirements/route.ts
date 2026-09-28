import { currentAdmin, filters, noStore, pool } from '@/lib/admin';

export async function GET(request: Request) {
  try {
    if (!await currentAdmin(request)) return noStore({ error: '请先登录。' }, 401);
    const url = new URL(request.url);
    const filter = filters(url);
    const page = Number(url.searchParams.get('page') || '1');
    if (!filter || !Number.isSafeInteger(page) || page < 1 || page > 100000) return noStore({ error: '筛选条件无效。' }, 400);
    const count = await pool.query(`SELECT count(*)::integer AS total FROM requirements ${filter.where}`, filter.params);
    const params = [...filter.params, 25, (page - 1) * 25];
    const items = await pool.query(
      `SELECT id, question, name, company, contact, status, internal_note, created_at FROM requirements ${filter.where} ORDER BY created_at DESC, id DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );
    return noStore({ items: items.rows, total: count.rows[0].total, page, pageSize: 25 });
  } catch {
    return noStore({ error: '读取需求失败。' }, 503);
  }
}

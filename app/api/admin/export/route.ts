import { csvCell, currentAdmin, filters, noStore, pool } from '@/lib/admin';

export async function GET(request: Request) {
  try {
    if (!await currentAdmin(request)) return noStore({ error: '请先登录。' }, 401);
    const filter = filters(new URL(request.url));
    if (!filter) return noStore({ error: '筛选条件无效。' }, 400);
    const count = await pool.query(`SELECT count(*)::integer AS total FROM requirements ${filter.where}`, filter.params);
    if (count.rows[0].total > 10000) return noStore({ error: '匹配结果超过 10000 条，请缩小日期范围后导出。' }, 413);
    const result = await pool.query(`SELECT id,created_at,company,name,contact,question,status,internal_note FROM requirements ${filter.where} ORDER BY created_at DESC,id DESC`, filter.params);
    const lines = [
      ['编号', '提交时间', '公司', '姓名', '联系方式', '问题', '状态', '内部备注'].map(csvCell).join(','),
      ...result.rows.map(row => [row.id, new Date(row.created_at).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false }), row.company, row.name, row.contact, row.question, row.status, row.internal_note].map(csvCell).join(',')),
    ];
    return new Response('\uFEFF' + lines.join('\r\n') + '\r\n', {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="fde-requirements.csv"',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return noStore({ error: '导出失败。' }, 503);
  }
}

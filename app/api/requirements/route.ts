import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.PGHOST || '/var/run/postgresql',
  database: process.env.PGDATABASE || 'fde',
  user: process.env.PGUSER || 'fde',
  max: 5,
  connectionTimeoutMillis: 5000,
});

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const allowed = process.env.APP_ORIGIN || 'https://fde.cloudsequ.com';
  if (origin !== allowed) return Response.json({ error: '请求来源不受支持。' }, { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return Response.json({ error: '请使用 JSON 提交。' }, { status: 415 });
  }
  const reader = request.body?.getReader();
  if (!reader) return Response.json({ error: '提交内容不能为空。' }, { status: 400 });
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > 16384) {
      await reader.cancel();
      return Response.json({ error: '提交内容过长。' }, { status: 413 });
    }
    chunks.push(value);
  }
  let data: Record<string, unknown>;
  try { data = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { return Response.json({ error: '提交格式不正确。' }, { status: 400 }); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return Response.json({ error: '提交格式不正确。' }, { status: 400 });
  }
  const limits = { question: 2000, name: 80, company: 160, contact: 160 };
  const fields: Record<string, string> = {};
  for (const [key, limit] of Object.entries(limits)) {
    const value = data[key];
    if (typeof value !== 'string' || !value.trim() || value.trim().length > limit) {
      return Response.json({ error: '请完整填写问题、姓名、公司和联系方式，并检查长度。' }, { status: 400 });
    }
    fields[key] = value.trim();
  }
  try {
    const result = await pool.query(
      'INSERT INTO requirements (question, name, company, contact) VALUES ($1, $2, $3, $4) RETURNING id',
      [fields.question, fields.name, fields.company, fields.contact],
    );
    return Response.json({ id: result.rows[0].id }, { status: 201 });
  } catch {
    console.error('Requirement storage failed');
    return Response.json({ error: '暂时无法保存，请稍后重试。' }, { status: 503 });
  }
}

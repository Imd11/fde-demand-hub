import assert from 'node:assert/strict';
import { test } from 'node:test';
import { csvCell, filters, hashPassword, verifyPassword } from '../lib/admin.ts';

void test('password hashes use fresh salts and verify the correct password', async () => {
  const first = await hashPassword('a safe example password');
  const second = await hashPassword('a safe example password');
  assert.notEqual(first, second);
  assert.equal(await verifyPassword('a safe example password', first), true);
  assert.equal(await verifyPassword('a wrong password', first), false);
});

void test('filters bind user values and reject unsupported statuses', () => {
  const result = filters(new URL('https://fde.cloudsequ.com/api/admin/requirements?company=%25_%27&status=new&from=2026-09-01&to=2026-09-28'));
  assert.ok(result);
  assert.match(result.where, /company ILIKE \$1/);
  assert.equal(result.params[0], '%\\%\\_\'%');
  assert.equal(filters(new URL('https://fde.cloudsequ.com/api/admin/requirements?status=all;DROP TABLE requirements')), null);
});

void test('CSV escapes quotes and blocks spreadsheet formulas', () => {
  assert.equal(csvCell('a"b'), '"a""b"');
  assert.equal(csvCell('=1+1'), '"\'=1+1"');
  assert.equal(csvCell('  +SUM(A1)'), '"\'  +SUM(A1)"');
});

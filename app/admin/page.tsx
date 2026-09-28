'use client';

import { useCallback, useEffect, useState, type SyntheticEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { AppHeader } from '@/components/sites/devorder-csdn-net-e00368e5/root-8a5edab2/AppHeader';
import './admin.css';

type Requirement = {
  id: string;
  question: string;
  name: string;
  company: string;
  contact: string;
  status: 'new' | 'in_progress' | 'done';
  internal_note: string;
  created_at: string;
};
type Filter = { company: string; from: string; to: string; status: string };
type ApiResponse = { error?: string; items?: Requirement[]; total?: number; authenticated?: boolean; setupAvailable?: boolean };
const emptyFilter: Filter = { company: '', from: '', to: '', status: '' };
const labels = { new: '待处理', in_progress: '处理中', done: '已完成' };
function query(filter: Filter, page?: number) {
  const p = new URLSearchParams();
  for (const [key, value] of Object.entries(filter)) if (value) p.set(key, value);
  if (page) p.set('page', String(page));
  return p.toString();
}
async function api(path: string, init?: RequestInit) {
  const response = await fetch(path, { credentials: 'same-origin', cache: 'no-store', ...init });
  const body = await response.json() as ApiResponse;
  if (!response.ok) throw new Error(body.error || '操作失败。');
  return body;
}

function HomeLink() {
  // Vinext's client router fails on this production route; use a full page navigation.
  // oxlint-disable-next-line next/no-html-link-for-pages
  return <a href="/">返回 FDE 首页</a>;
}

export default function AdminPage() {
  const [mode, setMode] = useState<'loading' | 'setup' | 'login' | 'dashboard'>('loading');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [setupCode, setSetupCode] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Filter>(emptyFilter);
  const [filter, setFilter] = useState<Filter>(emptyFilter);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Requirement[]>([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Requirement | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api('/api/admin/requirements?' + query(filter, page));
      setItems(data.items || []);
      setTotal(data.total || 0);
      setMessage('');
      setSelected(previous => previous ? (data.items || []).find(row => row.id === previous.id) || null : null);
    } catch (error) {
      if ((error as Error).message === '请先登录。') setMode('login');
      setMessage((error as Error).message);
    }
  }, [filter, page]);

  useEffect(() => {
    api('/api/admin/session').then(data => setMode(data.authenticated ? 'dashboard' : data.setupAvailable ? 'setup' : 'login'))
      .catch(error => { setMode('login'); setMessage(error.message); });
  }, []);
  useEffect(() => { if (mode === 'dashboard') { const timer = setTimeout(() => void load(), 0); return () => clearTimeout(timer); } }, [mode, load]);

  async function submitAuth(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage('');
    try {
      await api(mode === 'setup' ? '/api/admin/setup' : '/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'setup' ? { setupCode, password } : { username, password }),
      });
      setPassword(''); setSetupCode(''); setMode('dashboard');
    } catch (error) { setMessage((error as Error).message); }
    finally { setBusy(false); }
  }

  async function save() {
    if (!selected) return;
    setBusy(true); setMessage('');
    try {
      await api('/api/admin/requirements/' + selected.id, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selected.status, internalNote: selected.internal_note }),
      });
      await load();
      setMessage('已保存。');
    } catch (error) { setMessage((error as Error).message); }
    finally { setBusy(false); }
  }

  async function exportCsv() {
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/admin/export?' + query(filter), { credentials: 'same-origin', cache: 'no-store' });
      if (!response.ok) throw new Error(((await response.json()) as ApiResponse).error || '导出失败。');
      const url = URL.createObjectURL(await response.blob());
      const a = document.createElement('a');
      a.href = url; a.download = 'fde-requirements.csv'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) { setMessage((error as Error).message); }
    finally { setBusy(false); }
  }

  async function logout() {
    try { await api('/api/admin/logout', { method: 'POST' }); setMode('login'); setItems([]); setSelected(null); }
    catch (error) { setMessage((error as Error).message); }
  }

  return <main className="fde-admin">
    <div className="admin-header-shell"><AppHeader><nav className="admin-nav" aria-label="管理后台导航"><HomeLink />{mode === 'dashboard' && <button type="button" className="quiet" onClick={logout}>退出登录</button>}</nav></AppHeader></div>
    {mode === 'loading' && <div className="auth-stage"><span className="admin-eyebrow"><span />产业园 FDE 总站 · 需求管理</span><p className="hint">正在检查登录状态…</p></div>}
    {(mode === 'setup' || mode === 'login') && <div className="auth-stage">
      <div className="auth-intro"><span className="admin-eyebrow"><span />产业园 FDE 总站 · 需求管理</span><h1>让每一个问题，<br className="admin-mobile-break" />都有回应。</h1><p>查看需求、跟进进展，让好的想法继续向前。</p></div>
      <section className="auth-card" aria-labelledby="auth-title">
      <div className="auth-card-heading"><span className="auth-card-mark" aria-hidden="true">FDE</span><div><p className="eyebrow">管理员工作台</p><h2 id="auth-title">{mode === 'setup' ? '启用管理员账号' : '欢迎回来'}</h2></div></div>
      <p className="hint">{mode === 'setup' ? '使用启用码设置管理员密码。' : '登录后查看、处理和导出用户需求。'}</p>
      <form onSubmit={submitAuth}>
        {mode === 'setup' ? <label>一次性启用码<input autoComplete="off" required value={setupCode} onChange={e => setSetupCode(e.target.value)} /></label> : <label>账号<input autoComplete="username" required value={username} onChange={e => setUsername(e.target.value)} /></label>}
        <label>{mode === 'setup' ? '设置密码（至少 12 位）' : '密码'}<input type="password" autoComplete={mode === 'setup' ? 'new-password' : 'current-password'} minLength={mode === 'setup' ? 12 : undefined} required value={password} onChange={e => setPassword(e.target.value)} /></label>
        <button type="submit" disabled={busy}>{busy ? '请稍候…' : mode === 'setup' ? '启用并进入后台' : '进入工作台'}<ArrowUpRight size={17} aria-hidden="true" /></button>
      </form>
      {message && <p role="alert" className="admin-message">{message}</p>}
      </section>
      <p className="auth-footnote">仅供授权管理员使用 · 用户需求仅在后台显示</p>
    </div>}
    {mode === 'dashboard' && <div className="admin-main">
      <div className="admin-title"><div><span className="admin-eyebrow"><span />产业园 FDE 总站 · 管理工作台</span><h1>每一个问题，都有回应。</h1><p className="hint">需求管理 · 查看用户提交的问题，记录处理进展。</p></div><button type="button" className="secondary" disabled={busy} onClick={exportCsv}>导出当前筛选 CSV <ArrowUpRight size={16} aria-hidden="true" /></button></div>
      <form className="filter-bar" onSubmit={e => { e.preventDefault(); setPage(1); setFilter({ ...draft }); setSelected(null); }}>
        <label>公司关键词<input value={draft.company} maxLength={160} placeholder="搜索公司" onChange={e => setDraft({ ...draft, company: e.target.value })} /></label>
        <label>开始日期<input type="date" value={draft.from} onChange={e => setDraft({ ...draft, from: e.target.value })} /></label>
        <label>结束日期<input type="date" value={draft.to} onChange={e => setDraft({ ...draft, to: e.target.value })} /></label>
        <label>处理状态<select value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value })}><option value="">全部状态</option>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <button type="submit">筛选</button>
      </form>
      {message && <output className="admin-message">{message}</output>}
      <div className="list-heading"><strong>需求列表</strong><span>共 {total} 条 · 北京时间</span><button type="button" className="quiet" onClick={() => void load()}>刷新</button></div>
      <div className="table-wrap"><table><thead><tr><th>提交时间</th><th>公司</th><th>联系人</th><th>问题摘要</th><th>状态</th><th aria-label="操作"></th></tr></thead><tbody>
        {items.map(item => <tr key={item.id}><td>{new Date(item.created_at).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false })}</td><td>{item.company}</td><td>{item.name}</td><td className="summary">{item.question}</td><td><span className={'status ' + item.status}>{labels[item.status] || item.status}</span></td><td><button type="button" className="quiet" onClick={() => { setSelected(item); setMessage(''); }}>查看</button></td></tr>)}
        {items.length === 0 && <tr><td colSpan={6} className="empty">当前筛选没有需求。</td></tr>}
      </tbody></table></div>
      <div className="pager"><button type="button" className="secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>上一页</button><span>第 {page} / {Math.max(1, Math.ceil(total / 25))} 页</span><button type="button" className="secondary" disabled={page * 25 >= total} onClick={() => setPage(page + 1)}>下一页</button></div>
      {selected && <div className="detail-backdrop"><dialog open className="detail-panel" aria-labelledby="detail-title"><div className="detail-top"><h2 id="detail-title">需求 #{selected.id}</h2><button type="button" className="quiet" onClick={() => setSelected(null)}>关闭</button></div><dl><dt>公司</dt><dd>{selected.company}</dd><dt>联系人</dt><dd>{selected.name}</dd><dt>联系方式</dt><dd>{selected.contact}</dd><dt>提交时间</dt><dd>{new Date(selected.created_at).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false })}</dd><dt>完整问题</dt><dd className="full-question">{selected.question}</dd></dl><label>处理状态<select value={selected.status} onChange={e => setSelected({ ...selected, status: e.target.value as Requirement['status'] })}>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>内部备注<textarea rows={6} maxLength={4000} value={selected.internal_note} placeholder="记录沟通进展，仅管理员可见" onChange={e => setSelected({ ...selected, internal_note: e.target.value })} /></label><button type="button" disabled={busy} onClick={save}>{busy ? '保存中…' : '保存修改'}</button></dialog></div>}
    </div>}
    <footer className="admin-footer">© 2026 序动科技 · 企业 AI 服务 <span>FDE 需求管理</span></footer>
  </main>;
}

"use client";

import { useRef, useState, type SyntheticEvent } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';



export function RequirementForm() {
  const [question, setQuestion] = useState('');
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const input = useRef<HTMLTextAreaElement>(null);

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSaved(false);
    const form = event.currentTarget;
    const data = new FormData(form);
    const rawContact = data.get('contact');
    const contact = typeof rawContact === 'string' ? rawContact.trim() : '';
    const rawName = data.get('name');
    const name = typeof rawName === 'string' ? rawName.trim() : '';
    if (!question.trim()) { setError('请先简单说说你的问题。'); input.current?.focus(); return; }
    const rawCompany = data.get('company');
    const company = typeof rawCompany === 'string' ? rawCompany.trim() : '';
    if (!name) { setError('请填写姓名。'); return; }
    if (!company) { setError('请填写公司名称。'); return; }
    if (!contact) { setError('请留下手机或邮箱，便于后续联系。'); return; }
    setSubmitting(true);
    try {
      const response = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim(), name, company, contact }),
      });
      if (!response.ok) {
        const result: unknown = await response.json().catch(() => null);
        const message = result && typeof result === 'object' && 'error' in result && typeof result.error === 'string' ? result.error : '提交失败，请稍后重试。';
        throw new Error(message);
      }
      setError('');
      setSaved(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : '提交失败，请稍后重试。');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="consultation">
      <form className="consultation-form" onSubmit={submit} onChange={() => setSaved(false)}>
        <div className="question-heading consultation-heading"><label htmlFor="question">你想解决的问题</label><span className="free-consultation-badge">免费咨询</span></div>
        <div className="question-card">
        <textarea ref={input} id="question" name="question" maxLength={2000} required value={question} onChange={e => { setQuestion(e.target.value); setSaved(false); }} placeholder="哪项工作最费时间，或者哪个环节最想改善？" />
        </div>
        <div className="consultation-details">
          <div className="contact-fields">
            <label><span>姓名</span><input name="name" required autoComplete="name" placeholder="你的姓名" maxLength={80} /></label>
            <label className="company-field"><span>公司名称</span><input name="company" required autoComplete="organization" placeholder="你的公司名称" maxLength={160} /></label>
            <label className="contact-field"><span>联系方式</span><input name="contact" required placeholder="手机或邮箱" maxLength={160} /></label>
          </div>
        </div>
        <div className="consultation-actions">
          <button className="consult-button" type="submit" disabled={submitting || saved}>{submitting ? '正在提交…' : saved ? '已提交' : '免费咨询'}<ArrowUpRight size={18} /></button>
        </div>
        {error && <p className="form-message error" role="alert">{error}</p>}
        {saved && <output className="form-message" aria-live="polite"><Check size={16} />问题已提交，我们会通过你留下的联系方式与你联系。</output>}
      </form>

    </div>
  );
}

"use client";

import { useRef, useState, type SyntheticEvent } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';



export function RequirementForm() {
  const [question, setQuestion] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const input = useRef<HTMLTextAreaElement>(null);

  function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const rawContact = data.get('contact');
    const contact = typeof rawContact === 'string' ? rawContact.trim() : '';
    const rawName = data.get('name');
    const name = typeof rawName === 'string' ? rawName.trim() : '';
    if (!question.trim()) { setError('请先简单说说你的问题。'); input.current?.focus(); return; }
    if (!contact) { setError('请留下手机或邮箱，便于后续联系。'); return; }
    try {
      localStorage.setItem('fde-consultation-draft', JSON.stringify({ question: question.trim(), name, contact }));
      setError('');
      setSaved(true);
    } catch {
      setError('浏览器未能保存，请复制问题内容后重试。');
    }
  }

  return (
    <div className="consultation">
      <form className="consultation-form" onSubmit={submit}>
        <div className="question-heading consultation-heading"><label htmlFor="question">你想解决的问题</label><span className="free-consultation-badge">咨询免费</span></div>
        <div className="question-card">
        <textarea ref={input} id="question" name="question" maxLength={2000} required value={question} onChange={e => { setQuestion(e.target.value); setSaved(false); }} placeholder="哪项工作最费时间，或者哪个环节最想改善？" />
        </div>
        <div className="consultation-details">
          <div className="contact-fields">
            <label><span>姓名</span><input name="name" required autoComplete="name" placeholder="你的姓名" maxLength={80} /></label>
            
            <label className="contact-field"><span>联系方式</span><input name="contact" required placeholder="手机或邮箱" maxLength={160} /></label>
          </div>
        </div>
        <div className="consultation-actions">
          <button className="consult-button" type="submit">免费咨询<ArrowUpRight size={18} /></button>
        </div>
        {error && <p className="form-message error" role="alert">{error}</p>}
        {saved && <output className="form-message" aria-live="polite"><Check size={16} />问题已暂存到本机。当前为交互预览，尚未发送给服务团队。</output>}
      </form>

    </div>
  );
}

import { AppHeader } from '@/components/sites/devorder-csdn-net-e00368e5/root-8a5edab2/AppHeader';
import { RequirementForm } from '@/components/sites/devorder-csdn-net-e00368e5/root-8a5edab2/RequirementForm';

export default function Home() {
  return (
    <main className="workstation">
      <AppHeader />
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-eyebrow"><span />产业园 FDE 总站</div>
        <h1 id="hero-title">关于 AI，<br className="mobile-break" />从你的问题开始。</h1>
        <RequirementForm />
      </section>
      <footer className="site-footer">
        
        <span>© 2026 序动科技 · 企业 AI 服务</span>
      </footer>
    </main>
  );
}

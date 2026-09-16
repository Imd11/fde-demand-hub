import { MapPin } from 'lucide-react';
import { AppHeader } from '@/components/sites/devorder-csdn-net-e00368e5/root-8a5edab2/AppHeader';
import { RequirementForm } from '@/components/sites/devorder-csdn-net-e00368e5/root-8a5edab2/RequirementForm';

// Fictional profiles for the local design preview, not confirmed CSDN experts.
const demoExperts = [
  { name: '陈远', city: '北京', role: '企业 AI 应用架构师', specialties: ['RAG 知识库', '智能体开发'], experience: '制造企业内部知识问答平台' },
  { name: '林悦', city: '上海', role: 'AI 产品与交付顾问', specialties: ['业务梳理', 'AI 产品设计'], experience: '企业 AI 应用从试点到上线' },
  { name: '张衡', city: '唐山', role: '工业智能化工程师', specialties: ['设备运维', '生产数据分析'], experience: '工业设备巡检与故障知识库' },
  { name: '周宁', city: '天津', role: '数据工程师', specialties: ['数据治理', '企业系统集成'], experience: '业务系统与 AI 应用数据接入' },
  { name: '王睿', city: '北京', role: '智能体开发工程师', specialties: ['任务编排', '流程自动化'], experience: '采购与合同处理智能助手' },
  { name: '许嘉', city: '杭州', role: 'AI 内容应用工程师', specialties: ['文案生成', '图像工作流'], experience: '直播素材整理与内容创作' },
  { name: '李珂', city: '苏州', role: '计算机视觉工程师', specialties: ['图像识别', '工业视觉检测'], experience: '生产线缺陷识别与质检辅助' },
  { name: '赵谦', city: '深圳', role: '企业应用全栈工程师', specialties: ['Web 应用', '业务系统开发'], experience: '企业 AI 服务平台开发与部署' },
  { name: '顾言', city: '南京', role: '能源行业 AI 顾问', specialties: ['能源管理', '运行数据分析'], experience: '园区能耗分析与运营辅助' },
  { name: '沈禾', city: '成都', role: 'AI 应用测试工程师', specialties: ['检索评估', '生成质量测试'], experience: '企业知识助手的效果评测' },
];

export default function Home() {
  return (
    <main className="workstation">
      <AppHeader />
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-eyebrow"><span />产业园 FDE 总站</div>
        <h1 id="hero-title">关于 AI，<br className="mobile-break" />从你的问题开始。</h1>
        <RequirementForm />
      </section>
      <section className="experts-section" aria-labelledby="experts-title">
        <div className="experts-heading">
          <h2 id="experts-title">FDE 专家</h2>
        </div>
        <div className="experts-grid">
          {demoExperts.map((expert, index) => (
            <article className="expert-card" key={expert.name} aria-label={`${expert.name}，模拟专家资料`}>
              <div className="expert-identity">
                <div className="expert-avatar" style={{ backgroundPosition: `${(index % 5) * 25}% ${index < 5 ? 0 : 100}%` }} aria-hidden="true" />
                <div className="expert-profile">
                  <div className="expert-name-row">
                    <h3>{expert.name}</h3>
                    <span className="expert-location"><MapPin size={12} aria-hidden="true" /><span className="sr-only">所在地</span>{expert.city}</span>
                  </div>
                  <p className="expert-role">{expert.role}</p>
                </div>
              </div>
              <ul className="expert-specialties" aria-label="擅长方向">
                {expert.specialties.map((specialty) => <li key={specialty}>{specialty}</li>)}
              </ul>
              <div className="expert-experience">
                <span>项目经验</span>
                <p>{expert.experience}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <footer className="site-footer">
        
        <span>© 2026 序动科技 · 企业 AI 服务</span>
      </footer>
    </main>
  );
}

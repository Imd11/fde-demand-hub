import { CircleCheck, Code2, MessageSquareText } from 'lucide-react';

import { AppHeader } from '@/components/sites/devorder-csdn-net-e00368e5/root-8a5edab2/AppHeader';
import { RequirementForm } from '@/components/sites/devorder-csdn-net-e00368e5/root-8a5edab2/RequirementForm';

const steps = [
  {
    index: '01',
    title: '提交需求',
    description: '写清楚背景、目标与期望结果',
    icon: MessageSquareText,
  },
  {
    index: '02',
    title: '负责人确认',
    description: '补齐范围、优先级和交付标准',
    icon: CircleCheck,
  },
  {
    index: '03',
    title: '开发对接',
    description: '确认方案后进入排期与实施',
    icon: Code2,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f6f2] text-[#17181c]">
      <AppHeader />

      <section className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-45 [background-image:linear-gradient(rgba(23,24,28,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(23,24,28,0.045)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <div className="relative mx-auto grid w-full max-w-[1180px] gap-12 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16 lg:py-20">
          <div className="flex flex-col lg:sticky lg:top-[116px] lg:h-fit">
            <div className="mb-6 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-[#e04520]">
              <span className="h-px w-7 bg-current" />
              Internal request intake
            </div>
            <h1 className="max-w-[560px] text-[42px] font-semibold leading-[1.08] tracking-[-0.055em] text-[#17181c] sm:text-[56px] lg:text-[60px]">
              把需求说清楚，
              <span className="text-[#a3a097]">开发才能跑起来。</span>
            </h1>
            <p className="mt-6 max-w-[510px] text-[15px] leading-7 text-[#65645f] sm:text-base">
              用一个表单收齐背景、目标、优先级和联系方式。少来回确认一次，就能更快进入真正的开发。
            </p>

            <div className="mt-9 border-y border-black/[0.08]">
              {steps.map((step) => (
                <div
                  key={step.index}
                  className="group grid grid-cols-[36px_1fr_auto] items-center gap-3 border-b border-black/[0.08] py-4 last:border-b-0"
                >
                  <span className="font-mono text-[11px] text-[#a09e97]">
                    {step.index}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#2b2c30]">
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#85837d]">
                      {step.description}
                    </p>
                  </div>
                  <step.icon className="size-[18px] text-[#b7b4ac] transition-colors group-hover:text-[#e04520]" />
                </div>
              ))}
            </div>

          </div>

          <RequirementForm />
        </div>
      </section>

      <footer className="border-t border-black/[0.07] bg-[#f1f0eb]">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-5 text-[11px] text-[#88867f] sm:px-8">
          <p>© 2026 FDE 需求台 · 内部需求统一入口</p>
        </div>
      </footer>
    </main>
  );
}

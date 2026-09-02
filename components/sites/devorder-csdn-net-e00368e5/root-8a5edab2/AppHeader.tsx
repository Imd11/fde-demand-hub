import { Badge } from '@/components/ui/badge';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.07] bg-[#f7f6f2]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] w-full max-w-[1180px] items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-[10px] bg-[#e04520] text-sm font-bold text-white shadow-[0_4px_14px_rgba(224,69,32,0.24)]">
            F
          </span>
          <div>
            <p className="text-[15px] font-semibold tracking-[-0.02em] text-[#17181c]">
              FDE 需求台
            </p>
            <p className="text-[11px] text-[#74736f]">内部需求统一入口</p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="h-7 border-black/[0.09] bg-white/70 px-2.5 text-[11px] font-medium text-[#5f5e5a]"
        >
          <span className="size-1.5 rounded-full bg-[#e04520]" />
          前端预览
        </Badge>
      </div>
    </header>
  );
}

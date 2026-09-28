import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '需求管理｜FDE',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}

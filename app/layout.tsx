import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FDE 需求台｜内部需求统一入口',
  description: '快速收集需求背景、目标、优先级和联系方式，便于后续开发评估与对接。',
  openGraph: {
    title: 'FDE 需求台｜内部需求统一入口',
    description: '3 分钟说清需求，更快进入开发对接。',
    type: 'website',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FDE 需求台｜内部需求统一入口',
    description: '3 分钟说清需求，更快进入开发对接。',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

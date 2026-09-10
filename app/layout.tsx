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
  metadataBase: new URL('https://fde-demand-hub.jaylenbebetter1028.chatgpt.site'),
  title: '产业园 FDE 总站｜序动科技',
  description: '免费咨询企业 AI 应用问题，连接真实业务需求与专业开发者。',
  openGraph: {
    title: '产业园 FDE 总站｜序动科技',
    description: '关于 AI，从你的问题开始。',
    type: 'website',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '产业园 FDE 总站｜序动科技',
    description: '关于 AI，从你的问题开始。',
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

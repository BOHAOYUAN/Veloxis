import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Veloxis Wealth OS — Deterministic Planning Lab',
  description: 'Local-first household planning simulator with reproducible Current and Proposed plan comparisons',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-[#0b0f19] text-slate-100 min-h-screen antialiased selection:bg-cyan-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

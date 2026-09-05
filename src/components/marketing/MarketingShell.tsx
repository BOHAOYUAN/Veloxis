import Link from 'next/link';
import { ArrowRight, BarChart3, CheckCircle2, LockKeyhole, Sparkles } from 'lucide-react';
import { ReactNode } from 'react';
import { siteConfig } from '@/lib/site';

const navigation = [
  { href: '/for-independent-advisors', label: 'For advisors' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/pilot', label: 'Founding pilot' },
  { href: '/terms', label: 'Pilot terms' },
];

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f6f8fc] text-slate-950">
      <header className="border-b border-slate-200 bg-[#f6f8fc]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-2 font-black tracking-tight" aria-label="Veloxis home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#111c3d] text-sm text-white shadow-lg shadow-blue-950/15">V</span>
            <span>VELOXIS</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex" aria-label="Main navigation">
            {navigation.map(item => <Link key={item.href} href={item.href} className="transition hover:text-slate-950">{item.label}</Link>)}
          </nav>
          <Link href="/demo" className="rounded-lg bg-[#111c3d] px-3.5 py-2 text-sm font-bold text-white transition hover:bg-[#1d2d5d]">Open demo</Link>
        </div>
        <nav className="module-nav mx-auto flex max-w-6xl gap-5 overflow-x-auto border-t border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 md:hidden" aria-label="Main navigation">
          {navigation.map(item => <Link key={item.href} href={item.href} className="shrink-0 transition hover:text-slate-950">{item.label}</Link>)}
        </nav>
      </header>
      {children}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between md:px-8">
          <p>Veloxis is an educational planning simulator. It is not investment, tax, legal, or financial advice.</p>
          <div className="flex flex-wrap gap-4"><Link href="/privacy" className="hover:text-slate-950">Privacy</Link><Link href="/methodology" className="hover:text-slate-950">Methodology</Link><Link href="/terms" className="hover:text-slate-950">Pilot terms</Link>{siteConfig.contactEmail && <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-slate-950">Contact</a>}</div>
        </div>
      </footer>
    </main>
  );
}

export function PageHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.045em] text-[#111c3d] md:text-6xl">{title}</h1>
        <div className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{children}</div>
      </div>
    </section>
  );
}

export function PrimaryLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#111c3d] px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-950/15 transition hover:bg-[#1d2d5d]">{children}<ArrowRight className="h-4 w-4" /></Link>;
}

export function ProofPoint({ icon, title, children }: { icon: 'paths' | 'ledger' | 'local'; title: string; children: ReactNode }) {
  const Icon = icon === 'paths' ? BarChart3 : icon === 'ledger' ? CheckCircle2 : LockKeyhole;
  return <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><Icon className="h-5 w-5 text-blue-700" /><h2 className="mt-5 text-lg font-bold text-[#111c3d]">{title}</h2><p className="mt-2 leading-7 text-slate-600">{children}</p></article>;
}

export function PilotCallout() {
  return <aside className="rounded-2xl bg-[#111c3d] p-7 text-white shadow-xl shadow-blue-950/15 md:p-9"><div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div><p className="flex items-center gap-2 text-sm font-bold text-cyan-300"><Sparkles className="h-4 w-4" />FOUNDING ADVISOR PILOT</p><h2 className="mt-2 text-2xl font-black">A guided 30-day evaluation for $99.</h2><p className="mt-2 max-w-2xl leading-7 text-slate-300">Two guided synthetic meeting cases, facilitation notes, written onboarding, and up to three support exchanges with the builder.</p></div><Link href="/pilot" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3.5 text-sm font-bold text-[#111c3d] transition hover:bg-cyan-50">See pilot details<ArrowRight className="h-4 w-4" /></Link></div></aside>;
}

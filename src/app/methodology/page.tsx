import { Metadata } from 'next';
import { MarketingShell, PageHeading } from '@/components/marketing/MarketingShell';
import { StructuredData, faqSchema } from '@/components/marketing/StructuredData';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = { title: 'Methodology and limits | Veloxis', description: 'How Veloxis produces reproducible retirement scenario comparisons and where its model stops.', alternates: { canonical: absoluteUrl('/methodology') } };

const sections = [
  ['A shared annual ledger', 'The projection records opening assets, earned income, savings, target spending, retirement spending, withdrawals, and ending assets for every modeled age. Monetary values are shown in today’s dollars.'],
  ['Seeded Monte Carlo paths', 'A seeded pseudo-random generator means the same inputs and seed reproduce the same distribution. Current and proposed plans use the same sequence of simulated market returns.'],
  ['Plan-end measurement', 'Success and ruin probabilities are measured at the household’s entered plan-end age, not at a fixed age. Retirement starts at the entered retirement age.'],
  ['What the model does not do', 'Veloxis does not optimize Social Security, calculate taxes, connect accounts, validate estate documents, trade securities, or provide personalized recommendations.'],
];

export default function MethodologyPage() {
  return <MarketingShell><StructuredData value={faqSchema} /><PageHeading eyebrow="Methodology" title="A scenario comparison should be reproducible and inspectable."><p>Veloxis is designed to show the calculation path behind a scenario discussion—not to turn a simulation into a recommendation.</p></PageHeading><section className="mx-auto max-w-4xl px-5 py-14 md:px-8"><div className="space-y-4">{sections.map(([title, body], index) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8"><p className="font-mono text-sm text-blue-700">0{index + 1}</p><h2 className="mt-2 text-2xl font-black tracking-tight text-[#111c3d]">{title}</h2><p className="mt-3 text-base leading-8 text-slate-600">{body}</p></article>)}</div><aside className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950"><h2 className="font-bold">Important limitation</h2><p className="mt-2 leading-7">Outputs are planning simulations for educational discussion only. They are not investment, tax, legal, or financial advice. An advisor remains responsible for professional judgment, client communications, and compliance review.</p></aside></section></MarketingShell>;
}


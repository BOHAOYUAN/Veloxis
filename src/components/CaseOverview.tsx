import { SimulationParams } from '@/types/financial';

export function CaseOverview({ params }: { params: SimulationParams }) {
  const money = (value: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(value);
  const facts = [
    ['Starting invested assets', money(params.initialCapital)],
    ['Current age', String(params.currentAge)],
    ['Current retirement age', String(params.retirementAge)],
    ['Plan end age', String(params.maxAge)],
    ['Nominal annual return', `${(params.expectedReturn * 100).toFixed(1)}%`],
    ['Annual inflation', `${(params.inflationRate * 100).toFixed(1)}%`],
    ['Annual volatility', `${(params.volatility * 100).toFixed(1)}%`],
    ['Social Security estimate', `${money(params.annualSocialSecurity)}/year from age ${params.socialSecurityClaimAge}`],
  ];
  return <section aria-labelledby="baseline-heading" className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
    <h2 id="baseline-heading" className="font-bold text-slate-100">1. Understand the fictional baseline</h2>
    <dl className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">{facts.map(([label, value]) => <div key={label}><dt className="text-xs text-slate-400">{label}</dt><dd className="mt-1 text-sm font-semibold text-slate-100">{value}</dd></div>)}</dl>
    <p className="mt-4 text-xs leading-6 text-slate-400">Amounts use today&apos;s dollars. Returns and inflation are assumptions, not forecasts. Social Security uses a fixed supplied amount: changing the claim age changes its start date only.</p>
    <details className="mt-3 text-xs leading-6 text-slate-400"><summary className="cursor-pointer text-cyan-300">How to interpret the calculation</summary>
      <p>The first age is an opening snapshot. Later years apply returns and then net cash flows. Retirement spending replaces the pre-retirement expense budget; include housing and debt payments in that retirement budget. Changing annual savings adjusts pre-retirement spending, with spending floored at zero. Actual yearly contributions can differ from the selected savings amount.</p>
      <p>Income ending immediately before baseline retirement follows the proposed retirement age. Other income dates stay fixed. The Monte Carlo model treats depleted assets as an absorbing failure; the expected-return ledger can show later contributions. The ledger is not the Monte Carlo median path. There are no tax calculations or automatic benefit adjustments.</p>
    </details>
  </section>;
}

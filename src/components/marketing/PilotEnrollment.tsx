import Link from 'next/link';
import { resolvePilotEnrollment } from '@/lib/pilotConfig';
import { siteConfig } from '@/lib/site';

export function PilotEnrollment() {
  const enrollment = resolvePilotEnrollment(siteConfig);

  if (!siteConfig.pilotOfferPublished) {
    return (
      <aside id="enrollment" className="rounded-2xl bg-[#111c3d] p-7 text-white shadow-xl shadow-blue-950/15">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">Feedback cohort</p>
        <p className="mt-3 text-3xl font-black">Evaluation before monetization</p>
        <p className="mt-3 leading-7 text-slate-300">This portfolio build is collecting candid workflow feedback from independent advisors. It does not offer paid access or accept orders.</p>
        <div className="mt-7 grid gap-2 text-center text-sm font-bold">
          <Link href="/demo" className="rounded-lg bg-white px-4 py-3 text-[#111c3d] hover:bg-cyan-50">Start the guided synthetic demo</Link>
          <Link href="/workspace" className="rounded-lg border border-cyan-300/30 px-4 py-3 text-cyan-100 hover:bg-cyan-300/10">Open the browser-local workspace</Link>
        </div>
        {siteConfig.contactEmail && (
          <div className="mt-6 border-t border-white/15 pt-5 text-sm leading-6">
            <h2 className="font-bold">Share blunt feedback</h2>
            <a href={`mailto:${siteConfig.contactEmail}?subject=Veloxis%20advisor%20workflow%20feedback`} className="mt-2 block break-all text-cyan-300 underline hover:text-white">{siteConfig.contactEmail}</a>
            <p className="mt-3 text-slate-300">Please use fictional cases only. Do not email client documents or personal financial information.</p>
          </div>
        )}
      </aside>
    );
  }

  return (
    <aside id="enrollment" className="rounded-2xl bg-[#111c3d] p-7 text-white shadow-xl shadow-blue-950/15">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">Founding price</p>
      <p className="mt-3 text-5xl font-black">$99</p>
      <p className="mt-2 text-slate-300">One-time guided evaluation. No recurring subscription.</p>
      {enrollment.open ? (
        <>
          <a href={enrollment.checkoutUrl} className="mt-7 flex w-full items-center justify-center rounded-lg bg-white px-5 py-3.5 text-sm font-bold text-[#111c3d] transition hover:bg-cyan-50">Purchase through Dodo Payments</a>
          <p className="mt-3 text-center text-xs leading-5 text-slate-400">Dodo Payments handles checkout and the payment receipt. Materials are sent manually after payment verification.</p>
        </>
      ) : (
        <div className="mt-7 rounded-lg border border-cyan-300/30 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50">
          <strong>Enrollment is not open yet.</strong>
          <p>We are preparing the guided evaluation. You can explore the free demo or ask about the pilot. An email does not create an order or reserve a place.</p>
        </div>
      )}
      <div className="mt-5 grid gap-2 text-center text-sm font-bold">
        <Link href="/demo" className="text-cyan-300 hover:text-white">Start with the guided synthetic demo</Link>
        <Link href="/workspace" className="rounded-lg border border-cyan-300/30 px-4 py-2.5 text-cyan-100 hover:bg-cyan-300/10">Open the browser-local workspace preview</Link>
      </div>
      {siteConfig.contactEmail && (
        <div className="mt-6 border-t border-white/15 pt-5 text-sm leading-6">
          <h2 className="font-bold">Questions, support or refund requests</h2>
          <a href={`mailto:${siteConfig.contactEmail}?subject=Veloxis%20Founding%20Advisor%20Pilot`} className="mt-2 block break-all text-cyan-300 underline hover:text-white">{siteConfig.contactEmail}</a>
          <p className="mt-3 text-slate-300">Please use fictional cases only. Do not email client documents or personal financial information.</p>
        </div>
      )}
    </aside>
  );
}

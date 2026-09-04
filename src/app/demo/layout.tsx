import { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Synthetic retirement scenario demo',
  description: 'Explore a fictional Current Plan versus Proposed Plan retirement scenario. Do not enter client data.',
  alternates: { canonical: absoluteUrl('/demo') },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}

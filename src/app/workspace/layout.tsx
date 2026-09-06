import { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Browser-local advisor workspace preview',
  description: 'Explore the Veloxis planning workspace with fictional data stored only in this browser.',
  alternates: { canonical: absoluteUrl('/workspace') },
  robots: { index: false, follow: false },
};

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}

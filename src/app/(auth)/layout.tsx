import { Suspense } from 'react';

import { Metadata } from 'next';

import { config } from '@/lib/boiler-config';

export const metadata: Metadata = {
  title: `${config.name} | Authentification`,
  description: config.description,
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <main className="flex h-screen items-center justify-center">
      <Suspense fallback={<div>Chargement...</div>}>{children}</Suspense>
    </main>
  );
}

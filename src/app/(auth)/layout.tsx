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
}>) {
  return <main className="flex h-screen items-center justify-center">{children}</main>;
}

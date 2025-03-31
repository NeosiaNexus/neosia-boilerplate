import { Metadata } from 'next';

import { config } from '@/lib';

export const metadata: Metadata = {
  title: `${config.name} | Authentification`,
  description: config.description,
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}

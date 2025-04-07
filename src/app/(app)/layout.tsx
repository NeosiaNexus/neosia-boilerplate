import { Metadata } from 'next';

import { config } from '@/lib/boiler-config';

export const metadata: Metadata = {
  title: `${config.name}`,
  description: config.description,
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}

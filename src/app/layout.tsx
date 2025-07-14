import { Suspense } from 'react';

import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Toaster } from 'sonner';

import { config } from '@/lib/boiler-config';
import ServerToaster from '@/lib/server-toast/ServerToaster';
import './globals.css';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: config.name,
  description: config.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang={config.lang} suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased`}>
        <Toaster richColors expand />
        <Suspense>
          <ServerToaster />
        </Suspense>
        {children}
      </body>
    </html>
  );
}

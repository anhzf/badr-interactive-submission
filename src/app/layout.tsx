import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import AppLayout from '@/components/app-layout';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Order Management - Badr Interactive',
  description: 'Order Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}

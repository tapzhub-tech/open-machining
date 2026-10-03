import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Open Machining | From Opportunity to Delivery',
  description:
    'Procurement intelligence, bid management and contract manufacturing. Open Machining brings procurement, engineering and India’s manufacturing capacity together in one platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <Footer />
      </body>
    </html>
  );
}

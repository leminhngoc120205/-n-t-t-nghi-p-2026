import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Lora } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import { NavigationProgress } from '@/components/IMS/NavigationProgress';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IMS - Cổng thông tin điện tử',
  description: 'Information Management System - Cổng thông tin điện tử IMS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${lora.variable}`}>
      <body className="bg-[#f0f2f5]" style={{ fontFamily: 'var(--font-sans), sans-serif' }}>
        <NavigationProgress />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';

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
    <html lang="vi">
      <body className="bg-[#f0f2f5]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

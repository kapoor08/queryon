import type React from 'react';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { TranslationProvider } from '@/contexts';
import { TranslationLoadingIndicator } from '@/shared/elements/client';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Queryon - AI-Powered Customer Support',
  description:
    'Transform your customer support with intelligent chat widgets. Deploy in minutes, customize everything.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TranslationProvider>
            <TranslationLoadingIndicator />
            {children}
          </TranslationProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

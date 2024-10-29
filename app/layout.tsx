import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { ThemeProvider } from '@/provider/theme-provider';
import { Toaster } from '@/components/ui/toaster';

import './globals.css';
import NProgressProvider from '@/provider/nprogress.provider';

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Orphancare - PSAA Annajah Database Management System',
  description: 'PSAA Annajah Database Management System Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script src='https://smallpdf.com/api/embed-widget.js'></script>
      </head>
      <body className={`${nunito.className} antialiased overflow-hidden`}>
        <NProgressProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            enableSystem
            disableTransitionOnChange
          >
            <main>{children}</main>
            <Toaster />
          </ThemeProvider>
        </NProgressProvider>
      </body>
    </html>
  );
}

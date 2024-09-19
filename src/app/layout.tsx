import type { Metadata } from 'next';
import '../styles/globals.css';
import Footer from '@/components/templates/Footer';
import NavBar from '@/components/templates/NavBar';
import LoadingHapp from '@/components/templates/LoadingHapp';
import DialogHapp from '@/components/templates/DialogHapp';
import { AuthProvider } from '@/context/auth';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Clover Stamp',
  description: 'Gathering every single happiness',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={'antialiased'}>
        <Script
          id="adsense-script"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8265068064055309"
          crossOrigin="anonymous"
        />
        <AuthProvider>
          <NavBar />
          {children}
          <Footer />
          <LoadingHapp />
          <DialogHapp />
        </AuthProvider>
      </body>
    </html>
  );
}

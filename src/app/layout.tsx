import type { Metadata } from 'next';
import '../styles/globals.css';
import Footer from '@/components/templates/Footer';
import NavBar from '@/components/templates/NavBar';
import LoadingHapp from '@/components/templates/LoadingHapp';
import DialogHapp from '@/components/templates/DialogHapp';
import { AuthProvider } from '@/context/auth';

export const metadata: Metadata = {
  title: 'CloverHapp',
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

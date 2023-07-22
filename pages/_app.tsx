import '@/styles/base.css';
import type { AppProps as NextAppProps } from 'next/app';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';

type AppProps = NextAppProps;

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={inter.variable}>
      <ClerkProvider {...pageProps}>
        <Component {...pageProps} />
      </ClerkProvider>
    </main>
  );
}

export default MyApp;

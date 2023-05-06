import '@/styles/globals.css';
import { Noto_Serif_Hebrew } from 'next/font/google';
import StoreProvider from '@/contexts/store-context';

const noto = Noto_Serif_Hebrew({
  subsets: ['latin'],
});

export default function App({ Component, pageProps }) {
  return (
    <main className={noto.className}>
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </main>
  )
}

import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '../redux/store'; // Change to default import
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </Provider>
  );
}
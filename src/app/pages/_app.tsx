// pages/_app.js

import { AppProps } from 'next/app'; // Import the AppProps type from Next.js

import '../styles/globals.css'; // Import global styles

function MyApp({ Component, pageProps }: AppProps) {
  // Use the MyApp component to wrap all other pages
  return <Component {...pageProps} />;
}

export default MyApp;

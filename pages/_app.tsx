import { LanguageProvider } from "../src/context/LanguageContext";
import "appevent/src/app/globals.css"

import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}

export default MyApp;

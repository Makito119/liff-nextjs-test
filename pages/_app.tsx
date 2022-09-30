import "../styles/globals.css";
import type { AppProps } from "next/app";
import type { Liff } from "@line/liff";
import { useState, useEffect } from "react";

import { UserProfile, UserProvider } from '@auth0/nextjs-auth0';
import Header from "./components/Header";

type PageProps = {
  liff: Liff | null;
  liffError: string | null;
  user: UserProfile | undefined;
};
function MyApp({ Component, pageProps }: AppProps<PageProps>) {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const { user } = pageProps;
  // Execute liff.init() when the app is initialized
  useEffect(() => {
    // to avoid `window is not defined` error
    import("@line/liff")
      .then((liff) => liff.default)
      .then((liff) => {
        console.log("LIFF init...");
        liff
          .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
          .then(() => {
            console.log("LIFF init succeeded.");
            setLiffObject(liff);
          })
          .catch((error: Error) => {
            console.log("LIFF init failed.");
            setLiffError(error.toString());
          });
      });
  }, []);

  // Provide `liff` object and `liffError` object
  // to page component as property
  pageProps.liff = liffObject;
  pageProps.liffError = liffError;
  return (
    <UserProvider user={user}>
      <Header/>
      <Component {...pageProps} />
    </UserProvider>
    
  );
}

export default MyApp;

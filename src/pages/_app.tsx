import type { AppProps } from "next/app";
import { FirebaseContainer } from "@/containers/FirebaseContainer";
import { AuthUserProvider } from "src/containers/AuthUserContainer"
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FirebaseContainer>
      <AuthUserProvider>
        <Component {...pageProps} />
      </AuthUserProvider>
    </FirebaseContainer>
  );
}

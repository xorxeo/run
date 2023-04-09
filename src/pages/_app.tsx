import type { AppProps } from "next/app";
import { FirebaseContainer } from "@/containers/FirebaseContainer";
import { AuthUserProvider } from "src/containers/AuthUserContainer"
import "@/styles/globals.css";
import { DataTransferContainer } from "@/containers/DataTransferContainer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FirebaseContainer>
      <AuthUserProvider>
        <DataTransferContainer>
          <Component {...pageProps} />
        </DataTransferContainer>
      </AuthUserProvider>
    </FirebaseContainer>
  );
}

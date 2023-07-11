'use client';

import { StoreProvider } from "./redux/provider";
import { ReactNode } from "react";
import { AuthContextProvider, useAuthContext } from "@/context/AuthContext";

export function Providers({ children }: { children: ReactNode }) {
    return (
      <StoreProvider>
        <AuthContextProvider>{children}</AuthContextProvider>
      </StoreProvider>
    );
}